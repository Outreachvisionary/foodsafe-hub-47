
import { TrainingStatus, TrainingRecord, TrainingSession } from './database';

export type { TrainingStatus, TrainingRecord, TrainingSession };

export interface ExtendedTrainingRecord extends TrainingRecord {
  courseName?: string;
  instructorName?: string;
}
