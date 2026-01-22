import React from 'react';
import { useSessionHistory } from '../../features/history/hooks/useSessionHistory';
import ModalOverlay from '../ui/ModalOverlay';
import SessionCard from '../../features/history/SessionCard';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  customFillers: string[];
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, customFillers }) => {
  const {
    paginatedHistory,
    totalPages,
    currentPage
  } = useSessionHistory();

  return (
    <ModalOverlay
      isOpen={isOpen}
      onClose={onClose}
      title="Session History"
      size="xl"
    >
      <div className="space-y-6">
        {/* Sessions List */}
        {paginatedHistory.length > 0 ? (
          <div className="space-y-4">
            <div 
              className="text-sm font-medium"
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                color: 'var(--color-text-secondary)'
              }}
            >
              {totalPages > 1 
                ? `Page ${currentPage + 1} of ${totalPages} (${paginatedHistory.length} sessions)`
                : `${paginatedHistory.length} sessions`
              }
            </div>
            
            <div className="grid gap-4">
              {paginatedHistory.map((session) => (
                <SessionCard
                  key={session._id}
                  session={session}
                  customFillers={customFillers}
                />
              ))}
            </div>

            {/* Simple pagination info */}
            {totalPages > 1 && (
              <div 
                className="text-center text-sm"
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-muted)'
                }}
              >
                Page {currentPage + 1} of {totalPages}
              </div>
            )}
          </div>
        ) : (
          <div 
            className="text-center py-12"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 
              className="text-lg font-medium mb-2"
              style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-medium)'
              }}
            >
              No sessions found
            </h3>
            <p 
              className="text-sm"
              style={{ fontSize: 'var(--text-sm)' }}
            >
              Start your first practice session to see it here.
            </p>
          </div>
        )}
      </div>
    </ModalOverlay>
  );
};

export default HistoryModal;