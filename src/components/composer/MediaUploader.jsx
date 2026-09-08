import { useState, useRef } from 'react'
import { Upload, X, RefreshCw, Image as ImageIcon } from 'lucide-react'
import { uploadMedia } from '../../api/media'
import { useToast } from '../../context/ToastContext'

export default function MediaUploader({ mediaUrl, onMediaChange }) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)
  const toast = useToast()

  const handleFileSelect = async (file) => {
    if (!file) return

    // Validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, and WEBP images are supported.')
      return
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      toast.error('File size exceeds the 10MB limit.')
      return
    }

    try {
      setUploading(true)
      const data = await uploadMedia(file)
      if (data && data.mediaUrl) {
        onMediaChange(data.mediaUrl)
        toast.success('Image uploaded successfully')
      } else {
        toast.error('Upload succeeded but no media URL returned.')
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to upload media'
      toast.error(msg)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
      />

      {mediaUrl ? (
        <div className="media-preview">
          <img src={mediaUrl} alt="Uploaded attachment" />
          <div className="media-preview-actions">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              title="Replace image"
            >
              <RefreshCw size={12} style={{ display: 'inline', marginRight: 4 }} />
              Replace
            </button>
            <button
              type="button"
              onClick={() => onMediaChange('')}
              disabled={uploading}
              title="Remove image"
            >
              <X size={12} style={{ display: 'inline', marginRight: 4 }} />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`media-upload-area ${dragOver ? 'dragover' : ''}`}
          onClick={() => !uploading && fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="media-upload-icon">
            {uploading ? (
              <div className="spinner spinner-sm" />
            ) : (
              <Upload size={16} />
            )}
          </div>
          <div className="media-upload-text">
            <strong>{uploading ? 'Uploading image...' : '+ Add media'}</strong>
            <span>JPG, PNG, WEBP · Max 10MB</span>
          </div>
        </div>
      )}
    </div>
  )
}
