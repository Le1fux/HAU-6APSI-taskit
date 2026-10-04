import { useRef, useState } from 'react'
import { generateReviewer } from '../api/materials.js'
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
  const [file, setFile] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [extracted, setExtracted] = useState(null)
  const [canRetry, setCanRetry] = useState(false)
  const inputRef = useRef(null)

  // Resets the picker and feedback so another file can be selected.
  function clearSelection() {
    setFile(null)
    setError('')
    setSuccess('')
    setExtracted(null)
    setCanRetry(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  // Validates each selected file before enabling the scan action.
  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0] ?? null
    setFile(selectedFile)
    setError('')
    setSuccess('')
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
      const reviewer = await generateReviewer(pending.content, pending.material.title)
      if (!Array.isArray(reviewer.summary) || !Array.isArray(reviewer.questions)) {
        throw new Error('We could not generate your reviewer. Please retry.')
      }
      onReviewerCreated({
        ...pending.material,
        summary: reviewer.summary,
        reviewerTitle: reviewer.title,
      }, reviewer.questions)
      setSuccess('Your reviewer is ready.')
      setFile(null)
      setExtracted(null)
      setCanRetry(false)
      if (inputRef.current) inputRef.current.value = ''
    } catch (requestError) {
      const isUnreadable = requestError.message === "This PDF doesn't have enough readable content."
      const message = requestError.isReviewerError
        ? requestError.message
        : 'We could not generate your reviewer. Please retry.'
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

    setError('')
    setSuccess('')
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
          title: file.name,
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
      <label htmlFor="pdf-upload" className="block text-body font-bold">Study notes PDF</label>
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
      {success && <p className="text-small font-bold text-surface" role="status">{success}</p>}
      <div className="flex flex-wrap items-center gap-tight">
        {scanning && <Spinner label={scanProgress ? `Scanning page ${scanProgress.pageNumber} of ${scanProgress.totalPages}...` : 'Scanning your document...'} />}
        {generating && <Spinner label="Generating your reviewer..." />}
        {!scanning && !generating && !extracted && <Button type="submit" disabled={!file || Boolean(error)}>Scan PDF</Button>}
        {!scanning && !generating && extracted && canRetry && <Button type="button" onClick={() => generateFromExtracted(extracted)}>Retry reviewer</Button>}
        {file && !scanning && !generating && <Button type="button" variant="secondary" onClick={clearSelection}>Choose another PDF</Button>}
      </div>
    </form>
  )
}