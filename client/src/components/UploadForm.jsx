import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateReviewer, isMockApiEnabled } from '../api/materials.js'
import Button from './Button.jsx'
import Spinner from './Spinner.jsx'

const MAX_FILE_SIZE = 10 * 1024 * 1024
const EXTRACTION_TIMEOUT_MS = 20_000

// Rejects an extraction that does not finish within the UI's wait limit.
function withExtractionTimeout(extraction) {
  let timeoutId
  const timeout = new Promise((resolve, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error('PDF extraction timed out')), EXTRACTION_TIMEOUT_MS)
  })

  return Promise.race([extraction, timeout]).finally(() => window.clearTimeout(timeoutId))
}

// Validates, scans, and reports the text of an uploaded PDF.
export default function UploadForm({ onReviewerCreated }) {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [course, setCourse] = useState('')
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [extracted, setExtracted] = useState(null)
  const [canRetry, setCanRetry] = useState(false)
  const inputRef = useRef(null)

  // Resets the picker and feedback so another file can be selected.
  function clearSelection() {
    setFile(null)
    setError('')
    setExtracted(null)
    setCanRetry(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  // Validates each selected file before enabling the scan action.
  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0] ?? null
    setFile(selectedFile)
    setError('')
    setExtracted(null)
    setCanRetry(false)

    if (selectedFile && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Choose a PDF file (.pdf).')
    } else if (selectedFile && selectedFile.size > MAX_FILE_SIZE) {
      setError('This PDF is too large. Choose a file that is 10 MB or smaller.')
    }
  }

  // Generates a reviewer from cached extracted text, including retries.
  async function generateFromExtracted(pending) {
    setGenerating(true)
    setError('')
    try {
      const reviewer = await generateReviewer(pending.content, pending.material.title, pending.material.course)
      if (
        !Array.isArray(reviewer.summary) ||
        !Array.isArray(reviewer.findings) ||
        !Array.isArray(reviewer.keyTerms) ||
        !Array.isArray(reviewer.questions)
      ) {
        throw new Error('We could not generate your study guide. Please retry.')
      }
      onReviewerCreated({
        ...pending.material,
        summary: reviewer.summary,
        findings: reviewer.findings,
        keyTerms: reviewer.keyTerms,
        reviewerTitle: reviewer.title,
      }, reviewer.questions)
      navigate(`/materials/${pending.material.id}`)
      setFile(null)
      setExtracted(null)
      setCanRetry(false)
      if (inputRef.current) inputRef.current.value = ''
    } catch (requestError) {
      const isUnreadable = requestError.message === "This PDF doesn't have enough readable content."
      const message = requestError.isReviewerError
        ? requestError.message
        : 'We could not generate your study guide. Please retry.'
      setError(isUnreadable ? requestError.message : message)
      setCanRetry(!isUnreadable)
    } finally {
      setGenerating(false)
    }
  }

  // Extracts the PDF once, then passes its text to reviewer generation.
  async function handleSubmit(event) {
    event.preventDefault()
    if (!file) {
      setError('Choose a PDF file to scan.')
      return
    }
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Choose a PDF file (.pdf).')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('This PDF is too large. Choose a file that is 10 MB or smaller.')
      return
    }
    if (course.trim().length > 120) {
      setError('Course name must be 120 characters or fewer.')
      return
    }

    setError('')
    setScanning(true)
    setScanProgress(null)
    let pending = null
    try {
      const content = await withExtractionTimeout((async () => {
        const { default: extractPdfText } = await import('../utils/extractPdfText.js')
        return extractPdfText(file, (pageNumber, totalPages) => {
          setScanProgress({ pageNumber, totalPages })
        })
      })())
      pending = {
        content,
        material: {
          id: crypto.randomUUID(),
          title: file.name.replace(/\.pdf$/i, '').trim() || 'Study notes',
          course: course.trim(),
          content,
          uploadedAt: new Date().toISOString(),
        },
      }
      setExtracted(pending)
    } catch (extractionError) {
      const message = extractionError.message === 'PDF extraction timed out' ||
        extractionError.message === 'This PDF looks scanned or has no readable text.'
        ? extractionError.message
        : 'We could not read this PDF. Please try another file.'
      setError(message)
    } finally {
      setScanning(false)
      setScanProgress(null)
    }

    if (pending) await generateFromExtracted(pending)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-tight text-text">
      <label htmlFor="course-name" className="block text-body font-bold">Course or subject <span className="font-normal text-white/75">(optional)</span></label>
      <input
        id="course-name"
        type="text"
        value={course}
        onChange={(event) => setCourse(event.target.value)}
        maxLength={120}
        placeholder="e.g. General Biology, Unit 3"
        disabled={scanning || generating}
        className="block w-full rounded-md border border-text/20 bg-surface px-3 py-2 text-small text-text outline-none placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
      />
      <p className="text-small text-white/80">
        {isMockApiEnabled
          ? 'Course context is saved with the study guide. Offline demo mode does not use AI or web search.'
          : 'Course context helps focus the guide. Automatic web search is not available; analysis uses your PDF only.'}
      </p>
      <label htmlFor="pdf-upload" className="block text-body font-bold">Choose a text-based PDF (up to 10 MB)</label>
      <input
        ref={inputRef}
        id="pdf-upload"
        type="file"
        accept=".pdf"
        disabled={scanning || generating}
        onChange={handleFileChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'pdf-upload-error' : undefined}
        className="block w-full rounded-md border border-text/20 bg-surface p-tight text-small file:mr-tight file:rounded-md file:border-0 file:bg-bg file:px-tight file:py-1 file:font-bold file:text-text disabled:opacity-60"
      />
      {error && <p id="pdf-upload-error" className="text-small font-bold" role="alert">{error}</p>}
      <div className="flex flex-wrap items-center gap-tight">
        {scanning && <Spinner label={scanProgress ? `Scanning page ${scanProgress.pageNumber} of ${scanProgress.totalPages}...` : 'Scanning your document...'} />}
        {generating && <Spinner label="Analyzing the PDF and checking source details..." />}
        {!scanning && !generating && !extracted && <Button type="submit" disabled={!file || Boolean(error)}>Analyze PDF</Button>}
        {!scanning && !generating && extracted && canRetry && <Button type="button" onClick={() => generateFromExtracted(extracted)}>Retry analysis</Button>}
        {file && !scanning && !generating && <Button type="button" variant="secondary" onClick={clearSelection}>Choose another PDF</Button>}
      </div>
    </form>
  )
}