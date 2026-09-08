// SocialPlatform enum: TWITTER, LINKEDIN, FACEBOOK, INSTAGRAM, GENERAL
const PLATFORM_MAP = {
  TWITTER:   { label: 'X',         abbr: 'X',  cls: 'platform-icon-twitter'  },
  LINKEDIN:  { label: 'LinkedIn',  abbr: 'in', cls: 'platform-icon-linkedin' },
  FACEBOOK:  { label: 'Facebook',  abbr: 'f',  cls: 'platform-icon-facebook' },
  INSTAGRAM: { label: 'Instagram', abbr: 'ig', cls: 'platform-icon-instagram'},
  GENERAL:   { label: 'General',   abbr: 'G',  cls: 'platform-icon-general'  },
}

export default function PlatformIcon({ platform, showLabel = false }) {
  const info = PLATFORM_MAP[platform] || PLATFORM_MAP.GENERAL
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <span className={`platform-icon ${info.cls}`}>{info.abbr}</span>
      {showLabel && <span style={{ fontSize: '13px' }}>{info.label}</span>}
    </span>
  )
}

export { PLATFORM_MAP }
