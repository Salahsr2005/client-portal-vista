-- Create destination applications table
CREATE TABLE public.destination_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL,
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  program_level TEXT NOT NULL CHECK (program_level IN ('Bachelor', 'Master', 'PhD')),
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Paid', 'Failed', 'Refunded')),
  priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
  application_data JSONB DEFAULT '{}',
  notes TEXT,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.destination_applications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own destination applications" 
ON public.destination_applications 
FOR SELECT 
USING (client_id = auth.uid());

CREATE POLICY "Users can create their own destination applications" 
ON public.destination_applications 
FOR INSERT 
WITH CHECK (client_id = auth.uid());

CREATE POLICY "Users can update their own destination applications" 
ON public.destination_applications 
FOR UPDATE 
USING (client_id = auth.uid());

-- Create destination application timeline table
CREATE TABLE public.destination_application_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_application_id UUID NOT NULL REFERENCES destination_applications(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL DEFAULT now(),
  note TEXT,
  admin_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for timeline
ALTER TABLE public.destination_application_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view timeline for their destination applications"
ON public.destination_application_timeline
FOR SELECT
USING (
  destination_application_id IN (
    SELECT id FROM destination_applications WHERE client_id = auth.uid()
  )
);

-- Create indexes for better performance
CREATE INDEX idx_destination_applications_client_id ON destination_applications(client_id);
CREATE INDEX idx_destination_applications_destination_id ON destination_applications(destination_id);
CREATE INDEX idx_destination_applications_status ON destination_applications(status);
CREATE INDEX idx_destination_application_timeline_app_id ON destination_application_timeline(destination_application_id);

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_destination_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER destination_applications_updated_at
  BEFORE UPDATE ON destination_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_destination_applications_updated_at();

-- Create trigger for auto-creating timeline events
CREATE OR REPLACE FUNCTION create_destination_application_timeline()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert timeline event on status change
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO destination_application_timeline (
      destination_application_id,
      status,
      date,
      note
    ) VALUES (
      NEW.id,
      NEW.status,
      now(),
      CASE 
        WHEN TG_OP = 'INSERT' THEN 'Application created'
        ELSE 'Status updated to ' || NEW.status
      END
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER destination_application_timeline_trigger
  AFTER INSERT OR UPDATE ON destination_applications
  FOR EACH ROW
  EXECUTE FUNCTION create_destination_application_timeline();