import React from 'react';
import LayoutWrapper from '../components/layout/LayoutWrapper';
import { IELTSTestContainer } from '../features/ielts/components/IELTSTestContainer';

interface IELTSModePageProps {
  onBackToHome: () => void;
}

const IELTSModePage: React.FC<IELTSModePageProps> = ({ onBackToHome }) => {
  return (
    <LayoutWrapper showFooter={false}>
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="max-w-6xl w-full">
          <IELTSTestContainer 
            testMode="ielts" 
            onBackToHome={onBackToHome}
          />
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default IELTSModePage;