import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, X, Calendar, Target, TrendingUp, RotateCcw } from 'lucide-react';


interface FilterOptions {
  dateRange?: { start: Date; end: Date };
  ieltsRange?: [number, number];
  toeflRange?: [number, number];
  topics?: string[];
  speedRange?: [number, number];
  fillerRange?: [number, number];
  sessionType?: 'all' | 'withScores' | 'withoutScores';
  sortBy?: 'date' | 'score' | 'improvement' | 'duration';
  sortOrder?: 'asc' | 'desc';
}

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableTopics: string[];
  onReset: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const FilterPanel = ({ 
  filters, 
  onFiltersChange, 
  availableTopics, 
  onReset,
  isOpen = true,
  onClose
}: FilterPanelProps) => {
  const [tempFilters, setTempFilters] = useState<FilterOptions>(filters);
  const [activeQuickFilter, setActiveQuickFilter] = useState<string>('');

  const quickFilters = [
    { id: 'recent', label: 'Last 30 days', days: 30 },
    { id: 'good', label: 'IELTS 7.0+', ieltsMin: 7 },
    { id: 'excellent', label: 'IELTS 8.0+', ieltsMin: 8 },
    { id: 'improving', label: 'Improving trend', sortBy: 'improvement' },
    { id: 'fluent', label: 'Low fillers (<5%)', fillerMax: 5 },
    { id: 'consistent', label: 'Consistent speed', speedRange: [150, 190] as [number, number] }
  ];

  const applyQuickFilter = (quickFilter: any) => {
    setActiveQuickFilter(quickFilter.id);
    
    const newFilters: FilterOptions = { ...tempFilters };
    
    if (quickFilter.days) {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - quickFilter.days);
      newFilters.dateRange = { start, end };
    }
    
    if (quickFilter.ieltsMin) {
      newFilters.ieltsRange = [quickFilter.ieltsMin, 9];
    }
    
    if (quickFilter.fillerMax) {
      newFilters.fillerRange = [0, quickFilter.fillerMax];
    }
    
    if (quickFilter.speedRange) {
      newFilters.speedRange = quickFilter.speedRange;
    }
    
    if (quickFilter.sortBy) {
      newFilters.sortBy = quickFilter.sortBy;
      newFilters.sortOrder = 'desc';
    }
    
    setTempFilters(newFilters);
  };

  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    const newDate = new Date(value);
    setTempFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [type]: newDate
      } as { start: Date; end: Date }
    }));
  };

  const handleTopicToggle = (topic: string) => {
    const currentTopics = tempFilters.topics || [];
    const newTopics = currentTopics.includes(topic)
      ? currentTopics.filter(t => t !== topic)
      : [...currentTopics, topic];
    
    setTempFilters(prev => ({
      ...prev,
      topics: newTopics
    }));
  };

  const applyFilters = () => {
    onFiltersChange(tempFilters);
    onClose?.();
  };

  const resetFilters = () => {
    const emptyFilters: FilterOptions = {};
    setTempFilters(emptyFilters);
    setActiveQuickFilter('');
    onReset();
    onClose?.();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => onClose?.()}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
      >
        <Filter size={16} />
        Filters
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-emerald-900/30"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="text-emerald-400" size={20} />
          <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="mb-6">
        <h4 className="text-white font-medium mb-3">Quick Filters</h4>
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => applyQuickFilter(filter)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                activeQuickFilter === filter.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Range */}
        <div>
          <h4 className="text-white font-medium mb-3 flex items-center gap-2">
            <Calendar size={16} />
            Date Range
          </h4>
          <div className="space-y-2">
            <input
              type="date"
              value={tempFilters.dateRange?.start ? tempFilters.dateRange.start.toISOString().split('T')[0] : ''}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
              placeholder="Start date"
            />
            <input
              type="date"
              value={tempFilters.dateRange?.end ? tempFilters.dateRange.end.toISOString().split('T')[0] : ''}
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
              placeholder="End date"
            />
          </div>
        </div>

        {/* Score Ranges */}
        <div>
          <h4 className="text-white font-medium mb-3 flex items-center gap-2">
            <Target size={16} />
            Score Ranges
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-300 mb-1 block">IELTS Band</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="9"
                  step="0.5"
                  value={tempFilters.ieltsRange?.[0] || ''}
                  onChange={(e) => setTempFilters(prev => ({
                    ...prev,
                    ieltsRange: [parseFloat(e.target.value) || 0, prev.ieltsRange?.[1] || 9]
                  }))}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="Min"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="number"
                  min="0"
                  max="9"
                  step="0.5"
                  value={tempFilters.ieltsRange?.[1] || ''}
                  onChange={(e) => setTempFilters(prev => ({
                    ...prev,
                    ieltsRange: [prev.ieltsRange?.[0] || 0, parseFloat(e.target.value) || 9]
                  }))}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="Max"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-1 block">TOEFL Score</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="4"
                  step="0.5"
                  value={tempFilters.toeflRange?.[0] || ''}
                  onChange={(e) => setTempFilters(prev => ({
                    ...prev,
                    toeflRange: [parseFloat(e.target.value) || 0, prev.toeflRange?.[1] || 4]
                  }))}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="Min"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="number"
                  min="0"
                  max="4"
                  step="0.5"
                  value={tempFilters.toeflRange?.[1] || ''}
                  onChange={(e) => setTempFilters(prev => ({
                    ...prev,
                    toeflRange: [prev.toeflRange?.[0] || 0, parseFloat(e.target.value) || 4]
                  }))}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Topics */}
        <div>
          <h4 className="text-white font-medium mb-3">Topics</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {availableTopics.map((topic) => (
              <label key={topic} className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempFilters.topics?.includes(topic) || false}
                  onChange={() => handleTopicToggle(topic)}
                  className="w-4 h-4 text-emerald-500 bg-gray-800 border-gray-600 rounded focus:ring-emerald-500 focus:ring-2"
                />
                <span className="text-sm">{topic}</span>
              </label>
            ))}
            {availableTopics.length === 0 && (
              <p className="text-sm text-gray-400 italic">No topics available</p>
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        <div>
          <h4 className="text-white font-medium mb-3 flex items-center gap-2">
            <TrendingUp size={16} />
            Performance Metrics
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Speaking Speed (WPM)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={tempFilters.speedRange?.[0] || ''}
                  onChange={(e) => setTempFilters(prev => ({
                    ...prev,
                    speedRange: [parseInt(e.target.value) || 0, prev.speedRange?.[1] || 300]
                  }))}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="Min"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="number"
                  value={tempFilters.speedRange?.[1] || ''}
                  onChange={(e) => setTempFilters(prev => ({
                    ...prev,
                    speedRange: [prev.speedRange?.[0] || 0, parseInt(e.target.value) || 300]
                  }))}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="Max"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-1 block">Filler Words (%)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={tempFilters.fillerRange?.[0] || ''}
                  onChange={(e) => setTempFilters(prev => ({
                    ...prev,
                    fillerRange: [parseFloat(e.target.value) || 0, prev.fillerRange?.[1] || 100]
                  }))}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="Min"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={tempFilters.fillerRange?.[1] || ''}
                  onChange={(e) => setTempFilters(prev => ({
                    ...prev,
                    fillerRange: [prev.fillerRange?.[0] || 0, parseFloat(e.target.value) || 100]
                  }))}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="Max"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-1 block">Session Type</label>
              <select
                value={tempFilters.sessionType || 'all'}
                onChange={(e) => setTempFilters(prev => ({
                  ...prev,
                  sessionType: e.target.value as any
                }))}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="all">All Sessions</option>
                <option value="withScores">With IELTS/TOEFL Scores</option>
                <option value="withoutScores">Without Scores</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-1 block">Sort By</label>
              <select
                value={tempFilters.sortBy || 'date'}
                onChange={(e) => setTempFilters(prev => ({
                  ...prev,
                  sortBy: e.target.value as any
                }))}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="date">Date</option>
                <option value="score">IELTS Score</option>
                <option value="improvement">Improvement Rate</option>
                <option value="duration">Duration</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6 pt-4 border-t border-gray-700/50">
        <button
          onClick={applyFilters}
          className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          Apply Filters
        </button>
        <button
          onClick={resetFilters}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors font-medium"
        >
          <RotateCcw size={16} />
          Reset All
        </button>
      </div>
    </motion.div>
  );
};

export default FilterPanel;