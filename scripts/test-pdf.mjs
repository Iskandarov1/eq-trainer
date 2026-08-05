// QA smoke test: generate entry + day reports in all three languages and make
// sure nothing throws (pdf-lib throws on any glyph missing from the font).
// Run: node scripts/test-pdf.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildEntryReport, buildDayReport } from '../src/pdf.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const out = path.join(here, 'pdf-test-out')
fs.mkdirSync(out, { recursive: true })

const entry = {
  id: '5b2f9e64-1111-4222-8333-abcdef012345',
  date: '2026-08-05T14:32:12.000Z',
  intensity: 7,
  trigger: 'Коллега перебил меня на встрече — «опять всё по-старому», подумал я. Long-unbroken-word-test: ' + 'x'.repeat(300),
  emotion: 'dignity',
  reframe: 'Bu vaziyatda men oʻzimni bosiqlik bilan tutdim; gʻazab oʻtkinchi, maʼno esa qoladi. Tutuq belgisi: aʼlo.',
  took: true,
}

const dayData = {
  done: true,
  doneAt: '2026-08-05T18:05:00.000Z',
  fields: {
    'checkin.morning': 'Utrom — spokoystvie. Уверенность и лёгкая тревога одновременно.',
    'checkin.noon': 'Kunduzi — xotirjamlik, biroz charchoq. Oʻzimni kuzatdim.',
    'reflect.note': 'В конце дня я заметил(а), что пауза перед ответом делает разговор мягче.\nВторая строка записи.',
  },
}

for (const lang of ['en', 'ru', 'uz']) {
  const e = await buildEntryReport({ entry, emotion: 'anger', lang, uid: 'test-uid' })
  fs.writeFileSync(path.join(out, `entry-${lang}.pdf`), e.bytes)
  const d = await buildDayReport({ day: '3', dayData, lang, uid: 'test-uid' })
  fs.writeFileSync(path.join(out, `day-${lang}.pdf`), d.bytes)
  console.log(`${lang}: entry ${e.bytes.length} B (${e.path}), day ${d.bytes.length} B (${d.path})`)
}
console.log('OK')
