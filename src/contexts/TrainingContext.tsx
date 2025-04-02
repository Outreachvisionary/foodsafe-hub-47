
import React, { createContext, useContext, ReactNode } from 'react';
import { useTrainingRecords } from '@/hooks/useTrainingRecords';
import { useTrainingPlans } from '@/hooks/useTrainingPlans';
import { useTrainingSessions } from '@/hooks/useTrainingSessions';
import { useTrainingConfig } from '@/hooks/useTrainingConfig';
import { LoadingOverlay } from '@/components/ui/loading-overlay';

type TrainingContextType = {
  recordsState: ReturnType<typeof useTrainingRecords>;
  plansState: ReturnType<typeof useTrainingPlans>;
  sessionsState: ReturnType<typeof useTrainingSessions>;
  configState: ReturnType<typeof useTrainingConfig>;
  isLoading: boolean;
  hasErrors: boolean;
};

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

interface TrainingProviderProps {
  children: ReactNode;
  showLoadingOverlay?: boolean;
}

export const TrainingProvider: React.FC<TrainingProviderProps> = ({ 
  children, 
  showLoadingOverlay = false 
}) => {
  const recordsState = useTrainingRecords();
  const plansState = useTrainingPlans();
  const sessionsState = useTrainingSessions();
  const configState = useTrainingConfig();
  
  // Combined loading state
  const isLoading = recordsState.loading || 
                    plansState.loading || 
                    sessionsState.loading || 
                    configState.loading;
                    
  // Combined error state
  const hasErrors = !!(recordsState.error || 
                     plansState.error || 
                     sessionsState.error || 
                     configState.error);

  return (
    <TrainingContext.Provider 
      value={{ 
        recordsState, 
        plansState, 
        sessionsState, 
        configState,
        isLoading,
        hasErrors
      }}
    >
      {showLoadingOverlay && isLoading ? (
        <LoadingOverlay message="Loading training data..." submessage="This may take a moment" />
      ) : children}
    </TrainingContext.Provider>
  );
};

export const useTrainingContext = () => {
  const context = useContext(TrainingContext);
  if (context === undefined) {
    throw new Error('useTrainingContext must be used within a TrainingProvider');
  }
  return context;
};
