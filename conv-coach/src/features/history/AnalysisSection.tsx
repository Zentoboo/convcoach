import { useState } from 'react';

import { FileText, Brain, ChevronDown, ChevronUp, MessageCircle, Lightbulb, AlertTriangle } from 'lucide-react';

interface AnalysisSectionProps {
  session: any;
}

const AnalysisSection = ({ session }: AnalysisSectionProps) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('transcript');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Extract key insights from AI feedback
  const extractKeyInsights = (aiFeedback: string) => {
    if (!aiFeedback) return [];
    
    const lines = aiFeedback.split('\n').filter(line => line.trim());
    const insights = [];
    
    for (const line of lines) {
      if (line.toLowerCase().includes('strength') || line.toLowerCase().includes('good') || line.toLowerCase().includes('excellent')) {
        insights.push({ type: 'strength', text: line.trim() });
      } else if (line.toLowerCase().includes('improv') || line.toLowerCase().includes('work on') || line.toLowerCase().includes('focus')) {
        insights.push({ type: 'improvement', text: line.trim() });
      } else if (line.toLowerCase().includes('recommend') || line.toLowerCase().includes('suggest')) {
        insights.push({ type: 'recommendation', text: line.trim() });
      }
    }
    
    return insights.slice(0, 3); // Limit to top 3 insights
  };

  const keyInsights = session.aiFeedback ? extractKeyInsights(session.aiFeedback) : [];

  // Analyze transcript for key patterns
  const analyzeTranscript = (transcript: string) => {
    if (!transcript) return { wordCount: 0, sentences: 0, avgWordsPerSentence: 0 };
    
    const words = transcript.trim().split(/\s+/).filter(word => word.length > 0);
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = sentences.length > 0 ? Math.round(words.length / sentences.length) : 0;
    
    return {
      wordCount: words.length,
      sentences: sentences.length,
      avgWordsPerSentence
    };
  };

  const transcriptAnalysis = analyzeTranscript(session.transcript);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'strength': return <Lightbulb size={14} className="text-emerald-400" />;
      case 'improvement': return <AlertTriangle size={14} className="text-yellow-400" />;
      case 'recommendation': return <MessageCircle size={14} className="text-blue-400" />;
      default: return <FileText size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Insights Summary */}
      {keyInsights.length > 0 && (
        <div
          className="bg-gray-900/70 backdrop-blur-xl rounded-xl p-6 border border-emerald-900/30"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Brain size={20} className="mr-2 text-emerald-400" />
            Key Insights
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {keyInsights.map((insight, index) => (
              <div
                key={index}
                className="bg-black/30 rounded-lg p-3 border border-emerald-900/20"
              >
                <div className="flex items-start gap-2">
                  {getInsightIcon(insight.type)}
                  <p className="text-sm text-gray-300 leading-relaxed">{insight.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collapsible Content Sections */}
      <div
        className="bg-gray-900/70 backdrop-blur-xl rounded-xl border border-emerald-900/30"
      >
        {/* Transcript Section */}
        <div className="border-b border-emerald-900/30">
          <button
            onClick={() => toggleSection('transcript')}
            className="w-full p-6 flex items-center justify-between text-left transition-colors hover:bg-emerald-900/10"
          >
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-emerald-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Full Transcript</h3>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                  <span>{transcriptAnalysis.wordCount} words</span>
                  <span>{transcriptAnalysis.sentences} sentences</span>
                  <span>~{transcriptAnalysis.avgWordsPerSentence} words/sentence</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                {expandedSection === 'transcript' ? 'Hide' : 'Show'}
              </span>
              {expandedSection === 'transcript' ? 
                <ChevronUp size={18} className="text-emerald-400" /> : 
                <ChevronDown size={18} className="text-emerald-400" />
              }
            </div>
          </button>
          
            {expandedSection === 'transcript' && (
              <div
                className="px-6 pb-6"
              >
              <div className="bg-black/30 rounded-lg p-4 max-h-96 overflow-y-auto">
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {session.transcript || 'No transcript available'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Feedback Section */}
        <div className="border-b border-emerald-900/30">
          <button
            onClick={() => toggleSection('feedback')}
            className="w-full p-6 flex items-center justify-between text-left transition-colors hover:bg-emerald-900/10"
          >
            <div className="flex items-center gap-3">
              <MessageCircle size={20} className="text-emerald-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Quick Feedback</h3>
              <p className="text-sm text-gray-400 mt-1">Immediate performance assessment</p>
              </div>
            </div>
          </button>
          
            {expandedSection === 'feedback' && (
              <div
                className="px-6 pb-6"
              >
              <div className="bg-black/30 rounded-lg p-4">
                <div className="text-gray-300 whitespace-pre-line leading-relaxed">
                  {session.feedback || 'No feedback available'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Analysis Section */}
        {session.aiFeedback && (
          <div>
            <button
              onClick={() => toggleSection('aiAnalysis')}
              className="w-full p-6 flex items-center justify-between text-left transition-colors hover:bg-emerald-900/10"
            >
              <div className="flex items-center gap-3">
                <Brain size={20} className="text-emerald-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Complete AI Analysis</h3>
                  <p className="text-sm text-gray-400 mt-1">Comprehensive performance breakdown</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">
                  {expandedSection === 'aiAnalysis' ? 'Hide' : 'Show'}
                </span>
                {expandedSection === 'aiAnalysis' ? 
                  <ChevronUp size={18} className="text-emerald-400" /> : 
                  <ChevronDown size={18} className="text-emerald-400" />
                }
              </div>
          </button>
            
            {expandedSection === 'aiAnalysis' && (
              <div
                className="px-6 pb-6"
              >
                <div className="bg-black/30 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {session.aiFeedback}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detailed Rubric Breakdown */}
      {session.rubricBreakdown && (
        <div
          className="bg-gray-900/70 backdrop-blur-xl rounded-xl p-6 border border-emerald-900/30"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <FileText size={20} className="mr-2 text-emerald-400" />
            Detailed Assessment Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(session.rubricBreakdown).map(([key, data]: [string, any]) => (
              <div key={key} className="bg-black/30 rounded-lg p-4 border border-emerald-900/20">
                <h3 className="text-white font-medium mb-2 capitalize flex items-center justify-between">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                  <span className="text-emerald-300 font-bold text-lg">{data.score}/10</span>
                </h3>
                <div className="w-full bg-black/20 rounded-full h-2 mb-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(data.score / 10) * 100}%` }}
                  />
                </div>
                {data.feedback && (
                  <p className="text-gray-300 text-sm">{data.feedback}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisSection;