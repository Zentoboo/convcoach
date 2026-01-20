import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface HistoryPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const HistoryPagination = ({ currentPage, totalPages, setCurrentPage }: HistoryPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-8 space-x-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`p-2 rounded-md ${
          currentPage === 1
            ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
            : 'bg-emerald-900/30 text-emerald-300 hover:bg-emerald-900/50'
        }`}
      >
        <ArrowLeft size={20} />
      </motion.button>

      {[...Array(totalPages)].map((_, i) => (
        <motion.button
          key={`page-${i + 1}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrentPage(i + 1)}
          className={`w-9 h-9 rounded-md font-medium text-sm ${
            currentPage === i + 1
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {i + 1}
        </motion.button>
      ))}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-md ${
          currentPage === totalPages
            ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
            : 'bg-emerald-900/30 text-emerald-300 hover:bg-emerald-900/50'
        }`}
      >
        <ArrowRight size={20} />
      </motion.button>
    </div>
  );
};

export default HistoryPagination;