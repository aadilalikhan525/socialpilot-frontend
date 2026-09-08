import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, RefreshCw } from 'lucide-react'
import { getPosts, publishPost, deletePost } from '../api/posts'
import { useToast } from '../context/ToastContext'
import PostTable from '../components/posts/PostTable'
import LoadingState from '../components/ui/LoadingState'
import EmptyState from '../components/ui/EmptyState'

const TABS = [
  { id: 'ALL', label: 'All' },
  { id: 'DRAFT', label: 'Draft' },
  { id: 'SCHEDULED', label: 'Scheduled' },
  { id: 'PUBLISHED', label: 'Published' },
  { id: 'FAILED', label: 'Failed' },
]

export default function Posts() {
  const [activeTab, setActiveTab] = useState('ALL')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [publishingId, setPublishingId] = useState(null)
  const toast = useToast()

  const loadPosts = async () => {
    try {
      setLoading(true)
      const statusParam = activeTab === 'ALL' ? undefined : activeTab
      const data = await getPosts(statusParam)
      setPosts(Array.isArray(data) ? data : [])
    } catch (err) {
      toast.error('Failed to load posts.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [activeTab])

  const handlePublish = async (id) => {
    try {
      setPublishingId(id)
      const res = await publishPost(id)
      toast.success('Post published successfully!')
      loadPosts()
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to publish post.'
      toast.error(msg)
      loadPosts()
    } finally {
      setPublishingId(null)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deletePost(id)
      setPosts((prev) => prev.filter((p) => p.id !== id))
      toast.success('Post deleted')
    } catch (err) {
      toast.error('Failed to delete post.')
    }
  }

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Posts</h1>
          <p className="page-subtitle">View and manage all your social media content</p>
        </div>
        <Link to="/create" className="btn btn-primary">
          <Plus size={16} />
          Create Post
        </Link>
      </div>

      <div className="card">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-5)',
            flexWrap: 'wrap',
            gap: 'var(--space-3)',
          }}
        >
          {/* Filter Tabs */}
          <div className="filter-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`filter-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={loadPosts}
            title="Refresh posts"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {loading ? (
          <LoadingState message="Loading posts..." />
        ) : posts.length === 0 ? (
          <EmptyState
            title={`No ${activeTab === 'ALL' ? '' : activeTab.toLowerCase()} posts`}
            description={
              activeTab === 'ALL'
                ? 'Create your first post to start sharing across your accounts.'
                : `You do not have any posts with status "${activeTab}".`
            }
            action={
              <Link to="/create" className="btn btn-primary btn-sm">
                <Plus size={14} />
                Create Post
              </Link>
            }
          />
        ) : (
          <PostTable
            posts={posts}
            onPublish={handlePublish}
            onDelete={handleDelete}
            publishingId={publishingId}
          />
        )}
      </div>
    </div>
  )
}
