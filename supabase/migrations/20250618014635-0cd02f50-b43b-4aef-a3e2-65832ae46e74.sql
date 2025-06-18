
-- Enable RLS on non_conformances table
ALTER TABLE public.non_conformances ENABLE ROW LEVEL SECURITY;

-- Enable RLS on nc_activities table  
ALTER TABLE public.nc_activities ENABLE ROW LEVEL SECURITY;

-- Enable RLS on nc_attachments table
ALTER TABLE public.nc_attachments ENABLE ROW LEVEL SECURITY;

-- Enable RLS on nc_notifications table
ALTER TABLE public.nc_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for non_conformances table
CREATE POLICY "Users can view non-conformances from their organization" 
ON public.non_conformances FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.organization_id = (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  )
);

CREATE POLICY "Users can create non-conformances in their organization" 
ON public.non_conformances FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid()
  )
);

CREATE POLICY "Users can update non-conformances in their organization" 
ON public.non_conformances FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.organization_id = (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  )
);

-- Create policies for nc_activities table
CREATE POLICY "Users can view NC activities from their organization" 
ON public.nc_activities FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.non_conformances nc
    JOIN public.profiles p ON p.id = auth.uid()
    WHERE nc.id = nc_activities.non_conformance_id
  )
);

CREATE POLICY "Users can create NC activities" 
ON public.nc_activities FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.non_conformances nc
    JOIN public.profiles p ON p.id = auth.uid()
    WHERE nc.id = nc_activities.non_conformance_id
  )
);

-- Create policies for nc_attachments table
CREATE POLICY "Users can view NC attachments from their organization" 
ON public.nc_attachments FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.non_conformances nc
    JOIN public.profiles p ON p.id = auth.uid()
    WHERE nc.id = nc_attachments.non_conformance_id
  )
);

CREATE POLICY "Users can create NC attachments" 
ON public.nc_attachments FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.non_conformances nc
    JOIN public.profiles p ON p.id = auth.uid()
    WHERE nc.id = nc_attachments.non_conformance_id
  )
);

-- Create policies for nc_notifications table
CREATE POLICY "Users can view NC notifications from their organization" 
ON public.nc_notifications FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.non_conformances nc
    JOIN public.profiles p ON p.id = auth.uid()
    WHERE nc.id = nc_notifications.non_conformance_id
  )
);

CREATE POLICY "System can create NC notifications" 
ON public.nc_notifications FOR INSERT 
WITH CHECK (true);
