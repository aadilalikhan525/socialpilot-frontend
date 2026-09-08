import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Link2, Check, X, ExternalLink, RefreshCw, KeyRound, AlertCircle, Sparkles } from 'lucide-react'
import { getAccounts, getConnectUrl, connectAccount, disconnectAccount, exchangeOAuthCode, syncAccounts } from '../api/socialAccounts'
import { useToast } from '../context/ToastContext'
import LoadingState from '../components/ui/LoadingState'
import StatusBadge from '../components/ui/StatusBadge'
import ConfirmDialog from '../components/ui/ConfirmDialog'

const PLATFORM_CONFIGS = [
  {
    id: 'LINKEDIN',
    name: 'LinkedIn',
    abbr: 'in',
    cls: 'platform-icon-linkedin',
    desc: 'Share posts and industry updates with your professional network',
    reqs: 'Managed securely via Zernio. Click Connect to authorize.',
  },
  {
    id: 'TWITTER',
    name: 'X / Twitter',
    abbr: 'X',
    cls: 'platform-icon-twitter',
    desc: 'Publish tweets, updates, and media directly to your X profile',
    reqs: 'Managed securely via Zernio. Click Connect to authorize.',
  },
  {
    id: 'FACEBOOK',
    name: 'Facebook',
    abbr: 'f',
    cls: 'platform-icon-facebook',
    desc: 'Publish posts and photos to Facebook Pages you manage',
    reqs: 'Managed securely via Zernio. Click Connect to authorize.',
  },
  {
    id: 'INSTAGRAM',
    name: 'Instagram',
    abbr: 'ig',
    cls: 'platform-icon-instagram',
    desc: 'Publish images and captions to your Instagram Business account',
    reqs: 'Managed securely via Zernio. Click Connect to authorize.',
  },
]

export default function SocialAccounts() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [disconnectTarget, setDisconnectTarget] = useState(null)
  const [disconnecting, setDisconnecting] = useState(false)
  const [connectModalPlatform, setConnectModalPlatform] = useState(null)
  const [manualToken, setManualToken] = useState('')
  const [manualUsername, setManualUsername] = useState('')
  const [manualConnecting, setManualConnecting] = useState(false)

  const [searchParams, setSearchParams] = useSearchParams()
  const toast = useToast()

  const loadAccounts = async (sync = false) => {
    try {
      setLoading(true)
      const data = sync ? await syncAccounts() : await getAccounts()
      setAccounts(Array.isArray(data) ? data : [])
    } catch (err) {
      toast.error('Failed to load connected accounts.')
    } finally {
      setLoading(false)
    }
  }

  // Handle OAuth code callback or return redirect from provider
  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const platform = searchParams.get('platform')

    if (code && platform) {
      const handleCallback = async () => {
        try {
          toast.info(`Connecting ${platform}...`)
          await exchangeOAuthCode(platform, code, state)
          toast.success(`Successfully connected ${platform}!`)
          setSearchParams({})
          loadAccounts(true)
        } catch (err) {
          const msg = err.response?.data?.message || `Failed to complete ${platform} connection.`
          toast.error(msg)
          setSearchParams({})
        }
      }
      handleCallback()
    } else if (platform) {
      toast.info(`Syncing connected accounts...`)
      setSearchParams({})
      loadAccounts(true)
    } else {
      loadAccounts(false)
    }
  }, [])

  const handleOAuthConnect = async (platformId) => {
    try {
      toast.info(`Fetching authorization URL for ${platformId}...`)
      const res = await getConnectUrl(platformId)
      if (res && res.authorizationUrl) {
        // Redirect user to official OAuth page
        window.location.href = res.authorizationUrl
      } else {
        toast.error('Could not generate authorization URL.')
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'OAuth authorization initiation failed.'
      toast.error(msg)
    }
  }

  const handleManualConnect = async (e) => {
    e.preventDefault()
    if (!manualToken.trim()) {
      toast.error('Please provide an access token.')
      return
    }

    try {
      setManualConnecting(true)
      await connectAccount(connectModalPlatform, {
        platform: connectModalPlatform,
        accessToken: manualToken.trim(),
        platformUsername: manualUsername.trim() || undefined,
      })
      toast.success(`Connected ${connectModalPlatform} account!`)
      setConnectModalPlatform(null)
      setManualToken('')
      setManualUsername('')
      loadAccounts()
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to connect account.'
      toast.error(msg)
    } finally {
      setManualConnecting(false)
    }
  }

  const handleDisconnectConfirm = async () => {
    if (!disconnectTarget) return
    try {
      setDisconnecting(true)
      await disconnectAccount(disconnectTarget)
      toast.success(`Disconnected ${disconnectTarget}`)
      setAccounts((prev) => prev.filter((a) => a.platform !== disconnectTarget))
    } catch (err) {
      toast.error(`Failed to disconnect ${disconnectTarget}.`)
    } finally {
      setDisconnecting(false)
      setDisconnectTarget(null)
    }
  }

  const getConnectedAccount = (platformId) => {
    return accounts.find((a) => a.platform === platformId && a.connected)
  }

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Social Accounts</h1>
          <p className="page-subtitle">
            Connect and manage social accounts for multi-platform publishing
          </p>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => loadAccounts(true)}
          title="Sync & refresh accounts with provider"
        >
          <RefreshCw size={14} />
          Sync & Refresh
        </button>
      </div>

      {loading ? (
        <LoadingState message="Checking account statuses..." />
      ) : (
        <div className="accounts-grid">
          {PLATFORM_CONFIGS.map((cfg) => {
            const connectedAcc = getConnectedAccount(cfg.id)
            const isConnected = Boolean(connectedAcc)

            return (
              <div key={cfg.id} className="account-card">
                <div className="account-card-header">
                  <div className={`account-platform-icon ${cfg.cls}`}>
                    {cfg.abbr}
                  </div>
                  <div>
                    <div className="account-platform-name">{cfg.name}</div>
                    <div className="account-platform-desc">{cfg.desc}</div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '8px 12px',
                    background: 'var(--color-bg)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '12px',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.4,
                  }}
                >
                  {cfg.reqs}
                </div>

                <div className="account-status">
                  <div>
                    {isConnected ? (
                      <div>
                        <span className="badge badge-connected" style={{ marginBottom: 4 }}>
                          <Check size={12} /> Connected
                        </span>
                        {connectedAcc.platformUsername && (
                          <div className="account-username">
                            @{connectedAcc.platformUsername}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="badge badge-disconnected">
                        Not connected
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    {isConnected ? (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => setDisconnectTarget(cfg.id)}
                      >
                        Disconnect
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setConnectModalPlatform(cfg.id)}
                          title="Connect via Token"
                        >
                          <KeyRound size={13} />
                          Token
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleOAuthConnect(cfg.id)}
                        >
                          <ExternalLink size={13} />
                          Connect
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Manual Token Connect Modal */}
      {connectModalPlatform && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Connect {connectModalPlatform}</span>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => setConnectModalPlatform(null)}
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleManualConnect}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Access Token *</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter platform access token"
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                    required
                    autoFocus
                  />
                  <span className="form-hint">
                    Tokens are never displayed back in the UI and are stored securely.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Username / Handle (optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. yourhandle"
                    value={manualUsername}
                    onChange={(e) => setManualUsername(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setConnectModalPlatform(null)}
                  disabled={manualConnecting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={manualConnecting || !manualToken.trim()}
                >
                  {manualConnecting ? 'Connecting...' : 'Save & Connect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Disconnect Confirm Modal */}
      {disconnectTarget && (
        <ConfirmDialog
          title={`Disconnect ${disconnectTarget}`}
          message={`Are you sure you want to disconnect your ${disconnectTarget} account? You will not be able to publish posts to this platform until you reconnect.`}
          onConfirm={handleDisconnectConfirm}
          onCancel={() => setDisconnectTarget(null)}
          loading={disconnecting}
        />
      )}
    </div>
  )
}
