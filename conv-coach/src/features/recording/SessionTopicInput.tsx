interface SessionTopicInputProps {
  sessionTopic: string;
  setSessionTopic: (topic: string) => void;
  isRecording: boolean;
  isAnalyzing: boolean;
}

const SessionTopicInput = ({
  sessionTopic,
  setSessionTopic,
  isRecording,
  isAnalyzing
}: SessionTopicInputProps) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Session Topic (optional but recommended for AI feedback)
      </label>
      <input
        type="text"
        value={sessionTopic}
        onChange={(e) => setSessionTopic(e.target.value)}
        placeholder="e.g., Product presentation, Job interview, Public speaking practice"
        disabled={isRecording || isAnalyzing}
        className="w-full px-4 py-3 bg-black/40 border border-emerald-900/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50"
      />
    </div>
  );
};

export default SessionTopicInput;