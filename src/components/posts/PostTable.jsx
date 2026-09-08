import { useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { Edit2, Trash2, Send, ExternalLink, Image as ImageIcon, AlertCircle } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'
import PlatformIcon from '../ui/PlatformIcon'
import ConfirmDialog from '../ui/ConfirmDialog'

export default function PostTable({ posts, onPublish, onDelete, publishingId }) {
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    try {
      setDeleting(true)
      await onDelete(deleteTarget.id)
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  const formatScheduleOrPublish = (post) => {
    if (post.status === 'PUBLISHED' && post.publishedTime) {
      try {
        return `Published ${format(new Date(post.publishedTime), 'MMM d, h:mm a')}`
      } catch {
        return post.publishedTime
      }
    }
    if (post.scheduledTime) {
      try {
        return format(new Date(post.scheduledTime), 'MMM d, yyyy h:mm a')
      } catch {
        return post.scheduledTime
      }
    }
    return '—'
  }

  return (
    <>
      <div className="table-container">
        {/* Desktop Table */}
        <table className="table">
          <thead>
            <tr>
              <th>Post Content</th>
              <th>Platform</th>
              <th>Status</th>
              <th>Schedule / Published</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {post.mediaUrl && (
                      <div
                        style={{
                          width: 36,
                          height: 36,
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
                    <div style={{ minWidth: 0 }}>
                      <div className="table-content-preview" title={post.content}>
                        {post.content}
                      </div>
                      {post.status === 'FAILED' && post.errorMessage && (
                        <div
                          style={{
                            fontSize: '11px',
                            color: 'var(--color-error)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            marginTop: 2,
                          }}
                          title={post.errorMessage}
                        >
                          <AlertCircle size={12} />
                          <span style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {post.errorMessage}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  <PlatformIcon platform={post.platform} showLabel={true} />
                </td>
                <td>
                  <StatusBadge status={post.status} />
                </td>
                <td style={{ fontSize: '13px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                  {formatScheduleOrPublish(post)}
                </td>
                <td>
                  <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                    {post.publishedUrl && (
                      <a
                        href={post.publishedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-ghost btn-icon"
                        title="View published post"
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                    {post.status !== 'PUBLISHED' && onPublish && (
                      <button
                        className="btn btn-ghost btn-icon"
                        onClick={() => onPublish(post.id)}
                        disabled={publishingId === post.id}
                        title="Publish Now"
                      >
                        {publishingId === post.id ? (
                          <div className="spinner spinner-sm" />
                        ) : (
                          <Send size={15} />
                        )}
                      </button>
                    )}
                    <Link
                      to={`/posts/${post.id}/edit`}
                      className="btn btn-ghost btn-icon"
                      title="Edit Post"
                    >
                      <Edit2 size={15} />
                    </Link>
                    <button
                      className="btn btn-ghost btn-icon"
                      onClick={() => setDeleteTarget(post)}
                      title="Delete Post"
                    >
                      <Trash2 size={15} style={{ color: 'var(--color-error)' }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile View */}
        <div className="mobile-post-list" style={{ padding: 'var(--space-4)' }}>
          {posts.map((post) => (
            <div key={post.id} className="mobile-post-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <PlatformIcon platform={post.platform} showLabel={true} />
                <StatusBadge status={post.status} />
              </div>

              {post.mediaUrl && (
                <div style={{ height: 120, borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 8 }}>
                  <img src={post.mediaUrl} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              <p style={{ fontSize: 14, color: 'var(--color-text)', marginBottom: 8, lineHeight: 1.5 }}>
                {post.content}
              </p>

              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
                {formatScheduleOrPublish(post)}
              </div>

              <div style={{ display: 'flex', gap: 8, borderTop: '1px solid var(--color-border)', paddingTop: 8 }}>
                {post.publishedUrl && (
                  <a
                    href={post.publishedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                  >
                    <ExternalLink size={13} />
                    View
                  </a>
                )}
                {post.status !== 'PUBLISHED' && onPublish && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onPublish(post.id)}
                    disabled={publishingId === post.id}
                    style={{ flex: 1 }}
                  >
                    <Send size={13} />
                    Publish
                  </button>
                )}
                <Link
                  to={`/posts/${post.id}/edit`}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                >
                  <Edit2 size={13} />
                  Edit
                </Link>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => setDeleteTarget(post)}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Post"
          message="Are you sure you want to delete this post? This action cannot be undone."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </>
  )
}
