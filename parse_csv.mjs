import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Read the V2_3 CSV file (most complete version, has answers + explanations + PDF page)
// Columns: Chương, Trang PDF, Câu hỏi, ĐA A, ĐA B, ĐA C, ĐA D, Đáp án đúng, Giải thích đáp án
const csvPath = path.join(__dirname, 'DuLieu_TracNghiem_TTHCM_V2_3.csv')
const raw = readFileSync(csvPath, 'utf8')

// Parse CSV properly (handles quoted fields with commas/newlines)
function parseCSV(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    const next = text[i + 1]

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"'
        i++
      } else if (ch === '"') {
        inQuotes = false
      } else {
        field += ch
      }
    } else {
      if (ch === '"') {
        inQuotes = true
      } else if (ch === ',') {
        row.push(field)
        field = ''
      } else if (ch === '\r' && next === '\n') {
        row.push(field)
        field = ''
        rows.push(row)
        row = []
        i++
      } else if (ch === '\n') {
        row.push(field)
        field = ''
        rows.push(row)
        row = []
      } else {
        field += ch
      }
    }
  }
  // last row
  if (field || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  return rows
}

const rows = parseCSV(raw)
// Skip header row
const dataRows = rows.slice(1)

// Clean a string: normalize spaces, remove extra whitespace
function clean(s) {
  if (!s) return ''
  return s
    .replace(/\s+/g, ' ')
    .replace(/ +/g, ' ')
    .trim()
}

// Normalize chapter names: convert Roman numerals to Arabic
function normalizeChapter(ch) {
  const map = {
    'Chương MỞ ĐẦU': 'Mở đầu',
    'Chương I': 'Chương 1',
    'Chương II': 'Chương 2',
    'Chương III': 'Chương 3',
    'Chương IV': 'Chương 4',
    'Chương V': 'Chương 5',
    'Chương VI': 'Chương 6',
    'Chương VII': 'Chương 7',
  }
  return map[ch] ?? ch
}

const questions = []
let id = 1

for (const row of dataRows) {
  // V2 columns: [0]=Chương, [1]=Trang PDF, [2]=Câu hỏi, [3]=ĐA A, [4]=ĐA B, [5]=ĐA C, [6]=ĐA D, [7]=Đáp án đúng, [8]=Giải thích
  if (row.length < 8) continue

  const chapter = normalizeChapter(clean(row[0]))
  const pdfPage = parseInt(clean(row[1]), 10) || null
  const question = clean(row[2])
  const optA = clean(row[3])
  const optB = clean(row[4])
  const optC = clean(row[5])
  const optD = clean(row[6])
  const answer = clean(row[7]).toUpperCase()
  const explanation = clean(row[8] ?? '')

  // Skip rows missing required data
  if (!chapter || !question) continue
  if (!optA || !optB || !optC || !optD) continue
  if (!['A', 'B', 'C', 'D'].includes(answer)) continue

  questions.push({
    id: id++,
    chapter,
    pdfPage,
    question,
    options: { A: optA, B: optB, C: optC, D: optD },
    answer,
    explanation,
  })
}

console.log(`Parsed ${questions.length} valid questions out of ${dataRows.length} rows`)

// Group by chapter
const byChapter = {}
for (const q of questions) {
  if (!byChapter[q.chapter]) byChapter[q.chapter] = 0
  byChapter[q.chapter]++
}
console.log('By chapter:', byChapter)

// Write output
const outPath = path.join(__dirname, 'app', 'src', 'data', 'questions.json')
writeFileSync(outPath, JSON.stringify(questions, null, 2), 'utf8')
console.log(`Written to ${outPath}`)
