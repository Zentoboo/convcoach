
import { ChevronDown, ChevronUp, Award, Target, Zap, BookOpen, Users, Code } from 'lucide-react';
import { useState } from 'react';

interface RubricBreakdownProps {
  rubricBreakdown: {
    clarity: { score: number; feedback: string; maxScore: number };
    relevance: { score: number; feedback: string; maxScore: number };
    structure: { score: number; feedback: string; maxScore: number };
    engagement: { score: number; feedback: string; maxScore: number };
    vocabulary: { score: number; feedback: string; maxScore: number };
    grammar: { score: number; feedback: string; maxScore: number };
  };
  toeflScores: {
    delivery: number;
    languageUse: number;
    topicDevelopment: number;
  };
}

const RubricBreakdown = ({ rubricBreakdown, toeflScores }: RubricBreakdownProps) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('presentation');

  const getScoreColor = (score: number, maxScore: number): string => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-emerald-400 bg-emerald-400/20';
    if (percentage >= 70) return 'text-green-400 bg-green-400/20';
    if (percentage >= 60) return 'text-yellow-400 bg-yellow-400/20';
    if (percentage >= 50) return 'text-orange-400 bg-orange-400/20';
    return 'text-red-400 bg-red-400/20';
  };

  const getScoreIcon = (key: string) => {
    switch (key) {
      case 'clarity': return <Target size={20} />;
      case 'relevance': return <Award size={20} />;
      case 'structure': return <Code size={20} />;
      case 'engagement': return <Users size={20} />;
      case 'vocabulary': return <BookOpen size={20} />;
      case 'grammar': return <Zap size={20} />;
      default: return <Target size={20} />;
    }
  };

  const getProgressWidth = (score: number, maxScore: number): number => {
    return (score / maxScore) * 100;
  };

  const presentationCriteria = [
    { key: 'clarity', label: 'Clarity', description: 'How clear and understandable your speech was' },
    { key: 'relevance', label: 'Relevance', description: 'How well you stayed on topic' },
    { key: 'structure', label: 'Structure', description: 'Organization of your ideas' },
    { key: 'engagement', label: 'Engagement', description: 'Ability to maintain interest' }
  ];

  const languageCriteria = [
    { key: 'vocabulary', label: 'Vocabulary', description: 'Word choice and variety' },
    { key: 'grammar', label: 'Grammar', description: 'Sentence structure and accuracy' }
  ];

  const toeflCriteria = [
    { key: 'delivery', label: 'Delivery', description: 'Pace, clarity, and fluency' },
    { key: 'languageUse', label: 'Language Use', description: 'Grammar and vocabulary' },
    { key: 'topicDevelopment', label: 'Topic Development', description: 'Content and organization' }
  ];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-6">
      {/* Presentation Skills Section */}
      <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-emerald-900/30 overflow-hidden">
        <div
          className="p-6 cursor-pointer select-none hover:bg-emerald-900/10"
          onClick={() => toggleSection('presentation')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Users className="text-emerald-400" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Presentation Skills</h3>
                <p className="text-sm text-gray-400">How you delivered your message</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-gray-400">Average Score</div>
                <div className="text-lg font-bold text-emerald-400">
                  {((rubricBreakdown.clarity.score + rubricBreakdown.relevance.score + 
                     rubricBreakdown.structure.score + rubricBreakdown.engagement.score) / 4).toFixed(1)}/10
                </div>
              </div>
              {expandedSection === 'presentation' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
        </div>

          {expandedSection === 'presentation' && (
            <div
              className="px-6 pb-6 space-y-4"
            >
            {presentationCriteria.map((criterion) => {
              const item = rubricBreakdown[criterion.key as keyof typeof rubricBreakdown];
              return (
                <div key={criterion.key} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      {getScoreIcon(criterion.key)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-white font-medium">{criterion.label}</span>
                          <div className="text-xs text-gray-400">{criterion.description}</div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(item.score, item.maxScore)}`}>
                          {item.score}/{item.maxScore}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-11">
                    <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          (item.score / item.maxScore) >= 0.8 ? 'bg-emerald-400' :
                          (item.score / item.maxScore) >= 0.7 ? 'bg-green-400' :
                          (item.score / item.maxScore) >= 0.6 ? 'bg-yellow-400' :
                          (item.score / item.maxScore) >= 0.5 ? 'bg-orange-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${getProgressWidth(item.score, item.maxScore)}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-300 mt-2 italic">{item.feedback}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Language Proficiency Section */}
      <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-emerald-900/30 overflow-hidden">
        <div
          className="p-6 cursor-pointer select-none hover:bg-emerald-900/10"
          onClick={() => toggleSection('language')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <BookOpen className="text-blue-400" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Language Proficiency</h3>
                <p className="text-sm text-gray-400">Grammar and vocabulary assessment</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-gray-400">Average Score</div>
                <div className="text-lg font-bold text-blue-400">
                  {((rubricBreakdown.vocabulary.score + rubricBreakdown.grammar.score) / 2).toFixed(1)}/10
                </div>
              </div>
              {expandedSection === 'language' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
        </div>

          {expandedSection === 'language' && (
            <div
              className="px-6 pb-6 space-y-4"
            >
            {languageCriteria.map((criterion) => {
              const item = rubricBreakdown[criterion.key as keyof typeof rubricBreakdown];
              return (
                <div key={criterion.key} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      {getScoreIcon(criterion.key)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-white font-medium">{criterion.label}</span>
                          <div className="text-xs text-gray-400">{criterion.description}</div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(item.score, item.maxScore)}`}>
                          {item.score}/{item.maxScore}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-11">
                    <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-blue-400`}
                        style={{ width: `${getProgressWidth(item.score, item.maxScore)}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-300 mt-2 italic">{item.feedback}</p>
                  </div>
                </div>
              );
            })}
        </div>
        )}
      </div>

      {/* TOEFL Scores Section */}
      <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-emerald-900/30 overflow-hidden">
        <div
          className="p-6 cursor-pointer select-none hover:bg-emerald-900/10"
          onClick={() => toggleSection('toefl')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Award className="text-purple-400" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">TOEFL Speaking Scores</h3>
                <p className="text-sm text-gray-400">Academic English assessment</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-gray-400">Total Score</div>
                <div className="text-lg font-bold text-purple-400">
                  {((toeflScores.delivery + toeflScores.languageUse + toeflScores.topicDevelopment) / 3).toFixed(1)}/4
                </div>
              </div>
              {expandedSection === 'toefl' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
        </div>

        {expandedSection === 'toefl' && (
          <div
            className="px-6 pb-6 space-y-4"
          >
            {toeflCriteria.map((criterion) => {
              const score = toeflScores[criterion.key as keyof typeof toeflScores];
              const maxScore = 4;
              
              return (
                <div key={criterion.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-white font-medium">{criterion.label}</span>
                      <div className="text-xs text-gray-400">{criterion.description}</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(score, maxScore)}`}>
                      {score}/4
                    </div>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-purple-400`}
                      style={{ width: `${getProgressWidth(score, maxScore)}%` }}
                    />
                  </div>
                </div>
              );
            })}
            
            <div className="mt-4 pt-4 border-t border-gray-700/50">
              <h5 className="text-sm font-medium text-gray-300 mb-3">TOEFL Score Guide</h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                  <span className="text-gray-400">4.0: Advanced</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-400/60"></div>
                  <span className="text-gray-400">3.0: High-Intermediate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-400/30"></div>
                  <span className="text-gray-400">2.0: Intermediate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <span className="text-gray-400">1.0: Low-Intermediate</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RubricBreakdown;