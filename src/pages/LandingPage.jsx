import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Zap,
  Sparkles,
  Calendar,
  Share2,
  Image as ImageIcon,
  LayoutDashboard,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
  Clock,
  Send,
  Link2
} from 'lucide-react'

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const scrollToSection = (id) => {
    setMobileMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="landing-root">
      {/* ─── Navbar ────────────────────────────────────────────── */}
      <header className="landing-navbar">
        <div className="landing-container landing-navbar-inner">
          <Link to="/" className="landing-logo">
            <div className="landing-logo-icon">
              <Zap size={18} color="#ffffff" strokeWidth={2.5} />
            </div>
            <span className="landing-logo-text">SocialPilot</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="landing-nav-links">
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="landing-nav-link"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="landing-nav-link"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('platforms')}
              className="landing-nav-link"
            >
              Platforms
            </button>
          </nav>

          {/* Desktop Actions */}
          <div className="landing-nav-actions">
            <Link to="/login" className="btn btn-ghost landing-login-btn">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary landing-cta-btn">
              Get Started Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="landing-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="landing-mobile-menu">
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="landing-mobile-nav-link"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="landing-mobile-nav-link"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('platforms')}
              className="landing-mobile-nav-link"
            >
              Platforms
            </button>
            <div className="landing-mobile-actions">
              <Link
                to="/login"
                className="btn btn-secondary btn-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn btn-primary btn-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* ─── Hero Section ──────────────────────────────────────── */}
        <section className="landing-hero-section">
          <div className="landing-container landing-hero-grid">
            <div className="landing-hero-content">
              <div className="landing-badge">
                <Sparkles size={14} className="landing-badge-icon" />
                <span>AI-Powered Social Media Management</span>
              </div>

              <h1 className="landing-hero-title">
                Your Social Media. <br />
                <span className="landing-highlight">One Smart Platform.</span>
              </h1>

              <p className="landing-hero-desc">
                SocialPilot helps you generate AI-powered content, manage social
                media posts, schedule publishing, and connect multiple social
                platforms from one place.
              </p>

              <div className="landing-hero-actions">
                <Link to="/register" className="btn btn-primary btn-lg landing-hero-btn">
                  Get Started Free
                  <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg landing-hero-btn">
                  Login
                </Link>
              </div>

              <div className="landing-hero-trust">
                <div className="landing-trust-item">
                  <CheckCircle2 size={16} className="landing-check-icon" />
                  <span>No credit card required</span>
                </div>
                <div className="landing-trust-item">
                  <CheckCircle2 size={16} className="landing-check-icon" />
                  <span>Instant multi-channel publishing</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card / App Mockup */}
            <div className="landing-hero-visual">
              <div className="landing-preview-card">
                <div className="landing-preview-header">
                  <div className="landing-preview-dots">
                    <span className="dot dot-red"></span>
                    <span className="dot dot-yellow"></span>
                    <span className="dot dot-green"></span>
                  </div>
                  <div className="landing-preview-tag">
                    <Sparkles size={12} /> AI Composer Active
                  </div>
                </div>

                <div className="landing-preview-body">
                  <div className="landing-mock-compose">
                    <div className="landing-mock-label">Generated Post Preview</div>
                    <p className="landing-mock-text">
                      "Excited to share how we're leveraging AI to scale multi-platform social media operations seamlessly! 🚀 Streamlining creation, scheduling, and analytics all in one intuitive interface."
                    </p>
                    <div className="landing-mock-chips">
                      <span className="landing-mock-chip">#AI</span>
                      <span className="landing-mock-chip">#SocialMedia</span>
                      <span className="landing-mock-chip">#Productivity</span>
                    </div>
                  </div>

                  <div className="landing-mock-platforms">
                    <div className="landing-mock-platform active">
                      <span className="platform-icon platform-icon-linkedin">in</span>
                      <span>LinkedIn</span>
                    </div>
                    <div className="landing-mock-platform active">
                      <span className="platform-icon platform-icon-twitter">X</span>
                      <span>X (Twitter)</span>
                    </div>
                    <div className="landing-mock-platform active">
                      <span className="platform-icon platform-icon-facebook">f</span>
                      <span>Facebook</span>
                    </div>
                    <div className="landing-mock-platform active">
                      <span className="platform-icon platform-icon-instagram">ig</span>
                      <span>Instagram</span>
                    </div>
                  </div>

                  <div className="landing-mock-footer">
                    <div className="landing-mock-status">
                      <Clock size={14} /> Scheduled for Tomorrow, 10:00 AM
                    </div>
                    <span className="badge badge-success">Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Features Section ──────────────────────────────────── */}
        <section id="features" className="landing-section">
          <div className="landing-container">
            <div className="landing-section-header">
              <span className="landing-section-tag">Core Features</span>
              <h2 className="landing-section-title">Everything you need to grow your social presence</h2>
              <p className="landing-section-subtitle">
                Powerful tools engineered to streamline your content creation and distribution workflow.
              </p>
            </div>

            <div className="landing-features-grid">
              {/* Feature 1 */}
              <div className="landing-feature-card">
                <div className="landing-feature-icon-wrapper">
                  <Sparkles size={24} />
                </div>
                <h3 className="landing-feature-title">AI Content Generation</h3>
                <p className="landing-feature-desc">
                  Generate engaging, platform-tailored content based on your chosen topic, target platform, and tone of voice in seconds.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="landing-feature-card">
                <div className="landing-feature-icon-wrapper">
                  <Calendar size={24} />
                </div>
                <h3 className="landing-feature-title">Post Scheduling</h3>
                <p className="landing-feature-desc">
                  Schedule posts for future publishing with precise date and time controls to reach your audience at optimal hours.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="landing-feature-card">
                <div className="landing-feature-icon-wrapper">
                  <Share2 size={24} />
                </div>
                <h3 className="landing-feature-title">Multi-Platform Publishing</h3>
                <p className="landing-feature-desc">
                  Manage publishing effortlessly across all your supported social platforms simultaneously without switching tabs.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="landing-feature-card">
                <div className="landing-feature-icon-wrapper">
                  <ImageIcon size={24} />
                </div>
                <h3 className="landing-feature-title">Media Uploads</h3>
                <p className="landing-feature-desc">
                  Upload and manage high-quality post media smoothly using fast and reliable Cloudinary cloud storage integration.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="landing-feature-card">
                <div className="landing-feature-icon-wrapper">
                  <LayoutDashboard size={24} />
                </div>
                <h3 className="landing-feature-title">Centralized Dashboard</h3>
                <p className="landing-feature-desc">
                  Manage all your posts, track publishing statuses, and view upcoming scheduled content in one clean, unified dashboard.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="landing-feature-card">
                <div className="landing-feature-icon-wrapper">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="landing-feature-title">Secure Authentication</h3>
                <p className="landing-feature-desc">
                  Safe user registration, protected login, and JWT-based authentication to keep your accounts and data secure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── How It Works Section ──────────────────────────────── */}
        <section id="how-it-works" className="landing-section landing-section-alt">
          <div className="landing-container">
            <div className="landing-section-header">
              <span className="landing-section-tag">Simple Workflow</span>
              <h2 className="landing-section-title">How It Works</h2>
              <p className="landing-section-subtitle">
                Get started in minutes with our straightforward 3-step publishing flow.
              </p>
            </div>

            <div className="landing-steps-grid">
              <div className="landing-step-card">
                <div className="landing-step-number">01</div>
                <div className="landing-step-icon">
                  <Link2 size={22} />
                </div>
                <h3 className="landing-step-title">Connect social accounts</h3>
                <p className="landing-step-desc">
                  Link your social media profiles across LinkedIn, X/Twitter, Facebook, and Instagram with secure authorization.
                </p>
              </div>

              <div className="landing-step-card">
                <div className="landing-step-number">02</div>
                <div className="landing-step-icon">
                  <Sparkles size={22} />
                </div>
                <h3 className="landing-step-title">Create or generate content</h3>
                <p className="landing-step-desc">
                  Write customized posts manually or use the built-in AI assistant to generate copy, hashtags, and upload media assets.
                </p>
              </div>

              <div className="landing-step-card">
                <div className="landing-step-number">03</div>
                <div className="landing-step-icon">
                  <Send size={22} />
                </div>
                <h3 className="landing-step-title">Schedule or publish posts</h3>
                <p className="landing-step-desc">
                  Publish immediately with one click or set specific scheduled dates and times for automated multi-platform delivery.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Supported Platforms Section ───────────────────────── */}
        <section id="platforms" className="landing-section">
          <div className="landing-container">
            <div className="landing-section-header">
              <span className="landing-section-tag">Integrations</span>
              <h2 className="landing-section-title">Supported Platforms</h2>
              <p className="landing-section-subtitle">
                Seamlessly connect and publish to the networks where your audience lives.
              </p>
            </div>

            <div className="landing-platforms-grid">
              {/* LinkedIn */}
              <div className="landing-platform-card">
                <div className="landing-platform-badge platform-icon-linkedin">
                  <span>in</span>
                </div>
                <h3 className="landing-platform-name">LinkedIn</h3>
                <p className="landing-platform-desc">
                  Publish professional updates, articles, and industry insights to expand your business network.
                </p>
              </div>

              {/* X / Twitter */}
              <div className="landing-platform-card">
                <div className="landing-platform-badge platform-icon-twitter">
                  <span>X</span>
                </div>
                <h3 className="landing-platform-name">X / Twitter</h3>
                <p className="landing-platform-desc">
                  Share real-time announcements, short-form thoughts, and join trending conversations instantly.
                </p>
              </div>

              {/* Facebook */}
              <div className="landing-platform-card">
                <div className="landing-platform-badge platform-icon-facebook">
                  <span>f</span>
                </div>
                <h3 className="landing-platform-name">Facebook</h3>
                <p className="landing-platform-desc">
                  Engage your community and audience with multimedia posts across Facebook Pages you manage.
                </p>
              </div>

              {/* Instagram */}
              <div className="landing-platform-card">
                <div className="landing-platform-badge platform-icon-instagram">
                  <span>ig</span>
                </div>
                <h3 className="landing-platform-name">Instagram</h3>
                <p className="landing-platform-desc">
                  Share visually compelling images and creative captions to your Instagram Business account.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Final CTA Section ─────────────────────────────────── */}
        <section className="landing-cta-section">
          <div className="landing-container">
            <div className="landing-cta-box">
              <h2 className="landing-cta-title">
                Ready to simplify your social media workflow?
              </h2>
              <p className="landing-cta-desc">
                Start generating AI content and scheduling posts across multiple platforms today.
              </p>
              <div className="landing-cta-buttons">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started Free
                  <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ────────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="landing-container landing-footer-inner">
          <div className="landing-footer-brand">
            <div className="landing-logo">
              <div className="landing-logo-icon">
                <Zap size={16} color="#ffffff" strokeWidth={2.5} />
              </div>
              <span className="landing-logo-text">SocialPilot</span>
            </div>
            <p className="landing-footer-desc">
              Your all-in-one platform to generate AI-powered content, schedule posts, and manage multi-platform publishing.
            </p>
          </div>

          <div className="landing-footer-links-group">
            <div className="landing-footer-col">
              <h4 className="landing-footer-heading">Navigation</h4>
              <ul className="landing-footer-list">
                <li><button type="button" onClick={() => scrollToSection('features')}>Features</button></li>
                <li><button type="button" onClick={() => scrollToSection('how-it-works')}>How It Works</button></li>
                <li><button type="button" onClick={() => scrollToSection('platforms')}>Supported Platforms</button></li>
              </ul>
            </div>

            <div className="landing-footer-col">
              <h4 className="landing-footer-heading">Account</h4>
              <ul className="landing-footer-list">
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Create Account</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="landing-container landing-footer-bottom">
          <p>© {new Date().getFullYear()} SocialPilot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
