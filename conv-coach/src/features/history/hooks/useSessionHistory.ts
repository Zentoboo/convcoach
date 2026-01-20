import { useState, useEffect } from 'react';
import type { Session } from '../../../types';
import { SESSIONS_PER_PAGE } from '../../../constants';

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

export const useSessionHistory = () => {
  const [history, setHistory] = useState<Session[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showClearMenu, setShowClearMenu] = useState(false);
  const [clearType, setClearType] = useState('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  // Session detail view state
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [showSessionDetail, setShowSessionDetail] = useState(false);
  
  // Filtering state
  const [filters, setFilters] = useState<FilterOptions>({});
  const [filteredHistory, setFilteredHistory] = useState<Session[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  // Apply filters when history or filters change
  useEffect(() => {
    applyFilters();
  }, [history, filters]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const loadHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sessions');
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const handleDeleteSession = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/sessions/${sessionToDelete}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Server failed to delete session');
      }
      setHistory(prev => prev.filter(s => s._id !== sessionToDelete));
      setShowDeleteConfirm(false);
      setSessionToDelete(null);
    } catch (err) {
      console.error('Error deleting session:', err);
      setShowDeleteConfirm(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      let response;

      if (clearType === 'all') {
        response = await fetch('http://localhost:5000/api/sessions/all', {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to clear all sessions');
        setHistory([]);
      } else {
        const days = parseInt(clearType.split('-')[2]);
        response = await fetch(`http://localhost:5000/api/sessions/older-than/${days}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to clear old sessions');
        const refreshResponse = await fetch('http://localhost:5000/api/sessions');
        const data = await refreshResponse.json();
        setHistory(data);
      }
      setShowClearConfirm(false);
    } catch (err) {
      console.error('Error clearing history:', err);
      setShowClearConfirm(false);
    }
  };

  const addSession = (session: Session) => {
    setHistory(prev => [session, ...prev]);
  };

  const applyFilters = () => {
    let filtered = [...history];

    // Date range filter
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      filtered = filtered.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= start && sessionDate <= end;
      });
    }

    // IELTS score range filter
    if (filters.ieltsRange) {
      filtered = filtered.filter(session => {
        if (!session.bandScores) return filters.sessionType === 'withoutScores';
        return session.bandScores.overall >= filters.ieltsRange![0] && 
               session.bandScores.overall <= filters.ieltsRange![1];
      });
    }

    // TOEFL score range filter
    if (filters.toeflRange) {
      filtered = filtered.filter(session => {
        if (!session.toeflScores) return filters.sessionType === 'withoutScores';
        const avgScore = (session.toeflScores.delivery + session.toeflScores.languageUse + session.toeflScores.topicDevelopment) / 3;
        return avgScore >= filters.toeflRange![0] && avgScore <= filters.toeflRange![1];
      });
    }

    // Topics filter
    if (filters.topics && filters.topics.length > 0) {
      filtered = filtered.filter(session => {
        if (!session.topic) return false;
        return filters.topics!.some(topic => 
          session.topic!.toLowerCase().includes(topic.toLowerCase())
        );
      });
    }

    // Speed range filter
    if (filters.speedRange) {
      filtered = filtered.filter(session => {
        const speed = session.speed || 0;
        return speed >= filters.speedRange![0] && speed <= filters.speedRange![1];
      });
    }

    // Filler percentage range filter
    if (filters.fillerRange) {
      filtered = filtered.filter(session => {
        const fillerPercent = session.fillerPercentage || 0;
        return fillerPercent >= filters.fillerRange![0] && fillerPercent <= filters.fillerRange![1];
      });
    }

    // Session type filter
    if (filters.sessionType && filters.sessionType !== 'all') {
      filtered = filtered.filter(session => {
        const hasScores = !!(session.bandScores || session.toeflScores);
        if (filters.sessionType === 'withScores') return hasScores;
        if (filters.sessionType === 'withoutScores') return !hasScores;
        return true;
      });
    }

    // Sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: number, bValue: number;
        
        switch (filters.sortBy) {
          case 'date':
            aValue = new Date(a.date).getTime();
            bValue = new Date(b.date).getTime();
            break;
          case 'score':
            aValue = Math.max(
              a.bandScores?.overall || 0,
              a.toeflScores ? (a.toeflScores.delivery + a.toeflScores.languageUse + a.toeflScores.topicDevelopment) / 3 : 0
            );
            bValue = Math.max(
              b.bandScores?.overall || 0,
              b.toeflScores ? (b.toeflScores.delivery + b.toeflScores.languageUse + b.toeflScores.topicDevelopment) / 3 : 0
            );
            break;
          case 'duration':
            aValue = a.duration || 0;
            bValue = b.duration || 0;
            break;
          case 'improvement':
            // For now, sort by confidence as a proxy for improvement
            aValue = a.confidence || 0;
            bValue = b.confidence || 0;
            break;
          default:
            aValue = 0;
            bValue = 0;
        }
        
        const order = filters.sortOrder === 'desc' ? -1 : 1;
        return (aValue - bValue) * order;
      });
    }

    setFilteredHistory(filtered);
  };

  const viewSessionDetails = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setShowSessionDetail(true);
  };

  const closeSessionDetails = () => {
    setSelectedSessionId(null);
    setShowSessionDetail(false);
  };

  const getSelectedSession = (): Session | null => {
    if (!selectedSessionId) return null;
    return filteredHistory.find(session => session._id === selectedSessionId) || null;
  };

  const getPreviousSessions = (currentSessionId: string): Session[] => {
    if (!currentSessionId) return [];
    const currentIndex = filteredHistory.findIndex(session => session._id === currentSessionId);
    if (currentIndex === -1) return [];
    
    // Return sessions before the current one (more recent first)
    return filteredHistory.slice(currentIndex + 1);
  };

  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * SESSIONS_PER_PAGE,
    currentPage * SESSIONS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredHistory.length / SESSIONS_PER_PAGE);

  return {
    history,
    filteredHistory,
    showHistory,
    setShowHistory,
    currentPage,
    setCurrentPage,
    sessionToDelete,
    setSessionToDelete,
    showDeleteConfirm,
    setShowDeleteConfirm,
    showClearMenu,
    setShowClearMenu,
    clearType,
    setClearType,
    showClearConfirm,
    setShowClearConfirm,
    paginatedHistory,
    totalPages,
    handleDeleteSession,
    handleClearHistory,
    addSession,
    // Session detail view
    selectedSessionId,
    setSelectedSessionId,
    showSessionDetail,
    setShowSessionDetail,
    viewSessionDetails,
    closeSessionDetails,
    getSelectedSession,
    getPreviousSessions,
    // Filtering
    filters,
    setFilters,
    applyFilters
  };
};