import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, FileText, Calendar, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react'
import { getPosts, publishPost, deletePost } from '../api/posts'
import { useToast } from '../context/ToastContext'
import PostTable from '../components/posts/PostTable'
import LoadingState from '../components/ui/LoadingState'
import EmptyState from '../components/ui/EmptyState'

export default function Dashboard() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [publishingId, setPublishingId] = useState(null)
  const toast = useToast()

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const data = await getPosts()
      setPosts(Array.isArray(data) ? data : [])
    } catch (err) {
      toast.error('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const handlePublish = async (id) => {
    try {
      setPublishingId(id)
      const res = await publishPost(id)
      toast.success('Post published successfully!')
      // Update the post in state
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...res, status: 'PUBLISHED' } : p))
      )
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to publish post.'
      toast.error(msg)
      // Reload posts to reflect failure status if updated
      loadDashboardData()
    } finally {
      setPublishingId(null)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deletePost(id)
      setPosts((prev) => prev.filter((p) => p.id !== id))
      toast.success('Post deleted successfully')
    } catch (err) {
      toast.error('Failed to delete post.')
    }
  }

  // Calculate stats
  const totalPosts = posts.length
  const scheduledCount = posts.filter((p) => p.status === 'SCHEDULED').length
  const publishedCount = posts.filter((p) => p.status === 'PUBLISHED').length
  const failedCount = posts.filter((p) => p.status === 'FAILED').length

  const recentPosts = posts.slice(0, 5)

  return (
    <div>
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Manage your content, schedule posts and publish across platforms.
          </p>
        </div>
        <Link to="/create" className="btn btn-primary">
          <Plus size={16} />
          Create Post
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Posts</div>
          <div className="stat-value">{totalPosts}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Scheduled</div>
          <div className="stat-value" style={{ color: 'var(--color-warning)' }}>
            {scheduledCount}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Published</div>
          <div className="stat-value" style={{ color: 'var(--color-success)' }}>
            {publishedCount}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Failed</div>
          <div className="stat-value" style={{ color: failedCount > 0 ? 'var(--color-error)' : 'var(--color-text)' }}>
            {failedCount}
          </div>
        </div>
      </div>

      {/* Recent Posts Section */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Posts</h2>
          {posts.length > 5 && (
            <Link
              to="/posts"
              style={{
                fontSize: '13px',
                color: 'var(--color-primary)',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              View all posts
              <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {loading ? (
          <LoadingState message="Loading recent posts..." />
        ) : recentPosts.length === 0 ? (
          <EmptyState
            title="No posts yet"
            description="Create your first post to get started publishing across your social platforms."
            action={
              <Link to="/create" className="btn btn-primary btn-sm">
                <Plus size={14} />
                Create Post
              </Link>
            }
          />
        ) : (
          <PostTable
            posts={recentPosts}
            onPublish={handlePublish}
            onDelete={handleDelete}
            publishingId={publishingId}
          />
        )}
      </div>
    </div>
  )
}
