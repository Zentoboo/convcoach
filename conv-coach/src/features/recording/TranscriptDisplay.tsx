interface TranscriptDisplayProps {
  transcript: string;
}

const TranscriptDisplay = ({ transcript }: TranscriptDisplayProps) => {
  return (
    <div className="bg-black/50 rounded-lg p-5 mb-6 min-h-[200px] max-h-[300px] overflow-y-auto border border-emerald-900/20">
      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm font-mono">
        {transcript || 'Your transcript will appear here during recording...'}
      </p>
    </div>
  );
};

export default TranscriptDisplay;