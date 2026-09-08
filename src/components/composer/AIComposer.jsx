import { useState } from 'react'
import { Sparkles, Check, RefreshCw, X } from 'lucide-react'
import { generateContent } from '../../api/ai'
import { useToast } from '../../context/ToastContext'

const TONES = [
  'Professional',
  'Casual',
  'Engaging & Inspiring',
  'Promotional',
  'Thought Leadership',
  'Educational',
]

export default function AIComposer({ platform, onApplyContent, onClose }) {
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('Professional')
  const [includeHashtags, setIncludeHashtags] = useState(true)
  const [loading, setLoading] = useState(false)
  const [generatedText, setGeneratedText] = useState('')
  const toast = useToast()

  const handleGenerate = async (e) => {
    if (e) e.preventDefault()
    if (!topic.trim()) {
      toast.error('Please enter a topic or prompt.')
      return
    }

    try {
      setLoading(true)
      const data = await generateContent({
        topic: topic.trim(),
        platform: platform || 'GENERAL',
        tone,
        includeHashtags,
      })

      if (data && data.generatedContent) {
        setGeneratedText(data.generatedContent)
        toast.success('Content generated!')
      } else {
        toast.error('No content was generated.')
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to generate AI content'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleUseContent = () => {
    if (generatedText) {
      onApplyContent(generatedText)
      toast.info('Applied generated content to post')
      if (onClose) onClose()
    }
  }

  return (
    <div className="ai-panel">
      <div className="ai-panel-header">
        <div className="ai-panel-title">
          <Sparkles size={16} />
          <span>AI Content Assistant</span>
        </div>
        {onClose && (
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            title="Close AI Assistant"
          >
            <X size={15} />
          </button>
        )}
      </div>

      <div className="ai-panel-body">
        <div className="form-group">
          <label className="form-label">What do you want to post about?</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Launching our new product feature with 2x speed..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={loading}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Tone</label>
            <select
              className="form-select"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              disabled={loading}
            >
              {TONES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ justifyContent: 'center', marginTop: 18 }}>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={includeHashtags}
                onChange={(e) => setIncludeHashtags(e.target.checked)}
                disabled={loading}
              />
              <span>Include Hashtags</span>
            </label>
          </div>
        </div>

        <div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            style={{ width: '100%' }}
          >
            {loading ? (
              <>
                <div className="spinner spinner-sm" style={{ borderTopColor: '#fff' }} />
                Generating content...
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Generate
              </>
            )}
          </button>
        </div>

        {generatedText && (
          <div>
            <div className="ai-result">
              {generatedText}
            </div>
            <div className="ai-result-actions">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleUseContent}
              >
                <Check size={14} />
                Use Content
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleGenerate}
                disabled={loading}
              >
                <RefreshCw size={13} />
                Regenerate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
