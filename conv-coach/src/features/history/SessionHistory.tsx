import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowLeft, History, Trash2, ChevronDown, Filter } from 'lucide-react';
import type { Session } from '../../types';
import DeleteConfirmation from './DeleteConfirmation';
import SessionListItem from './SessionListItem';
import HistoryPagination from './HistoryPagination';
import FilterPanel from './FilterPanel';


interface SessionHistoryProps {
  paginatedHistory: Session[];
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  customFillers: string[];
  showDeleteConfirm: boolean;

  showClearMenu: boolean;
  showClearConfirm: boolean;
  clearType: string;
  onBackToCoach: () => void;
  onDeleteSession: (sessionId: string) => void;
  onConfirmDelete: () => void;
  onShowClearMenu: () => void;

  onSelectClearType: (type: string) => void;
  onConfirmClear: () => void;
  onViewDetails: (sessionId: string) => void;
  error: string | null;
  filters?: any;
  onFiltersChange?: (filters: any) => void;
}

const SessionHistory = ({
  paginatedHistory,
  totalPages,
  currentPage,
  setCurrentPage,
  showDeleteConfirm,
  showClearMenu,
  showClearConfirm,
  clearType,
  onBackToCoach,
  onDeleteSession,
  onConfirmDelete,
  onShowClearMenu,
  onSelectClearType,
  onConfirmClear,
  onViewDetails,
  error,
  filters,
  onFiltersChange
}: SessionHistoryProps) => {
  const [showFilters, setShowFilters] = useState(false);

  // Extract available topics for filter
  const availableTopics = paginatedHistory
    .filter(session => session.topic)
    .map(session => session.topic!)
    .filter((topic, index, arr) => arr.indexOf(topic) === index);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-700 p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToCoach}
            className="flex items-center text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Coach
          </motion.button>
          
          <h1 className="text-3xl font-bold text-white flex items-center">
            <History className="mr-3 text-emerald-400" size={32} />
            Session History
          </h1>
          
          <div className="flex gap-2">
            {onFiltersChange && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-2 backdrop-blur-md rounded-lg border transition-all ${
                  showFilters 
                    ? 'bg-emerald-900/30 text-emerald-300 border-emerald-500/50' 
                    : 'bg-black/40 text-gray-300 border-gray-700 hover:border-emerald-500/50 hover:text-emerald-400'
                }`}
              >
                <Filter size={20} className="mr-2" />
                Filters
                {filters && Object.keys(filters).length > 0 && (
                  <span className="ml-2 w-2 h-2 bg-emerald-400 rounded-full"></span>
                )}
              </motion.button>
            )}
            
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onShowClearMenu}
                className="flex items-center px-4 py-2 bg-black/40 backdrop-blur-md text-gray-300 rounded-lg border border-gray-700 hover:border-rose-500/50 hover:text-rose-400 transition-all"
              >
                <Trash2 size={20} className="mr-2" />
                Clear History
                <ChevronDown size={20} className="ml-1" />
              </motion.button>

              {showClearMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-1 w-48 py-1 bg-gray-900/95 backdrop-blur-xl rounded-lg border border-rose-900/20 shadow-lg z-10"
                >
                  <button
                    onClick={() => onSelectClearType('all')}
                    className="w-full text-left px-3 py-1.5 text-sm text-rose-400 hover:bg-rose-900/30 transition-colors"
                  >
                    All Sessions
                  </button>
                  <button
                    onClick={() => onSelectClearType('older-than-1')}
                    className="w-full text-left px-3 py-1.5 text-sm text-amber-400 hover:bg-amber-900/30 transition-colors"
                  >
                    Older than 1 Day
                  </button>
                  <button
                    onClick={() => onSelectClearType('older-than-7')}
                    className="w-full text-left px-3 py-1.5 text-sm text-amber-400 hover:bg-amber-900/30 transition-colors"
                  >
                    Older than 1 Week
                  </button>
                  <button
                    onClick={() => onSelectClearType('older-than-30')}
                    className="w-full text-left px-3 py-1.5 text-sm text-amber-400 hover:bg-amber-900/30 transition-colors"
                  >
                    Older than 1 Month
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && onFiltersChange && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <FilterPanel
              filters={filters || {}}
              onFiltersChange={onFiltersChange}
              availableTopics={availableTopics}
              onReset={() => onFiltersChange({})}
              isOpen={showFilters}
              onClose={() => setShowFilters(false)}
            />
          </motion.div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/15 border border-red-500/30 rounded-xl text-red-300 backdrop-blur-sm">
            {error}
          </div>
        )}

        <div className="grid gap-4">
          {paginatedHistory.length > 0 ? (
            paginatedHistory.map((session, index) => (
              <SessionListItem
                key={session._id}
                session={session}
                onDeleteSession={onDeleteSession}
                onViewDetails={onViewDetails}
                previousSession={index < paginatedHistory.length - 1 ? paginatedHistory[index + 1] : undefined}
              />
            ))
          ) : (
            <div className="text-center py-16 bg-black/30 backdrop-blur-xl rounded-xl border border-dashed border-emerald-800/40">
              <History className="mx-auto text-emerald-500 mb-4" size={48} />
              <h3 className="text-xl font-medium text-white mb-2">No Session History</h3>
              <p className="text-gray-400">Your coaching sessions will appear here after completing recordings</p>
            </div>
          )}
        </div>

        <HistoryPagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />

        <DeleteConfirmation
          showConfirm={showDeleteConfirm}
          setShowConfirm={() => {}}
          onConfirm={onConfirmDelete}
          title="Delete Session"
          message="Are you sure you want to delete this coaching session? This action cannot be undone."
          confirmText="Delete"
        />

        <DeleteConfirmation
          showConfirm={showClearConfirm}
          setShowConfirm={() => {}}
          onConfirm={onConfirmClear}
          title={
            clearType === 'all' ? 'Clear All History' :
            clearType === 'older-than-1' ? 'Clear Sessions Older Than 1 Day' :
            clearType === 'older-than-7' ? 'Clear Sessions Older Than 1 Week' :
            'Clear Sessions Older Than 1 Month'
          }
          message={
            clearType === 'all'
              ? 'Are you sure you want to clear all your coaching sessions? This action cannot be undone.'
              : `Are you sure you want to delete all coaching sessions ${
                  clearType === 'older-than-1' ? 'older than 1 day' : 
                  clearType === 'older-than-7' ? 'older than 1 week' : 
                  'older than 1 month'
                }? This action cannot be undone.`
          }
          confirmText="Clear"
          confirmColor="amber"
        />
      </motion.div>
    </div>
  );
};

export default SessionHistory;