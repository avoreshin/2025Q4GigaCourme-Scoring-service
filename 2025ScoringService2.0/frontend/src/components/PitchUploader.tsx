import { useState, useRef } from 'react'
import { FileText, Link as LinkIcon, Type } from 'lucide-react'

interface PitchUploaderProps {
  onUpload: (formData: FormData) => void
}

export default function PitchUploader({ onUpload }: PitchUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [name, setName] = useState('')
  const [industry, setIndustry] = useState('')
  const [stage, setStage] = useState('')
  const [geography, setGeography] = useState('')
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
  const [uploadType, setUploadType] = useState<'file' | 'url' | 'text'>('file')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFile = (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', name || file.name)
    if (industry) formData.append('industry', industry)
    if (stage) formData.append('stage', stage)
    if (geography) formData.append('geography', geography)
    onUpload(formData)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleUrlSubmit = () => {
    const formData = new FormData()
    formData.append('url', url)
    formData.append('name', name || 'Startup from URL')
    if (industry) formData.append('industry', industry)
    if (stage) formData.append('stage', stage)
    if (geography) formData.append('geography', geography)
    onUpload(formData)
  }

  const handleTextSubmit = () => {
    const formData = new FormData()
    formData.append('text', text)
    formData.append('name', name || 'Startup from Text')
    if (industry) formData.append('industry', industry)
    if (stage) formData.append('stage', stage)
    if (geography) formData.append('geography', geography)
    onUpload(formData)
  }

  return (
    <div className="space-y-6">
      {/* Upload Tabs */}
      <div className="flex space-x-2 border-b border-border/20">
        <button
          onClick={() => setUploadType('file')}
          className={`px-4 py-3 text-sm font-medium transition-colors relative ${
            uploadType === 'file'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>File Upload</span>
          </div>
        </button>
        <button
          onClick={() => setUploadType('url')}
          className={`px-4 py-3 text-sm font-medium transition-colors relative ${
            uploadType === 'url'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            <span>URL</span>
          </div>
        </button>
        <button
          onClick={() => setUploadType('text')}
          className={`px-4 py-3 text-sm font-medium transition-colors relative ${
            uploadType === 'text'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4" />
            <span>Paste Text</span>
          </div>
        </button>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Startup Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 bg-card border border-border rounded-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            required
            placeholder="Enter startup name"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Industry</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-4 py-2 bg-card border border-border rounded-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Tech, SaaS, etc."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Stage</label>
            <input
              type="text"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full px-4 py-2 bg-card border border-border rounded-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Seed, Series A, etc."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Geography</label>
            <input
              type="text"
              value={geography}
              onChange={(e) => setGeography(e.target.value)}
              className="w-full px-4 py-2 bg-card border border-border rounded-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="US, EU, etc."
            />
          </div>
        </div>

        {/* File Upload Area */}
        {uploadType === 'file' && (
          <div
            className={`glass rounded-lg p-12 text-center transition-all ${
              dragActive
                ? 'border-2 border-solid border-primary bg-primary/10'
                : 'border-2 border-dashed border-primary/40 hover:border-primary/60'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="mb-4">
              <FileText className="w-12 h-12 mx-auto text-primary mb-4" />
              <h3 className="text-h3 text-foreground mb-2">Upload Your Pitch</h3>
              <p className="text-body text-muted-foreground mb-6">
                Drag & Drop or Click to Select
              </p>
            </div>
            <p className="text-body-sm text-muted-foreground mb-6">
              Supported: PDF, Markdown (.md), PowerPoint (.pptx, .ppt), Text (.txt)
              <br />
              Max size: 50MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.md,.pptx,.ppt,.txt"
              onChange={handleFileInput}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-3 bg-gradient-to-r from-primary to-[#1A6873] text-primary-foreground font-semibold rounded-base hover:shadow-card-hover hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Browse Files
            </button>
          </div>
        )}

        {/* URL Input */}
        {uploadType === 'url' && (
          <div className="glass rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2 bg-card border border-border rounded-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="https://example.com/pitch"
              />
            </div>
            <button
              onClick={handleUrlSubmit}
              className="w-full px-8 py-3 bg-gradient-to-r from-primary to-[#1A6873] text-primary-foreground font-semibold rounded-base hover:shadow-card-hover hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Submit URL
            </button>
          </div>
        )}

        {/* Text Input */}
        {uploadType === 'text' && (
          <div className="glass rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Pitch Text</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-3 bg-card border border-border rounded-base text-foreground placeholder:text-muted-foreground min-h-[200px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y"
                placeholder="Paste your pitch text here..."
              />
            </div>
            <button
              onClick={handleTextSubmit}
              className="w-full px-8 py-3 bg-gradient-to-r from-primary to-[#1A6873] text-primary-foreground font-semibold rounded-base hover:shadow-card-hover hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Submit Text
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
