
import React, { createContext, useContext, ReactNode } from 'react';
import { useTrainingRecords } from '@/hooks/useTrainingRecords';
import { useTrainingPlans } from '@/hooks/useTrainingPlans';
import { useTrainingSessions } from '@/hooks/useTrainingSessions';
import { useTrainingConfig } from '@/hooks/useTrainingConfig';

type TrainingContextType = {
  recordsState: ReturnType<typeof useTrainingRecords>;
  plansState: ReturnType<typeof useTrainingPlans>;
  sessionsState: ReturnType<typeof useTrainingSessions>;
  configState: ReturnType<typeof useTrainingConfig>;
  isLoading: boolean;
};

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

export const TrainingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const recordsState = useTrainingRecords();
  const plansState = useTrainingPlans();
  const sessionsState = useTrainingSessions();
  const configState = useTrainingConfig();
  
  // Combined loading state
  const isLoading = recordsState.loading || 
                    plansState.loading || 
                    sessionsState.loading || 
                    configState.loading;

  return (
    <TrainingContext.Provider 
      value={{ 
        recordsState, 
        plansState, 
        sessionsState, 
        configState,
        isLoading
      }}
    >
      {children}
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
