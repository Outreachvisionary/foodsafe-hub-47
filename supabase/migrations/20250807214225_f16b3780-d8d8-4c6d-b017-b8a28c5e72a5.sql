-- Insert sample training sessions to populate the training module
INSERT INTO public.training_sessions (
  title,
  description,
  training_type,
  training_category,
  start_date,
  due_date,
  created_by,
  assigned_to,
  required_roles,
  is_recurring,
  department
) VALUES 
(
  'Food Safety Fundamentals',
  'Comprehensive training on basic food safety principles including personal hygiene, temperature control, and contamination prevention.',
  'Mandatory',
  'Food_Safety',
  '2025-01-15 09:00:00+00',
  '2025-02-15 17:00:00+00',
  'ade0cfe2-b13a-4086-ab6c-1e8812f6b789',
  ARRAY['Production', 'Kitchen'],
  ARRAY['Food Handler'],
  false,
  'Production'
),
(
  'HACCP Implementation',
  'Advanced training on Hazard Analysis Critical Control Points system implementation and monitoring.',
  'Certification',
  'HACCP',
  '2025-01-20 14:00:00+00',
  '2025-03-01 17:00:00+00',
  'ade0cfe2-b13a-4086-ab6c-1e8812f6b789',
  ARRAY['Quality', 'Management'],
  ARRAY['QA Manager', 'Production Manager'],
  false,
  'Quality'
),
(
  'GMP Refresher Course',
  'Annual refresher training on Good Manufacturing Practices for all production staff.',
  'Refresher',
  'GMP',
  '2025-01-10 08:00:00+00',
  '2025-01-31 17:00:00+00',
  'ade0cfe2-b13a-4086-ab6c-1e8812f6b789',
  ARRAY['Production', 'Packaging', 'Maintenance'],
  ARRAY['Production Worker'],
  true,
  'Production'
),
(
  'Allergen Management',
  'Training on allergen identification, control measures, and cross-contamination prevention.',
  'Mandatory',
  'Food_Safety',
  '2025-01-25 10:00:00+00',
  '2025-02-25 17:00:00+00',
  'ade0cfe2-b13a-4086-ab6c-1e8812f6b789',
  ARRAY['Production', 'Quality'],
  ARRAY['Food Handler', 'QA Technician'],
  false,
  'Quality'
),
(
  'Equipment Sanitization',
  'Training on proper cleaning and sanitization procedures for food processing equipment.',
  'Optional',
  'Safety_Procedures',
  '2025-02-01 13:00:00+00',
  '2025-03-15 17:00:00+00',
  'ade0cfe2-b13a-4086-ab6c-1e8812f6b789',
  ARRAY['Maintenance', 'Production'],
  ARRAY['Maintenance Tech'],
  false,
  'Maintenance'
);

-- Insert sample training records with correct enum values
INSERT INTO public.training_records (
  session_id,
  employee_id,
  employee_name,
  status,
  assigned_date,
  due_date,
  score
) 
SELECT 
  ts.id,
  'emp-001',
  'John Smith',
  CASE 
    WHEN ts.title = 'Food Safety Fundamentals' THEN 'Completed'::training_status
    WHEN ts.title = 'HACCP Implementation' THEN 'In Progress'::training_status
    ELSE 'Not Started'::training_status
  END,
  ts.start_date,
  ts.due_date,
  CASE WHEN ts.title = 'Food Safety Fundamentals' THEN 95.0 ELSE NULL END
FROM public.training_sessions ts
LIMIT 3;