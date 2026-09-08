import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Send, Save, Trash2, Calendar, Sparkles } from 'lucide-react'
import { getPost, updatePost, publishPost, deletePost } from '../api/posts'
import { useToast } from '../context/ToastContext'
import MediaUploader from '../components/composer/MediaUploader'
import AIComposer from '../components/composer/AIComposer'
import PostPreview from '../components/composer/PostPreview'
import LoadingState from '../components/ui/LoadingState'
import StatusBadge from '../components/ui/StatusBadge'
import ConfirmDialog from '../components/ui/ConfirmDialog'

const PLATFORMS = [
  { id: 'LINKEDIN', label: 'LinkedIn', icon: 'in' },
  { id: 'TWITTER', label: 'X / Twitter', icon: 'X' },
  { id: 'FACEBOOK', label: 'Facebook', icon: 'f' },
  { id: 'INSTAGRAM', label: 'Instagram', icon: 'ig' },
]

export default function EditPost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [showAi, setShowAi] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState('LINKEDIN')
  const [mediaUrl, setMediaUrl] = useState('')
  const [status, setStatus] = useState('DRAFT')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [postData, setPostData] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const data = await getPost(id)
        setPostData(data)
        setContent(data.content || '')
        setPlatform(data.platform || 'LINKEDIN')
        setMediaUrl(data.mediaUrl || '')
        setStatus(data.status || 'DRAFT')

        if (data.scheduledTime) {
          const dt = new Date(data.scheduledTime)
          if (!isNaN(dt.getTime())) {
            const dateStr = dt.toISOString().split('T')[0]
            const hours = String(dt.getHours()).padStart(2, '0')
            const mins = String(dt.getMinutes()).padStart(2, '0')
            setScheduleDate(dateStr)
            setScheduleTime(`${hours}:${mins}`)
          }
        }
      } catch (err) {
        toast.error('Failed to load post.')
        navigate('/posts')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, navigate])

  const handleSave = async (e) => {
    if (e) e.preventDefault()
    if (!content.trim()) {
      toast.error('Post content cannot be blank.')
      return
    }

    let scheduledDateTimeIso = null
    let targetStatus = status

    if (scheduleDate && scheduleTime) {
      targetStatus = 'SCHEDULED'
      scheduledDateTimeIso = `${scheduleDate}T${scheduleTime}:00`
    }

    try {
      setSaving(true)
      const payload = {
        content: content.trim(),
        platform,
        mediaUrl: mediaUrl || null,
        status: targetStatus,
        scheduledTime: scheduledDateTimeIso,
      }

      await updatePost(id, payload)
      toast.success('Post updated successfully!')
      navigate('/posts')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update post.'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const handlePublishNow = async () => {
    try {
      setPublishing(true)
      // Save changes first if modified
      let scheduledDateTimeIso = scheduleDate && scheduleTime ? `${scheduleDate}T${scheduleTime}:00` : null
      await updatePost(id, {
        content: content.trim(),
        platform,
        mediaUrl: mediaUrl || null,
        status,
        scheduledTime: scheduledDateTimeIso,
      })

      await publishPost(id)
      toast.success('Post published successfully!')
      navigate('/posts')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to publish post.'
      toast.error(msg)
    } finally {
      setPublishing(false)
    }
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await deletePost(id)
      toast.success('Post deleted')
      navigate('/posts')
    } catch (err) {
      toast.error('Failed to delete post.')
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  if (loading) {
    return <LoadingState message="Loading post details..." />
  }

  const isTwitter = platform === 'TWITTER'
  const isOverLimit = isTwitter && content.length > 280

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/posts" className="btn btn-ghost btn-icon">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 className="page-title">Edit Post</h1>
              <StatusBadge status={postData?.status} />
            </div>
            <p className="page-subtitle">Update post content, schedule, or publish immediately</p>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={() => setShowDeleteModal(true)}
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>

      <div className="composer-layout">
        {/* LEFT: Editor */}
        <div className="composer-panel">
          <div className="card">
            {/* Content Textarea */}
            <div className="form-group mb-4">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <label className="composer-section-label" style={{ margin: 0 }}>
                  Content
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
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={saving || publishing}
                style={{ minHeight: 160 }}
              />

              <div className={`char-counter ${isOverLimit ? 'danger' : ''}`}>
                {content.length} characters {isTwitter && `/ 280`}
              </div>
            </div>

            {/* AI Assistant Drawer */}
            {showAi && (
              <div className="mb-4">
                <AIComposer
                  platform={platform}
                  onApplyContent={(aiText) => setContent(aiText)}
                  onClose={() => setShowAi(false)}
                />
              </div>
            )}

            {/* Platform Selection */}
            <div className="form-group mb-4">
              <label className="composer-section-label">Target Platform</label>
              <div className="platform-selector">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`platform-btn ${platform === p.id ? 'selected' : ''}`}
                    onClick={() => setPlatform(p.id)}
                    disabled={saving || publishing}
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

            {/* Schedule Section */}
            <div className="form-group mb-6">
              <label className="composer-section-label">Schedule Settings</label>
              <div className="datetime-row">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input
                    type="time"
                    className="form-input"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                </div>
              </div>
              {scheduleDate && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm mt-2"
                  style={{ alignSelf: 'flex-start', color: 'var(--color-text-secondary)' }}
                  onClick={() => {
                    setScheduleDate('')
                    setScheduleTime('')
                  }}
                >
                  Clear schedule (save as draft)
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/posts')}
                disabled={saving || publishing}
              >
                Cancel
              </button>

              {postData?.status !== 'PUBLISHED' && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handlePublishNow}
                  disabled={saving || publishing || isOverLimit || !content.trim()}
                >
                  {publishing ? (
                    <div className="spinner spinner-sm" />
                  ) : (
                    <>
                      <Send size={14} />
                      Publish Now
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving || publishing || isOverLimit || !content.trim()}
              >
                {saving ? (
                  <>
                    <div className="spinner spinner-sm" style={{ borderTopColor: '#fff' }} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Live Preview */}
        <div>
          <PostPreview
            content={content}
            mediaUrl={mediaUrl}
            platform={platform}
          />
        </div>
      </div>

      {showDeleteModal && (
        <ConfirmDialog
          title="Delete Post"
          message="Are you sure you want to delete this post? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          loading={deleting}
        />
      )}
    </div>
  )
}
