import { PLATFORM_MAP } from '../ui/PlatformIcon'
import { useAuth } from '../../context/AuthContext'

function getInitials(name) {
  if (!name) return 'U'
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function PostPreview({ content, mediaUrl, platform }) {
  const { user } = useAuth()
  const platformInfo = PLATFORM_MAP[platform] || PLATFORM_MAP.GENERAL
  const hasContent = Boolean(content && content.trim())

  return (
    <div className="preview-card">
      <div className="preview-header">
        <span>Post Preview</span>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: '11px',
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {platformInfo.label}
        </span>
      </div>

      <div className="preview-body">
        <div className="preview-profile">
          <div className="avatar avatar-sm">
            {getInitials(user?.name)}
          </div>
          <div>
            <div className="preview-profile-name">{user?.name || 'Your Name'}</div>
            <div className="preview-platform-name">
              Posting to {platformInfo.label} · Just now
            </div>
          </div>
        </div>

        <div className={`preview-content ${hasContent ? 'has-content' : ''}`}>
          {hasContent ? content : 'Write something in the composer to see the preview here...'}
        </div>

        {mediaUrl && (
          <div className="preview-image">
            <img src={mediaUrl} alt="Attached preview" />
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '8px',
            borderTop: '1px solid var(--color-border)',
            fontSize: '12px',
            color: 'var(--color-text-muted)',
          }}
        >
          <span>SocialPilot Preview</span>
          <span>{platform === 'TWITTER' ? `${content ? 280 - content.length : 280} chars left` : ''}</span>
        </div>
      </div>
    </div>
  )
}
