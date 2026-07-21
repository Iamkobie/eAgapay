import { useState } from 'react'
import { X, Globe, AlertCircle, CheckCircle, Loader2, Calendar, MapPin, FileText, Phone, Info } from 'lucide-react'

interface ProgramSubmitModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ExtractedProgram {
  name: string
  locations: string
  validity: string
  requirements: string
  contact: string
}

export function ProgramSubmitModal({ isOpen, onClose }: ProgramSubmitModalProps) {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle')
  const [error, setError] = useState('')
  const [extractedData, setExtractedData] = useState<ExtractedProgram | null>(null)

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url)
      // Check if it's a government domain
      const validDomains = ['.gov.ph', 'gov.ph']
      return validDomains.some(domain => urlObj.hostname.endsWith(domain))
    } catch {
      return false
    }
  }

  const handleSubmit = async () => {
    if (!url.trim()) {
      setError('Please enter a URL')
      setStatus('error')
      return
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid government website URL (must end with .gov.ph)')
      setStatus('error')
      return
    }

    setStatus('loading')
    setError('')

    // Simulate API call for extraction
    setTimeout(() => {
      // Simulated extracted data
      setExtractedData({
        name: 'Libreng Tuli Program',
        locations: 'Barangay 1, 2, 3 - Manila',
        validity: 'January 15, 2026 - January 20, 2026',
        requirements: 'Birth certificate, Parent/Guardian ID',
        contact: 'Barangay Hall: 02-1234-5678'
      })
      setStatus('success')
    }, 2000)
  }

  const handleFinalSubmit = () => {
    // Here you would submit the data to your backend
    console.log('Submitting program:', extractedData)
    alert('Program submitted successfully!')
    handleClose()
  }

  const handleClose = () => {
    setUrl('')
    setStatus('idle')
    setError('')
    setExtractedData(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Add a Government Benefit/Program</h2>
            <p className="text-sm text-slate-500 mt-1">
              Help build a centralized list of local government programs
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {status === 'idle' || status === 'error' ? (
            <div className="space-y-6">
              {/* URL Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Program URL
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value)
                      if (status === 'error') setStatus('idle')
                    }}
                    placeholder="https://example.gov.ph/program"
                    className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#0342EE] transition-colors"
                  />
                </div>
                {status === 'error' && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Valid URLs only</p>
                    <p className="text-blue-700">
                      Only government websites ending in .gov.ph are accepted. This ensures the program information is official and verified.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!url.trim()}
                  className="flex-1 px-6 py-3 bg-[#0342EE] text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Globe size={18} />
                  Fetch Info
                </button>
              </div>
            </div>
          ) : status === 'loading' ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-[#0342EE] animate-spin mb-4" />
              <p className="text-lg font-semibold text-slate-900 mb-2">Fetching program information...</p>
              <p className="text-slate-500 text-sm">Please wait while we extract the details</p>
            </div>
          ) : status === 'success' && extractedData ? (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">Information extracted successfully!</p>
                  <p className="text-sm text-green-700">Please review and edit the details below before submitting.</p>
                </div>
              </div>

              {/* Extracted Data Form */}
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
                    <FileText size={16} />
                    Program Name
                  </label>
                  <input
                    type="text"
                    value={extractedData.name}
                    onChange={(e) => setExtractedData({ ...extractedData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#0342EE] transition-colors"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
                    <MapPin size={16} />
                    Locations / Barangay Coverage
                  </label>
                  <input
                    type="text"
                    value={extractedData.locations}
                    onChange={(e) => setExtractedData({ ...extractedData, locations: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#0342EE] transition-colors"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
                    <Calendar size={16} />
                    Validity Period / Schedule
                  </label>
                  <input
                    type="text"
                    value={extractedData.validity}
                    onChange={(e) => setExtractedData({ ...extractedData, validity: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#0342EE] transition-colors"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
                    <FileText size={16} />
                    Requirements / Documents Needed
                  </label>
                  <textarea
                    value={extractedData.requirements}
                    onChange={(e) => setExtractedData({ ...extractedData, requirements: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#0342EE] transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
                    <Phone size={16} />
                    Contact Information
                  </label>
                  <input
                    type="text"
                    value={extractedData.contact}
                    onChange={(e) => setExtractedData({ ...extractedData, contact: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#0342EE] transition-colors"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setStatus('idle')
                    setExtractedData(null)
                  }}
                  className="flex-1 px-6 py-3 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleFinalSubmit}
                  className="flex-1 px-6 py-3 bg-[#0342EE] text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} />
                  Submit Program
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
