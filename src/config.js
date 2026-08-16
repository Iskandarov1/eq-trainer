// Supabase project coordinates — both values are PUBLIC by design (security is
// enforced server-side by row-level security policies, see supabase-setup.sql).
//
// This points at the SELF-HOSTED stack on 169.58.92.31, proxied by nginx on the
// same origin as the app: supabase-js appends /auth/v1, /rest/v1 and /storage/v1
// to this URL, and nginx forwards those three prefixes to the gateway on
// 127.0.0.1:8000. Same-origin means no extra DNS record and no second cert.
//
// While empty, the app runs in local-only mode (no accounts, no sync) like v1.
export const SUPABASE_URL = 'https://eq-trainer.com'
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzg2ODgxNTExLCJleHAiOjE5NDQ1NjE1MTF9.X8AtQVmDazUaC5IdF6V7PAD6yEhgyPNlsBiwl0PCkOI'
