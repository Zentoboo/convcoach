import React from 'react';
import { useSessionHistory } from '../features/history/hooks/useSessionHistory';
import SessionCard from '../features/history/SessionCard';

const HistoryPage: React.FC = () => {
  const {
    paginatedHistory,
    totalPages,
    currentPage,
    showDeleteConfirm,
    setShowDeleteConfirm
  } = useSessionHistory();

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 
          className="text-3xl font-bold mb-2"
          style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-text-primary)'
          }}
        >
          Session History
        </h1>
        <p 
          className="text-lg"
          style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--color-text-secondary)'
          }}
        >
          View and manage your practice sessions
        </p>
      </div>

      {/* Filter Section */}
      <div 
        className="surface rounded-xl p-6 border"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-surface-border)',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
      >
        <h2 
          className="text-xl font-semibold mb-4"
          style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--color-text-primary)'
          }}
        >
          Filters
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                color: 'var(--color-text-secondary)'
              }}
            >
              Mode
            </label>
            <select
              className="w-full p-3 rounded-lg border"
              style={{
                backgroundColor: 'var(--color-surface-elevated)',
                borderColor: 'var(--color-surface-border)',
                color: 'var(--color-text-primary)',
                padding: 'var(--space-3)'
              }}
            >
              <option value="all">All Modes</option>
              <option value="basic">Basic Mode</option>
              <option value="ielts">IELTS Mode</option>
            </select>
          </div>

          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                color: 'var(--color-text-secondary)'
              }}
            >
              Date Range
            </label>
            <select
              className="w-full p-3 rounded-lg border"
              style={{
                backgroundColor: 'var(--color-surface-elevated)',
                borderColor: 'var(--color-surface-border)',
                color: 'var(--color-text-primary)',
                padding: 'var(--space-3)'
              }}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                color: 'var(--color-text-secondary)'
              }}
            >
              Search
            </label>
            <input
              type="text"
              placeholder="Search sessions..."
              className="w-full p-3 rounded-lg border"
              style={{
                backgroundColor: 'var(--color-surface-elevated)',
                borderColor: 'var(--color-surface-border)',
                color: 'var(--color-text-primary)',
                padding: 'var(--space-3)'
              }}
            />
          </div>
        </div>
      </div>

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
            {paginatedHistory.map((session: any) => (
              <SessionCard
                key={session._id}
                session={session}
                customFillers={[]}
              />
            ))}
          </div>

          {/* Simple pagination info */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <button
                disabled={currentPage === 0}
                className="px-4 py-2 rounded-lg border disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--color-surface-elevated)',
                  borderColor: 'var(--color-surface-border)',
                  color: 'var(--color-text-primary)'
                }}
              >
                Previous
              </button>
              
              <span 
                className="text-sm"
                style={{ fontSize: 'var(--text-sm)' }}
              >
                Page {currentPage + 1} of {totalPages}
              </span>
              
              <button
                disabled={currentPage >= totalPages - 1}
                className="px-4 py-2 rounded-lg border disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--color-surface-elevated)',
                  borderColor: 'var(--color-surface-border)',
                  color: 'var(--color-text-primary)'
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div 
          className="text-center py-12 surface rounded-xl border"
          style={{ 
            color: 'var(--color-text-secondary)',
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-surface-border)',
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          <div className="text-6xl mb-4">📝</div>
          <h3 
            className="text-xl font-medium mb-2"
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-medium)'
            }}
          >
            No sessions found
          </h3>
          <p 
            className="text-lg"
            style={{ fontSize: 'var(--text-lg)' }}
          >
            Start your first practice session to see it here.
          </p>
          
          <div className="mt-6">
            <button
              onClick={() => window.location.href = '/basic'}
              className="px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)'
              }}
            >
              Start Practicing
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div 
            className="surface p-6 rounded-xl max-w-md w-full mx-4 border"
            style={{ 
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-surface-border)',
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
          >
            <h3 className="text-lg font-semibold mb-4">Delete Session</h3>
            <p className="text-secondary mb-6">Are you sure you want to delete this session? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg border transition-colors"
                style={{
                  backgroundColor: 'var(--color-surface-elevated)',
                  borderColor: 'var(--color-surface-border)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // handleDeleteSession(); // This needs to be implemented properly
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'var(--color-error)',
                  color: 'white'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;