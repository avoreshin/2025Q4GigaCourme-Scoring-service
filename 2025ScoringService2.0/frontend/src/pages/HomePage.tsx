import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { startupsApi } from '../services/api'
import PitchUploader from '../components/PitchUploader'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()
  const [uploadStatus, setUploadStatus] = useState<string>('')

  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => startupsApi.upload(formData),
    onSuccess: (data) => {
      setUploadStatus('Upload successful!')
      // Navigate to edit page if it's a presentation
      if (data.data.content_type === 'pptx' || data.data.content_type === 'ppt') {
        navigate(`/pitch/${data.data.id}/edit`)
      } else {
        navigate(`/startup/${data.data.startup_id}`)
      }
    },
    onError: (error: any) => {
      setUploadStatus(`Error: ${error.response?.data?.detail || error.message}`)
    },
  })

  const handleUpload = (formData: FormData) => {
    setUploadStatus('Uploading...')
    uploadMutation.mutate(formData)
  }

  const isError = uploadStatus.includes('Error')

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-6 md:mb-12">
        <h1 className="text-2xl md:text-h1 font-semibold mb-3 md:mb-4 text-foreground">
          🎯 Startup Scorer
        </h1>
        <p className="text-sm md:text-body-lg text-muted-foreground max-w-2xl mx-auto px-4">
          Upload your pitch document (PDF, text, URL, Markdown, or PowerPoint) to get started with intelligent AI-powered scoring.
        </p>
      </div>

      {/* Upload Area */}
      <div className="glass rounded-lg p-4 md:p-8 mb-4 md:mb-6">
        <PitchUploader onUpload={handleUpload} />
      </div>

      {/* Status Message */}
      {uploadStatus && (
        <div
          className={`glass rounded-base p-3 md:p-4 flex items-center gap-2 md:gap-3 animate-slide-up ${
            isError
              ? 'border border-destructive/40 bg-destructive/10'
              : 'border border-success/40 bg-success/10'
          }`}
        >
          {isError ? (
            <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-destructive flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-success flex-shrink-0" />
          )}
          <p className={`text-sm md:text-body ${isError ? 'text-destructive' : 'text-success'}`}>
            {uploadStatus}
          </p>
        </div>
      )}
    </div>
  )
}

