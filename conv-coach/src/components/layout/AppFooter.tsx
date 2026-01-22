import { Github, Mail, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AppFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // Footer link component
  const FooterLink: React.FC<{
    href?: string;
    to?: string;
    icon: React.ReactNode;
    label: string;
  }> = ({ href, to, icon, label }) => {
    const baseClasses = "flex items-center gap-2 text-text-secondary hover:text-primary transition-colors duration-200 text-sm";
    const style = {
      color: 'var(--color-text-secondary)'
    };

    if (to) {
      return (
        <Link 
          to={to}
          className={baseClasses}
          style={style}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }}
        >
          {icon}
          <span className="hidden sm:inline">{label}</span>
        </Link>
      );
    }

    return (
      <a 
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClasses}
        style={style}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--color-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--color-text-secondary)';
        }}
      >
        {icon}
        <span className="hidden sm:inline">{label}</span>
      </a>
    );
  };

  return (
    <footer 
      className="border-t border-surface-border mt-auto"
      style={{ 
        borderTop: `1px solid var(--color-surface-border)`,
        backgroundColor: 'var(--color-surface)'
      }}
    >
      <div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
        style={{ padding: 'var(--space-6) var(--space-4)' }}
      >
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Left Section - Copyright & Brand */}
          <div className="flex flex-col items-center md:items-start">
            <div 
              className="flex items-center gap-2 mb-2"
              style={{ marginBottom: 'var(--space-2)' }}
            >
              <div 
                className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <span className="text-white font-bold text-xs">CC</span>
              </div>
              <span 
                className="font-semibold text-text-primary"
                style={{ 
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                Conversation Coach
              </span>
            </div>
            <p 
              className="text-text-muted text-xs"
              style={{ 
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-muted)'
              }}
            >
              © {currentYear} Conversation Coach. All rights reserved.
            </p>
          </div>

          {/* Center Section - Links */}
          <div className="flex items-center gap-6">
            <FooterLink
              to="/help"
              icon={<HelpCircle size={16} />}
              label="Help"
            />
            <FooterLink
              href="mailto:support@conv-coach.com"
              icon={<Mail size={16} />}
              label="Support"
            />
            <FooterLink
              href="https://github.com/conv-coach/conv-coach"
              icon={<Github size={16} />}
              label="GitHub"
            />
          </div>

          {/* Right Section - Version Info */}
          <div className="text-text-muted text-xs text-center md:text-right">
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              Version 1.0.0
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              Built with ❤️ for language learners
            </div>
          </div>
        </div>

        {/* Bottom Section - Legal/Privacy */}
        <div 
          className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6 pt-6 border-t border-surface-border/50"
          style={{ 
            marginTop: 'var(--space-6)',
            paddingTop: 'var(--space-6)',
            borderTop: `1px solid var(--color-surface-border)`
          }}
        >
          <div className="flex gap-6 text-xs">
            <Link 
              to="/privacy"
              className="text-text-muted hover:text-primary transition-colors"
              style={{ 
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-muted)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-muted)';
              }}
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms"
              className="text-text-muted hover:text-primary transition-colors"
              style={{ 
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-muted)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-muted)';
              }}
            >
              Terms of Service
            </Link>
            <Link 
              to="/cookies"
              className="text-text-muted hover:text-primary transition-colors"
              style={{ 
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-muted)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-muted)';
              }}
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;