import { Settings, History, Home, ChevronLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const AppHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine current mode based on route
  const determineMode = (): 'home' | 'basic' | 'ielts' | 'settings' | 'history' => {
    if (location.pathname === '/') return 'home';
    if (location.pathname === '/basic') return 'basic';
    if (location.pathname === '/ielts') return 'ielts';
    if (location.pathname === '/settings') return 'settings';
    if (location.pathname === '/history') return 'history';
    return 'home';
  };

  const mode = determineMode();

  // Determine if we should show back button
  const mainRoutes = ['/', '/settings', '/history'];
  const showBackButton = !mainRoutes.includes(location.pathname);

  // Mode-specific configurations
  const modeConfig = {
    home: {
      title: 'Conversation Coach',
      subtitle: 'Improve your speaking confidence',
      showNavigation: false
    },
    basic: {
      title: 'Basic Mode',
      subtitle: 'Practice & Analysis',
      showNavigation: true
    },
    ielts: {
      title: 'IELTS Speaking Test',
      subtitle: 'Official Test Simulation',
      showNavigation: true,
      showTimer: true
    },
    settings: {
      title: 'Settings',
      subtitle: 'Configure your preferences',
      showNavigation: true
    },
    history: {
      title: 'Session History',
      subtitle: 'View your practice sessions',
      showNavigation: true
    }
  };

  const config = modeConfig[mode];

  // Brand Logo Component
  const BrandLogo = () => (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-accent-surface rounded-lg">
        <div 
          className="w-8 h-8 bg-primary rounded-full flex items-center justify-center"
          style={{
            backgroundColor: mode === 'ielts' 
              ? 'var(--color-primary-blue)' 
              : 'var(--color-primary-emerald)'
          }}
        >
          <span className="text-white font-bold text-sm">CC</span>
        </div>
      </div>
      <div>
        <h1 
          className="text-2xl font-bold text-text-primary"
          style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-semibold)' }}
        >
          {config.title}
        </h1>
        {mode === 'home' && (
          <p 
            className="text-text-secondary text-sm"
            style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}
          >
            {config.subtitle}
          </p>
        )}
      </div>
    </div>
  );

  // Navigation Button Component
  const NavButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }> = ({ icon, label, onClick, variant = 'secondary' }) => {
    const baseClasses = "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 border";
    const variantClasses = variant === 'primary' 
      ? "bg-accent-surface text-primary border-accent-border hover:bg-accent-surface/80"
      : "bg-surface text-text-secondary border-surface-border hover:bg-surface-elevated hover:text-text-primary";

    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variantClasses}`}
        style={{
          backgroundColor: variant === 'primary' 
            ? 'var(--color-accent-surface)' 
            : 'var(--color-surface)',
          borderColor: variant === 'primary'
            ? 'var(--color-accent-border)'
            : 'var(--color-surface-border)',
          color: variant === 'primary'
            ? 'var(--color-primary)'
            : 'var(--color-text-secondary)'
        }}
        onMouseEnter={(e) => {
          if (variant === 'primary') {
            e.currentTarget.style.backgroundColor = 'var(--color-accent-surface)';
            e.currentTarget.style.opacity = '0.8';
          } else {
            e.currentTarget.style.backgroundColor = 'var(--color-surface-elevated)';
            e.currentTarget.style.color = 'var(--color-text-primary)';
          }
        }}
        onMouseLeave={(e) => {
          if (variant === 'primary') {
            e.currentTarget.style.opacity = '1';
          } else {
            e.currentTarget.style.backgroundColor = 'var(--color-surface)';
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }
        }}
      >
        {icon}
        <span className="hidden sm:inline text-sm">{label}</span>
      </button>
    );
  };

  // Back Button Component
  const BackButton = () => (
    <NavButton
      icon={<ChevronLeft size={18} />}
      label="Back"
      onClick={() => navigate(-1)}
    />
  );

  // Home Button Component
  const HomeButton = () => (
    <NavButton
      icon={<Home size={18} />}
      label="Home"
      onClick={() => navigate('/')}
      variant="primary"
    />
  );

  return (
    <header 
      className="surface-elevated backdrop-blur-xl rounded-xl p-6 mb-6"
      style={{
        backgroundColor: 'var(--color-surface-elevated)',
        borderColor: 'var(--color-accent-border)',
        borderWidth: '1px',
        borderStyle: 'solid'
      }}
    >
      <div className="flex items-center justify-between">
        {/* Left Section - Brand/Back + Title */}
        <div className="flex items-center gap-4">
          {showBackButton && <BackButton />}
          <BrandLogo />
        </div>

        {/* Right Section - Navigation */}
        {config.showNavigation && (
          <div className="flex items-center gap-3">
            {/* History and Settings - Not on their own pages */}
            {mode !== 'history' && (
              <NavButton
                icon={<History size={18} />}
                label="History"
                onClick={() => navigate('/history')}
              />
            )}
            
            {mode !== 'settings' && (
              <NavButton
                icon={<Settings size={18} />}
                label="Settings"
                onClick={() => navigate('/settings')}
              />
            )}

            {/* Timer for IELTS mode */}
            {(config as any).showTimer && (
              <div 
                className="px-4 py-2 rounded-lg border font-mono"
                style={{
                  backgroundColor: 'var(--color-surface-elevated)',
                  borderColor: 'var(--color-blue-border)',
                  color: 'var(--color-primary-blue)',
                  fontFamily: 'var(--font-family-mono)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-semibold)'
                }}
              >
                00:00
              </div>
            )}

            {/* Home button - Not on home page */}
            {mode !== 'home' && <HomeButton />}
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;