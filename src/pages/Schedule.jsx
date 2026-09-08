import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { Calendar, Plus, Edit2, Trash2, Send, Clock, AlertCircle } from 'lucide-react'
import { getPosts, publishPost, deletePost } from '../api/posts'
import { useToast } from '../context/ToastContext'
import PlatformIcon from '../components/ui/PlatformIcon'
import StatusBadge from '../components/ui/StatusBadge'
import LoadingState from '../components/ui/LoadingState'
import EmptyState from '../components/ui/EmptyState'
import ConfirmDialog from '../components/ui/ConfirmDialog'

export default function Schedule() {
  const [scheduledPosts, setScheduledPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [publishingId, setPublishingId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const toast = useToast()

  const loadScheduledPosts = async () => {
    try {
      setLoading(true)
      const data = await getPosts('SCHEDULED')
      const sorted = (Array.isArray(data) ? data : []).sort((a, b) => {
        if (!a.scheduledTime) return 1
        if (!b.scheduledTime) return -1
        return new Date(a.scheduledTime) - new Date(b.scheduledTime)
      })
      setScheduledPosts(sorted)
    } catch (err) {
      toast.error('Failed to load scheduled posts.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadScheduledPosts()
  }, [])

  const handlePublishNow = async (id) => {
    try {
      setPublishingId(id)
      await publishPost(id)
      toast.success('Post published successfully!')
      loadScheduledPosts()
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to publish post.'
      toast.error(msg)
      loadScheduledPosts()
    } finally {
      setPublishingId(null)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    try {
      setDeleting(true)
      await deletePost(deleteTarget.id)
      setScheduledPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      toast.success('Scheduled post deleted')
    } catch (err) {
      toast.error('Failed to delete scheduled post.')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Schedule</h1>
          <p className="page-subtitle">
            Timeline of upcoming scheduled posts queued for automatic publishing
          </p>
        </div>
        <Link to="/create" className="btn btn-primary">
          <Plus size={16} />
          Schedule Post
        </Link>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={16} style={{ color: 'var(--color-primary)' }} />
            Upcoming Posts ({scheduledPosts.length})
          </h2>
        </div>

        {loading ? (
          <LoadingState message="Loading schedule..." />
        ) : scheduledPosts.length === 0 ? (
          <EmptyState
            title="No scheduled posts"
            description="You do not have any upcoming posts queued for publishing. Create and schedule a post to get started."
            action={
              <Link to="/create" className="btn btn-primary btn-sm">
                <Plus size={14} />
                Schedule a Post
              </Link>
            }
          />
        ) : (
          <div className="schedule-list">
            {scheduledPosts.map((post) => {
              let dateStr = '—'
              let timeStr = '—'
              if (post.scheduledTime) {
                try {
                  const dt = new Date(post.scheduledTime)
                  dateStr = format(dt, 'MMM d, yyyy')
                  timeStr = format(dt, 'h:mm a')
                } catch {
                  dateStr = post.scheduledTime
                }
              }

              return (
                <div key={post.id} className="schedule-item">
                  <div className="schedule-time">
                    <div className="schedule-time-date">{dateStr}</div>
                    <div className="schedule-time-hour">{timeStr}</div>
                  </div>

                  <div className="schedule-divider" />

                  {post.mediaUrl && (
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <img
                        src={post.mediaUrl}
                        alt="Media attachment"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}

                  <div className="schedule-content">
                    <div className="schedule-content-text">{post.content}</div>
                    <div className="schedule-content-meta">
                      <PlatformIcon platform={post.platform} showLabel={true} />
                      <span style={{ color: 'var(--color-border-strong)' }}>·</span>
                      <StatusBadge status={post.status} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handlePublishNow(post.id)}
                      disabled={publishingId === post.id}
                      title="Publish now without waiting"
                    >
                      {publishingId === post.id ? (
                        <div className="spinner spinner-sm" />
                      ) : (
                        <>
                          <Send size={13} />
                          Publish Now
                        </>
                      )}
                    </button>
                    <Link
                      to={`/posts/${post.id}/edit`}
                      className="btn btn-ghost btn-icon"
                      title="Edit Post"
                    >
                      <Edit2 size={14} />
                    </Link>
                    <button
                      className="btn btn-ghost btn-icon"
                      onClick={() => setDeleteTarget(post)}
                      title="Delete Post"
                    >
                      <Trash2 size={14} style={{ color: 'var(--color-error)' }} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Scheduled Post"
          message="Are you sure you want to cancel and delete this scheduled post?"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  )
}
