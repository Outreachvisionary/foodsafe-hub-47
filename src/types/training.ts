export type TrainingStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Overdue' | 'Cancelled';

export interface TrainingSession {
  id: string;
  title: string;
  description?: string;
  training_type: string;
  training_category?: string;
  department?: string;
  start_date?: string;
  due_date?: string;
  assigned_to: string[];
  materials_id?: string[];
  required_roles?: string[];
  is_recurring?: boolean;
  recurring_interval?: number;
  completion_status: TrainingStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TrainingRecord {
  id: string;
  session_id: string;
  employee_id: string;
  employee_name: string;
  status: TrainingStatus;
  assigned_date: string;
  due_date: string;
  completion_date?: string;
  score?: number;
  pass_threshold?: number;
  last_recurrence?: string;
  next_recurrence?: string;
  notes?: string;
}

export interface TrainingPlan {
  id: string;
  name: string;
  description?: string;
  targetRoles: string[];
  targetDepartments?: string[];
  coursesIncluded: string[];
  durationDays: number;
  isRequired: boolean;
  priority?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  isAutomated?: boolean;
  automationTrigger?: string;
  relatedStandards?: string[];
  created_by: string;
  created_at?: string;
  updated_at?: string;
  
  // Database equivalents
  courses?: string[];
  duration_days?: number;
  is_required?: boolean;
  start_date?: string;
  end_date?: string;
  is_automated?: boolean;
  automation_trigger?: string;
  target_roles?: string[];
  target_departments?: string[];
  related_standards?: string[];
}

export interface TrainingCourse {
  id: string;
  title: string;
  description?: string;
  category?: string;
  durationHours?: number;
  prerequisites?: string[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Functions to convert between database and app models
export const mapDbToTrainingSession = (dbRecord: any): TrainingSession => {
  return {
    id: dbRecord.id,
    title: dbRecord.title,
    description: dbRecord.description,
    training_type: dbRecord.training_type,
    training_category: dbRecord.training_category,
    department: dbRecord.department,
    start_date: dbRecord.start_date,
    due_date: dbRecord.due_date,
    assigned_to: dbRecord.assigned_to || [],
    materials_id: dbRecord.materials_id || [],
    required_roles: dbRecord.required_roles || [],
    is_recurring: dbRecord.is_recurring,
    recurring_interval: dbRecord.recurring_interval,
    completion_status: dbRecord.completion_status as TrainingStatus,
    created_by: dbRecord.created_by,
    created_at: dbRecord.created_at,
    updated_at: dbRecord.updated_at
  };
};

export const mapDbToTrainingPlan = (dbRecord: any): TrainingPlan => {
  return {
    id: dbRecord.id,
    name: dbRecord.name,
    description: dbRecord.description,
    targetRoles: dbRecord.target_roles || [],
    targetDepartments: dbRecord.target_departments || [],
    coursesIncluded: dbRecord.courses || [],
    durationDays: dbRecord.duration_days || 0,
    isRequired: dbRecord.is_required || false,
    priority: dbRecord.priority,
    startDate: dbRecord.start_date,
    endDate: dbRecord.end_date,
    status: dbRecord.status,
    isAutomated: dbRecord.is_automated,
    automationTrigger: dbRecord.automation_trigger,
    relatedStandards: dbRecord.related_standards || [],
    created_by: dbRecord.created_by,
    created_at: dbRecord.created_at,
    updated_at: dbRecord.updated_at,
    
    // Keep database fields too for compatibility
    courses: dbRecord.courses,
    duration_days: dbRecord.duration_days,
    is_required: dbRecord.is_required,
    start_date: dbRecord.start_date,
    end_date: dbRecord.end_date,
    is_automated: dbRecord.is_automated,
    automation_trigger: dbRecord.automation_trigger,
    target_roles: dbRecord.target_roles,
    target_departments: dbRecord.target_departments,
    related_standards: dbRecord.related_standards
  };
};

export const mapDbToTrainingRecord = (dbRecord: any): TrainingRecord => {
  return {
    id: dbRecord.id,
    session_id: dbRecord.session_id,
    employee_id: dbRecord.employee_id,
    employee_name: dbRecord.employee_name,
    status: dbRecord.status as TrainingStatus,
    assigned_date: dbRecord.assigned_date,
    due_date: dbRecord.due_date,
    completion_date: dbRecord.completion_date,
    score: dbRecord.score,
    pass_threshold: dbRecord.pass_threshold,
    last_recurrence: dbRecord.last_recurrence,
    next_recurrence: dbRecord.next_recurrence,
    notes: dbRecord.notes
  };
};

export const mapTrainingPlanToDb = (plan: Partial<TrainingPlan>): any => {
  return {
    id: plan.id,
    name: plan.name,
    description: plan.description,
    courses: plan.coursesIncluded || plan.courses || [],
    duration_days: plan.durationDays || plan.duration_days || 0,
    is_required: plan.isRequired || plan.is_required || false,
    start_date: plan.startDate || plan.start_date,
    end_date: plan.endDate || plan.end_date,
    status: plan.status || 'Active',
    is_automated: plan.isAutomated || plan.is_automated || false,
    automation_trigger: plan.automationTrigger || plan.automation_trigger,
    target_roles: plan.targetRoles || plan.target_roles || [],
    target_departments: plan.targetDepartments || plan.target_departments || [],
    related_standards: plan.relatedStandards || plan.related_standards || [],
    priority: plan.priority || 'Medium',
    created_by: plan.created_by || 'system',
    created_at: plan.created_at,
    updated_at: plan.updated_at
  };
};

export const mapTrainingSessionToDb = (session: Partial<TrainingSession>): any => {
  return {
    id: session.id,
    title: session.title,
    description: session.description,
    training_type: session.training_type,
    training_category: session.training_category,
    department: session.department,
    start_date: session.start_date,
    due_date: session.due_date,
    assigned_to: session.assigned_to || [],
    materials_id: session.materials_id || [],
    required_roles: session.required_roles || [],
    is_recurring: session.is_recurring || false,
    recurring_interval: session.recurring_interval,
    completion_status: session.completion_status,
    created_by: session.created_by || 'system',
    created_at: session.created_at,
    updated_at: session.updated_at
  };
};
