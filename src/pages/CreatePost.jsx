import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Send, Calendar, Save } from 'lucide-react'
import { createPost, publishPost } from '../api/posts'
import { useToast } from '../context/ToastContext'
import MediaUploader from '../components/composer/MediaUploader'
import AIComposer from '../components/composer/AIComposer'
import PostPreview from '../components/composer/PostPreview'
import { PLATFORM_MAP } from '../components/ui/PlatformIcon'

const PLATFORMS = [
  { id: 'LINKEDIN', label: 'LinkedIn', icon: 'in' },
  { id: 'TWITTER', label: 'X / Twitter', icon: 'X' },
  { id: 'FACEBOOK', label: 'Facebook', icon: 'f' },
  { id: 'INSTAGRAM', label: 'Instagram', icon: 'ig' },
]

export default function CreatePost() {
  const [content, setContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState(['LINKEDIN'])
  const [mediaUrl, setMediaUrl] = useState('')
  const [publishMode, setPublishMode] = useState('NOW') // 'NOW' | 'SCHEDULE' | 'DRAFT'
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [showAi, setShowAi] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const navigate = useNavigate()
  const toast = useToast()

  const handleTogglePlatform = (platformId) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(platformId)) {
        if (prev.length === 1) {
          return prev
        }
        return prev.filter((p) => p !== platformId)
      } else {
        return [...prev, platformId]
      }
    })
  }

  const handleApplyAiContent = (aiText) => {
    setContent(aiText)
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()

    if (!selectedPlatforms || selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform.')
      return
    }

    if (!content.trim()) {
      toast.error('Post content cannot be blank.')
      return
    }

    if (selectedPlatforms.includes('INSTAGRAM') && !mediaUrl) {
      toast.warning('Instagram requires an attached image to publish.')
    }

    let status = 'DRAFT'
    let scheduledDateTimeIso = null

    if (publishMode === 'SCHEDULE') {
      if (!scheduleDate || !scheduleTime) {
        toast.error('Please specify both a date and time to schedule this post.')
        return
      }

      const scheduledDateObj = new Date(`${scheduleDate}T${scheduleTime}`)
      if (isNaN(scheduledDateObj.getTime())) {
        toast.error('Invalid schedule date or time.')
        return
      }

      if (scheduledDateObj <= new Date()) {
        toast.error('Scheduled time must be in the future.')
        return
      }

      status = 'SCHEDULED'
      // Format as local ISO string without timezone suffix for backend LocalDateTime
      scheduledDateTimeIso = `${scheduleDate}T${scheduleTime}:00`
    }

    try {
      setSubmitting(true)

      const payloads = selectedPlatforms.map((plat) => ({
        content: content.trim(),
        platform: plat,
        mediaUrl: mediaUrl || null,
        status: publishMode === 'DRAFT' ? 'DRAFT' : status,
        scheduledTime: scheduledDateTimeIso,
      }))

      const createdPosts = await Promise.all(payloads.map((payload) => createPost(payload)))

      if (publishMode === 'NOW') {
        const platformNames = selectedPlatforms
          .map((p) => PLATFORM_MAP[p]?.label || p)
          .join(', ')
        toast.info(`Publishing to ${platformNames}...`)
        try {
          await Promise.all(createdPosts.map((post) => publishPost(post.id)))
          toast.success(
            selectedPlatforms.length > 1
              ? 'All posts published successfully!'
              : 'Post published successfully!'
          )
          navigate('/posts')
          return
        } catch (pubErr) {
          const pubMsg =
            pubErr.response?.data?.message ||
            pubErr.message ||
            'Failed to publish post immediately.'
          toast.error(pubMsg)
          navigate('/posts')
          return
        }
      }

      if (publishMode === 'SCHEDULE') {
        toast.success(
          selectedPlatforms.length > 1
            ? 'Posts scheduled successfully!'
            : 'Post scheduled successfully!'
        )
      } else {
        toast.success(
          selectedPlatforms.length > 1
            ? 'Drafts saved successfully!'
            : 'Draft saved successfully!'
        )
      }

      navigate('/posts')
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create post.'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const charCount = content.length
  const isTwitter = selectedPlatforms.includes('TWITTER')
  const isOverTwitterLimit = isTwitter && charCount > 280

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Create Post</h1>
          <p className="page-subtitle">Compose, enhance with AI, and publish or schedule across platforms</p>
        </div>
      </div>

      <div className="composer-layout">
        {/* LEFT: Composer */}
        <div className="composer-panel">
          {/* Main Card */}
          <div className="card">
            {/* Content Textarea */}
            <div className="form-group mb-4">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <label className="composer-section-label" style={{ margin: 0 }}>
                  Write your content
                </label>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setShowAi((v) => !v)}
                  style={{ color: 'var(--color-primary)', fontWeight: 600 }}
                >
                  <Sparkles size={14} />
                  {showAi ? 'Hide AI Assistant' : 'Generate with AI'}
                </button>
              </div>

              <textarea
                className="form-textarea"
                placeholder="What's on your mind? Write your post or generate ideas using AI..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={submitting}
                style={{ minHeight: 160 }}
              />

              <div
                className={`char-counter ${
                  isOverTwitterLimit ? 'danger' : isTwitter && charCount > 240 ? 'warning' : ''
                }`}
              >
                {charCount} characters {isTwitter && `/ 280`}
              </div>
            </div>

            {/* AI Assistant Drawer */}
            {showAi && (
              <div className="mb-4">
                <AIComposer
                  platform={selectedPlatforms[0] || 'LINKEDIN'}
                  onApplyContent={handleApplyAiContent}
                  onClose={() => setShowAi(false)}
                />
              </div>
            )}

            {/* Platform Selection */}
            <div className="form-group mb-4">
              <label className="composer-section-label">Target Platforms</label>
              <div className="platform-selector">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`platform-btn ${selectedPlatforms.includes(p.id) ? 'selected' : ''}`}
                    onClick={() => handleTogglePlatform(p.id)}
                    disabled={submitting}
                  >
                    <span style={{ fontWeight: 700 }}>{p.icon}</span>
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Media Upload */}
            <div className="form-group mb-4">
              <label className="composer-section-label">Media Attachment</label>
              <MediaUploader mediaUrl={mediaUrl} onMediaChange={setMediaUrl} />
            </div>

            <div className="separator" />

            {/* Publishing Controls */}
            <div className="form-group mb-6">
              <label className="composer-section-label">Publishing Options</label>
              <div className="publish-options">
                <label className={`radio-card ${publishMode === 'NOW' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="publishMode"
                    value="NOW"
                    checked={publishMode === 'NOW'}
                    onChange={(e) => setPublishMode(e.target.value)}
                  />
                  <div>
                    <div className="radio-card-label">Publish Now</div>
                    <div className="radio-card-desc">Send this post to your selected platform immediately</div>
                  </div>
                </label>

                <label className={`radio-card ${publishMode === 'SCHEDULE' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="publishMode"
                    value="SCHEDULE"
                    checked={publishMode === 'SCHEDULE'}
                    onChange={(e) => setPublishMode(e.target.value)}
                  />
                  <div>
                    <div className="radio-card-label">Schedule for later</div>
                    <div className="radio-card-desc">Pick a specific date and time to publish automatically</div>
                  </div>
                </label>

                <label className={`radio-card ${publishMode === 'DRAFT' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="publishMode"
                    value="DRAFT"
                    checked={publishMode === 'DRAFT'}
                    onChange={(e) => setPublishMode(e.target.value)}
                  />
                  <div>
                    <div className="radio-card-label">Save as Draft</div>
                    <div className="radio-card-desc">Save your progress and publish whenever you're ready</div>
                  </div>
                </label>
              </div>

              {/* Date & Time Picker when Schedule is selected */}
              {publishMode === 'SCHEDULE' && (
                <div className="datetime-row mt-3">
                  <div className="form-group">
                    <label className="form-label">Publish Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={scheduleDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Publish Time</label>
                    <input
                      type="time"
                      className="form-input"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/posts')}
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={submitting || isOverTwitterLimit || !content.trim() || selectedPlatforms.length === 0}
              >
                {submitting ? (
                  <>
                    <div className="spinner spinner-sm" style={{ borderTopColor: '#fff' }} />
                    Processing...
                  </>
                ) : publishMode === 'NOW' ? (
                  <>
                    <Send size={15} />
                    Publish Now
                  </>
                ) : publishMode === 'SCHEDULE' ? (
                  <>
                    <Calendar size={15} />
                    Schedule Post
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    Save Draft
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Post Preview */}
        <div>
          <PostPreview
            content={content}
            mediaUrl={mediaUrl}
            platform={selectedPlatforms[0] || 'LINKEDIN'}
          />
        </div>
      </div>
    </div>
  )
}
