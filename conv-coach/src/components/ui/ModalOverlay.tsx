import React from 'react';
import { X } from 'lucide-react';

interface ModalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const ModalOverlay: React.FC<ModalOverlayProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'lg'
}) => {
  // const { closeAllModals } = useNavigation(); // Not used currently

  if (!isOpen) return null;

  // Size configurations
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  // Close modal on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    // Store original overflow style
    const originalOverflow = document.body.style.overflow;
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Also prevent scroll on touch devices
      document.body.style.position = 'fixed';
      document.body.style.top = '0';
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.bottom = '0';
    } else {
      // Restore original styles
      document.body.style.overflow = originalOverflow || 'auto';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.bottom = '';
    }

    return () => {
      // Always restore original styles on cleanup
      document.body.style.overflow = originalOverflow || 'auto';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.bottom = '';
    };
  }, [isOpen]);

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ zIndex: 'var(--z-modal)' }}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity duration-300"
        onClick={onClose}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 'var(--z-modal-backdrop)'
        }}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`${sizeClasses[size]} w-full relative rounded-xl shadow-2xl transition-all duration-300 transform`}
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-surface-border)',
            boxShadow: 'var(--shadow-2xl)',
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-6 border-b"
            style={{
              borderBottom: `1px solid var(--color-surface-border)`,
              padding: 'var(--space-6)'
            }}
          >
            <h2
              className="text-xl font-semibold"
              style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--color-text-primary)'
              }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors duration-200"
              style={{
                backgroundColor: 'var(--color-surface-elevated)',
                color: 'var(--color-text-secondary)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-error)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-surface-elevated)';
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div
            className="p-6 max-h-[70vh] overflow-y-auto"
            style={{
              padding: 'var(--space-6)',
              maxHeight: '70vh',
              overflowY: 'auto'
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalOverlay;