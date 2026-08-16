#!/bin/sh
# Remove storage files whose database row is gone.
#
# delete_own_account() deletes rows from storage.objects, which clears the
# record but leaves the bytes on disk — exactly the orphaning that Storage's
# protect_delete() trigger warns about. Erasure is a promise made to users in
# the app's privacy note ("removes your entries, your stored PDFs and your
# login itself"), so the files have to actually go.
#
# Layout: <volume>/stub/stub/<bucket>/<name>/<version-uuid>
# The object is the DIRECTORY; the files inside it are its versions. So an
# object is orphaned when no storage.objects row matches "<bucket>/<name>".
#
# Install with:
#   cp scripts/storage-sweep.sh /opt/supabase/storage-sweep.sh && chmod +x it
set -eu

BASE=/opt/supabase/volumes/storage/stub/stub
COMPOSE_DIR=/opt/supabase
[ -d "$BASE" ] || exit 0

KNOWN=$(mktemp)
trap 'rm -f "$KNOWN"' EXIT

# Every live object, as "<bucket>/<name>".
cd "$COMPOSE_DIR"
docker compose exec -T db psql -U postgres -d postgres -tAc \
  "select bucket_id || '/' || name from storage.objects" | sed 's/[[:space:]]*$//' > "$KNOWN"

removed=0
# Each regular file is a version; its parent directory is the object itself.
find "$BASE" -mindepth 3 -type f | while read -r f; do
  dir=$(dirname "$f")
  rel=${dir#"$BASE"/}
  if ! grep -Fxq "$rel" "$KNOWN"; then
    rm -rf "$dir"
    removed=$((removed + 1))
    echo "$(date -Is) swept orphan: $rel"
  fi
done

# Tidy now-empty user folders so a deleted account leaves no trace of its uid.
find "$BASE" -mindepth 2 -type d -empty -delete 2>/dev/null || true

exit 0
