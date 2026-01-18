import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Brain, Loader, AlertCircle, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AIFeedback = ({
    transcript,
    speed,
    fillerPercentage,
    confidence,
    topic,
    sessionId,
    triggerAnalysis,
    onAnalysisComplete
}) => {
    const [aiFeedback, setAiFeedback] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasAnalyzed, setHasAnalyzed] = useState(false);
    const abortControllerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    useEffect(() => {
        if (triggerAnalysis && !hasAnalyzed && sessionId && topic && transcript && transcript.trim().length > 50) {
            analyzeWithGemini();
        }
    }, [triggerAnalysis, hasAnalyzed, sessionId, topic, transcript]);

    const analyzeWithGemini = async () => {
        if (hasAnalyzed || isLoading) return;

        setIsLoading(true);
        setError(null);
        abortControllerRef.current = new AbortController();

        try {
            console.log('Starting AI analysis...');

            const response = await fetch('http://localhost:5000/api/analyze-with-gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    transcript,
                    speed,
                    fillerPercentage,
                    confidence,
                    topic
                }),
                signal: abortControllerRef.current.signal
            });

            if (!response.ok) {
                throw new Error(`AI analysis failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Received AI response:', data);

            if (!data?.aiFeedback || typeof data.aiFeedback !== 'string') {
                throw new Error("Received invalid response from AI analysis");
            }

            // CRITICAL: Update UI state immediately
            console.log('Setting AI feedback and clearing loading...');
            setAiFeedback(data.aiFeedback);
            setHasAnalyzed(true);
            setIsLoading(false);

            if (onAnalysisComplete) {
                onAnalysisComplete(data.aiFeedback);
            }

            // Save to database in background (non-blocking)
            if (sessionId) {
                console.log('Saving AI feedback to session:', sessionId);
                fetch(`http://localhost:5000/api/sessions/${sessionId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ aiFeedback: data.aiFeedback })
                })
                    .then(() => console.log('AI feedback saved successfully'))
                    .catch(err => console.error('Failed to save AI feedback:', err));
            }
        } catch (err) {
            console.error("AI Analysis error:", err);
            if (err.name !== 'AbortError') {
                setError(err.message || "Couldn't generate AI insights. Please try again later.");
            }
            setIsLoading(false);
        } finally {
            abortControllerRef.current = null;
        }
    };

    const resetAnalysis = () => {
        setHasAnalyzed(false);
        setAiFeedback(null);
        setError(null);
    };

    const renderFeedbackContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
                    <p className="text-gray-300 text-lg font-medium">Generating personalized insights...</p>
                    <p className="text-gray-400 text-sm mt-2 max-w-md text-center">
                        Our AI coach is analyzing your speech patterns, content relevance, and delivery metrics to provide customized feedback.
                    </p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <AlertCircle className="text-amber-400 mb-3" size={32} />
                    <p className="text-amber-300 font-medium mb-1">{error}</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={analyzeWithGemini}
                        className="mt-4 px-4 py-2 bg-amber-600/20 text-amber-300 rounded-lg border border-amber-500/30 hover:bg-amber-600/30 transition-colors flex items-center gap-2"
                    >
                        <RefreshCw size={16} /> Try Again
                    </motion.button>
                </div>
            );
        }

        if (!aiFeedback) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                    <Brain className="text-emerald-500/30 mb-4" size={48} />
                    <p>Complete your recording with a defined topic to receive AI-powered insights</p>
                </div>
            );
        }

        return (
            <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h3: ({ node, ...props }) => <h3 className="text-emerald-400 mt-4 mb-2 text-lg font-bold" {...props} />,
                        ul: ({ node, ...props }) => <ul className="space-y-2 list-disc list-inside ml-4 mt-2" {...props} />,
                        li: ({ node, ...props }) => <li className="text-gray-300 ml-1 py-0.5" {...props} />,
                        p: ({ node, ...props }) => <p className="text-gray-300 my-2" {...props} />,
                        strong: ({ node, ...props }) => <strong className="text-white font-semibold" {...props} />
                    }}
                >
                    {aiFeedback}
                </ReactMarkdown>
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-emerald-900/30"
        >
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-white flex items-center">
                    <Brain className="mr-2.5 text-emerald-400" size={22} />
                    AI Communication Insights
                </h2>
                <div className="flex gap-2">
                    {!hasAnalyzed && topic && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={analyzeWithGemini}
                            disabled={isLoading || !transcript || transcript.trim().length < 50}
                            className="px-4 py-2 bg-emerald-700/30 text-emerald-300 rounded-lg text-sm font-medium hover:bg-emerald-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                        >
                            {isLoading ? (
                                <>
                                    <Loader className="animate-spin" size={16} />
                                    Analyzing...
                                </>
                            ) : (
                                'Generate Insights'
                            )}
                        </motion.button>
                    )}
                    {hasAnalyzed && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={resetAnalysis}
                            className="px-3 py-2 bg-gray-800/50 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-700/30 transition-colors flex items-center gap-1.5"
                        >
                            <RefreshCw size={16} /> Regenerate
                        </motion.button>
                    )}
                </div>
            </div>

            {topic ? (
                <div className="mb-4 p-3 bg-emerald-900/20 border-l-2 border-emerald-500 rounded-r-md">
                    <p className="text-sm text-emerald-300">
                        <span className="font-medium">Discussion Topic:</span> {topic}
                    </p>
                </div>
            ) : (
                <div className="mb-6 p-4 bg-amber-900/20 border border-amber-900/40 rounded-lg">
                    <p className="text-amber-300 text-sm">
                        Set a topic before recording to receive AI-powered feedback on content relevance and delivery quality.
                    </p>
                </div>
            )}

            <div className="bg-black/30 rounded-lg p-5 min-h-[200px] border border-emerald-900/10">
                {renderFeedbackContent()}
            </div>

            {!topic && (
                <div className="mt-4 text-xs text-gray-500 italic text-center">
                    Complete a recording with a defined topic to unlock AI-powered communication insights.
                </div>
            )}

            {transcript && transcript.trim().length > 0 && transcript.trim().length < 50 && !hasAnalyzed && (
                <div className="mt-3 text-xs text-amber-400 text-center">
                    Transcript too short ({transcript.trim().length} characters). Minimum 50 characters required for analysis.
                </div>
            )}
        </motion.div>
    );
};

export default AIFeedback;