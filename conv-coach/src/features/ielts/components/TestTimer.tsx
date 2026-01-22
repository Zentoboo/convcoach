import type { IELTSTestState } from '../types/ielts';

interface TestTimerProps {
  currentPart: IELTSTestState['currentPart'];
  elapsedTime: number;
  partTimes: {
    part1: number;
    part2Prep: number;
    part2Speaking: number;
    part3: number;
  };
}

export const TestTimer: React.FC<TestTimerProps> = ({
  currentPart,
  elapsedTime,
  partTimes
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerClass = () => {
    const targetTime = getTargetTime();
    if (!targetTime) return 'ielts-timer';
    
    const overtime = elapsedTime - targetTime;
    if (overtime > 30) return 'ielts-timer overtime';
    if (overtime > 0) return 'ielts-timer warning';
    return 'ielts-timer';
  };

  const getTargetTime = (): number | null => {
    switch (currentPart) {
      case 'part1':
        return 300; // 5 minutes target
      case 'part2-prep':
        return 60; // 1 minute preparation
      case 'part2-speaking':
        return 120; // 2 minutes target
      case 'part3':
        return 300; // 5 minutes target
      default:
        return null;
    }
  };

  const getPartName = (): string => {
    switch (currentPart) {
      case 'introduction':
        return 'Introduction';
      case 'part1':
        return 'Part 1';
      case 'part2-prep':
        return 'Part 2 - Preparation';
      case 'part2-speaking':
        return 'Part 2 - Speaking';
      case 'part3':
        return 'Part 3';
      case 'completed':
        return 'Completed';
      default:
        return '';
    }
  };

  const getDisplayTime = (): number => {
    switch (currentPart) {
      case 'part2-prep':
        return partTimes.part2Prep;
      case 'part2-speaking':
        return partTimes.part2Speaking;
      default:
        return elapsedTime;
    }
  };

  const getProgressPercentage = (): number => {
    const target = getTargetTime();
    if (!target) return 0;
    
    const current = currentPart === 'part2-prep' ? partTimes.part2Prep :
                    currentPart === 'part2-speaking' ? partTimes.part2Speaking :
                    elapsedTime;
    
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="text-right">
        <div className="ielts-text-secondary text-sm mb-1">
          {getPartName()}
        </div>
        <div className={`text-2xl font-mono font-bold ${getTimerClass()}`}>
          {formatTime(getDisplayTime())}
        </div>
      </div>
      
      {currentPart !== 'introduction' && currentPart !== 'completed' && (
        <div className="w-24">
          <div className="ielts-progress h-2">
            <div 
              className="ielts-progress-bar"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>
      )}
      
      <div className="ielts-part-indicator active">
        {getPartName()}
      </div>
    </div>
  );
};