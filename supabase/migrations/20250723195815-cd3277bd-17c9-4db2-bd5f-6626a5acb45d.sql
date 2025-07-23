-- Enable RLS for facilities table and add policies
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view facilities" 
ON facilities 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage facilities" 
ON facilities 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Enable RLS for facility_standards table and add policies  
ALTER TABLE facility_standards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view facility standards" 
ON facility_standards 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage facility standards" 
ON facility_standards 
FOR ALL 
USING (auth.uid() IS NOT NULL);