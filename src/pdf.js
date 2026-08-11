// Client-side PDF report builder (pdf-lib + embedded subsetted Noto Sans).
// Everything renders locally in the browser — report text never leaves the
// device except as the finished PDF uploaded to the user's private folder.
import { PDFDocument, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import notoRegularB64 from './fonts/notoSansRegular.js'
import notoBoldB64 from './fonts/notoSansBold.js'
import { L, UI, EMOTION_NAMES, FIELD_LABELS, optionLabel } from './content.js'
import { fmtDate, fmtDateTime, weekForDay, CHECKIN_SLOTS } from './store.js'

const A4 = [595.28, 841.89]
const MARGIN = 56
const INK = rgb(0.08, 0.08, 0.08)
const SOFT = rgb(0.54, 0.54, 0.52)
const ACCENT = rgb(0.86, 0.65, 0.84) // #DCA6D6

function b64ToBytes(b64) {
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

let fontBytes = null
function fonts() {
  if (!fontBytes) fontBytes = { regular: b64ToBytes(notoRegularB64), bold: b64ToBytes(notoBoldB64) }
  return fontBytes
}

// Deterministic ASCII storage key parts from a record's own timestamp (local
// time) — retries always produce the same path, so duplicates can't pile up.
function localStamp(iso) {
  const d = new Date(iso)
  const two = (n) => String(n).padStart(2, '0')
  return {
    date: `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}`,
    time: `${two(d.getHours())}${two(d.getMinutes())}${two(d.getSeconds())}`,
  }
}

export const entryReportPath = (uid, entry, emotion) => {
  const s = localStamp(entry.date)
  return `${uid}/${s.date}_${emotion}_${s.time}.pdf`
}
export const dayReportPath = (uid, day, dayData) => {
  const s = localStamp(dayData.doneAt || new Date().toISOString())
  return `${uid}/${s.date}_day${String(day).padStart(2, '0')}_${s.time}.pdf`
}
// A check-in grows during the day (morning → evening) but the archive bucket is
// append-only, so each save archives a fresh snapshot keyed by the latest
// savedAt — the last file of the day is always the complete record, and retries
// of an unchanged state hit the same path (409 = success).
export const checkinReportPath = (uid, date, checkin) => {
  const times = CHECKIN_SLOTS.map((k) => checkin[k]?.savedAt).filter(Boolean).sort()
  const s = localStamp(times[times.length - 1] || `${date}T12:00:00`)
  return `${uid}/${date}_checkin_${s.time}.pdf`
}

/* ---------------- low-level typesetting ---------------- */

function makeWriter(doc, fontR, fontB) {
  let page = doc.addPage(A4)
  let y = A4[1] - MARGIN
  const width = A4[0] - MARGIN * 2

  const newPage = () => { page = doc.addPage(A4); y = A4[1] - MARGIN }
  const need = (h) => { if (y - h < MARGIN + 24) newPage() }

  // Word wrap with hard char-breaking for pathological unbroken strings.
  const wrapLines = (text, font, size) => {
    const lines = []
    for (const raw of String(text).split('\n')) {
      const words = raw.split(/\s+/).filter(Boolean)
      if (!words.length) { lines.push(''); continue }
      let line = ''
      const pushWord = (w) => {
        const candidate = line ? `${line} ${w}` : w
        if (font.widthOfTextAtSize(candidate, size) <= width) { line = candidate; return }
        if (line) { lines.push(line); line = '' }
        if (font.widthOfTextAtSize(w, size) <= width) { line = w; return }
        let piece = ''
        for (const ch of w) {
          if (font.widthOfTextAtSize(piece + ch, size) > width) { lines.push(piece); piece = ch }
          else piece += ch
        }
        line = piece
      }
      words.forEach(pushWord)
      if (line) lines.push(line)
    }
    return lines
  }

  const text = (str, { size = 11, bold = false, color = INK, gap = 4, lineGap = 1.35 } = {}) => {
    const font = bold ? fontB : fontR
    const lineH = size * lineGap
    for (const line of wrapLines(str, font, size)) {
      need(lineH)
      page.drawText(line, { x: MARGIN, y: y - size, size, font, color })
      y -= lineH
    }
    y -= gap
  }

  const rule = (color = ACCENT) => {
    need(14)
    page.drawLine({ start: { x: MARGIN, y: y - 6 }, end: { x: MARGIN + 46, y: y - 6 }, thickness: 2, color })
    y -= 18
  }

  const space = (h) => { need(h); y -= h }

  const footerAll = (label) => {
    for (const p of doc.getPages()) {
      p.drawText(label, {
        x: A4[0] / 2 - fontR.widthOfTextAtSize(label, 8) / 2,
        y: MARGIN / 2, size: 8, font: fontR, color: SOFT,
      })
    }
  }

  return { text, rule, space, footerAll }
}

async function newDoc() {
  const doc = await PDFDocument.create()
  doc.registerFontkit(fontkit)
  const { regular, bold } = fonts()
  const fontR = await doc.embedFont(regular, { subset: true })
  const fontB = await doc.embedFont(bold, { subset: true })
  return { doc, fontR, fontB }
}

const boolWord = (lang, v) => (v ? L(lang, UI.yesWord) : '—')

/* ---------------- entry report (emotion practice) ---------------- */

// Keys that are metadata, not answers (legacyId = pre-migration id)
const ENTRY_SKIP = new Set(['id', 'date', 'intensity', 'legacyId'])

export async function buildEntryReport({ entry, emotion, lang, uid }) {
  const { doc, fontR, fontB } = await newDoc()
  const w = makeWriter(doc, fontR, fontB)
  const t = (k, ...a) => { const v = L(lang, UI[k]); return typeof v === 'function' ? v(...a) : v }

  w.text(t('reportEntryTitle', L(lang, EMOTION_NAMES[emotion])), { size: 20, bold: true, gap: 2 })
  const meta = [fmtDateTime(lang, entry.date), entry.intensity ? `${t('intensity')}: ${entry.intensity}/10` : null]
  w.text(meta.filter(Boolean).join('  ·  ').toUpperCase(), { size: 8.5, color: SOFT, gap: 2 })
  w.rule()

  for (const [k, v] of Object.entries(entry)) {
    if (ENTRY_SKIP.has(k) || v === null || v === undefined || v === '' || (Array.isArray(v) && !v.length)) continue
    const label = FIELD_LABELS[k] ? L(lang, FIELD_LABELS[k]) : k
    const val = Array.isArray(v)
      ? v.filter((x) => (typeof x === 'string' ? x.trim() : x)).map((x) => optionLabel(lang, x)).join(', ')
      : typeof v === 'boolean'
        ? boolWord(lang, v)
        : k === 'tookDate'
          ? fmtDate(lang, v)
          : k === 'emotion' || k === 'threat'
            ? optionLabel(lang, String(v))
            : String(v)
    if (!val) continue
    w.text(label.toUpperCase(), { size: 8.5, bold: true, color: SOFT, gap: 1 })
    w.text(val, { size: 11, gap: 10 })
  }

  w.footerAll('EQ Trainer')
  return { path: entryReportPath(uid, entry, emotion), bytes: await doc.save() }
}

/* ---------------- journey day report ---------------- */

export async function buildDayReport({ day, dayData, lang, uid }) {
  const { doc, fontR, fontB } = await newDoc()
  const w = makeWriter(doc, fontR, fontB)
  const t = (k, ...a) => { const v = L(lang, UI[k]); return typeof v === 'function' ? v(...a) : v }
  const week = weekForDay(Number(day))

  w.text(`${t('reportDayTitle', day)} — ${week ? L(lang, week.title) : ''}`, { size: 20, bold: true, gap: 2 })
  w.text(fmtDateTime(lang, dayData.doneAt || new Date().toISOString()).toUpperCase(), { size: 8.5, color: SOFT, gap: 2 })
  w.rule()

  for (const p of week?.practices || []) {
    const answered = (p.fields || []).filter((f) => {
      const v = dayData.fields?.[`${p.id}.${f.id}`]
      return v !== undefined && v !== null && v !== '' && f.t !== 'breathing'
    })
    if (!answered.length) continue
    w.text(L(lang, p.title), { size: 13, bold: true, gap: 6 })
    for (const f of answered) {
      const v = dayData.fields[`${p.id}.${f.id}`]
      if (f.label) w.text(L(lang, f.label).toUpperCase(), { size: 8.5, bold: true, color: SOFT, gap: 1 })
      w.text(typeof v === 'boolean' ? boolWord(lang, v) : String(v), { size: 11, gap: 8 })
    }
    w.space(6)
  }

  w.footerAll('EQ Trainer')
  return { path: dayReportPath(uid, day, dayData), bytes: await doc.save() }
}

/* ---------------- daily check-in report ---------------- */

const CHECKIN_LABELS = { morning: 'ritualMorning', day: 'ritualDay', evening: 'ritualEvening' }

export async function buildCheckinReport({ date, checkin, lang, uid }) {
  const { doc, fontR, fontB } = await newDoc()
  const w = makeWriter(doc, fontR, fontB)
  const t = (k, ...a) => { const v = L(lang, UI[k]); return typeof v === 'function' ? v(...a) : v }

  w.text(t('checkinTitle'), { size: 20, bold: true, gap: 2 })
  w.text(fmtDate(lang, `${date}T12:00:00`).toUpperCase(), { size: 8.5, color: SOFT, gap: 2 })
  w.rule()

  for (const slot of CHECKIN_SLOTS) {
    const s = checkin[slot]
    if (!s?.savedAt) continue
    const at = new Date(s.savedAt)
    const hhmm = `${String(at.getHours()).padStart(2, '0')}:${String(at.getMinutes()).padStart(2, '0')}`
    w.text(`${L(lang, UI[CHECKIN_LABELS[slot]])} · ${hhmm}`.toUpperCase(), { size: 8.5, bold: true, color: SOFT, gap: 1 })
    w.text(s.text, { size: 11, gap: 10 })
  }

  w.footerAll('EQ Trainer')
  return { path: checkinReportPath(uid, date, checkin), bytes: await doc.save() }
}

/* ---------------- browser download helper ---------------- */

export function downloadPdf(bytes, filename) {
  const blob = new Blob([bytes], { type: 'application/pdf' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}
