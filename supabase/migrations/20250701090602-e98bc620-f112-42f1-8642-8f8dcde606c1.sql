
-- Update the destinations table to match the interface requirements
ALTER TABLE destinations 
RENAME COLUMN destination_id TO id;

-- Add the missing procedure_type column
ALTER TABLE destinations 
ADD COLUMN procedure_type VARCHAR(100) NOT NULL DEFAULT 'Study Abroad Program';

-- Add columns for tuition information
ALTER TABLE destinations 
ADD COLUMN bachelor_tuition_min INTEGER,
ADD COLUMN bachelor_tuition_max INTEGER,
ADD COLUMN master_tuition_min INTEGER,
ADD COLUMN master_tuition_max INTEGER,
ADD COLUMN phd_tuition_min INTEGER,
ADD COLUMN phd_tuition_max INTEGER;

-- Add columns for academic levels
ALTER TABLE destinations 
ADD COLUMN bachelor_academic_level VARCHAR(10) CHECK (bachelor_academic_level IN ('High', 'Medium', 'Any')),
ADD COLUMN master_academic_level VARCHAR(10) CHECK (master_academic_level IN ('High', 'Medium', 'Any')),
ADD COLUMN phd_academic_level VARCHAR(10) CHECK (phd_academic_level IN ('High', 'Medium', 'Any'));

-- Add columns for requirements
ALTER TABLE destinations 
ADD COLUMN bachelor_requirements TEXT,
ADD COLUMN master_requirements TEXT,
ADD COLUMN phd_requirements TEXT;

-- Add columns for required documents (stored as JSON arrays)
ALTER TABLE destinations 
ADD COLUMN bachelor_documents JSONB DEFAULT '[]',
ADD COLUMN master_documents JSONB DEFAULT '[]',
ADD COLUMN phd_documents JSONB DEFAULT '[]';

-- Add columns for success rates
ALTER TABLE destinations 
ADD COLUMN admission_success_rate INTEGER,
ADD COLUMN visa_success_rate INTEGER;

-- Add columns for programs and agency services
ALTER TABLE destinations 
ADD COLUMN available_programs JSONB DEFAULT '["Bachelor", "Master", "PhD"]',
ADD COLUMN agency_services JSONB DEFAULT '[]';

-- Add columns for fees
ALTER TABLE destinations 
ADD COLUMN application_fee INTEGER,
ADD COLUMN service_fee INTEGER,
ADD COLUMN visa_processing_fee INTEGER;

-- Add additional helpful columns (skip processing_time since it exists)
ALTER TABLE destinations 
ADD COLUMN language_requirements TEXT,
ADD COLUMN intake_periods JSONB DEFAULT '[]',
ADD COLUMN logo_url VARCHAR(500),
ADD COLUMN cover_image_url VARCHAR(500);

-- Update existing records with sample data
UPDATE destinations 
SET 
  procedure_type = 'Campus France',
  bachelor_tuition_min = 170,
  bachelor_tuition_max = 2500,
  master_tuition_min = 243,
  master_tuition_max = 4000,
  phd_tuition_min = 380,
  phd_tuition_max = 5000,
  bachelor_academic_level = 'Medium',
  master_academic_level = 'Medium',
  phd_academic_level = 'High',
  bachelor_requirements = 'High school diploma, French language proficiency (B2 level)',
  master_requirements = 'Bachelor degree, French language proficiency (B2 level), Academic transcripts',
  phd_requirements = 'Master degree, Research proposal, French language proficiency (C1 level)',
  bachelor_documents = '["High School Diploma", "Transcripts", "Language Certificate", "Passport Copy", "Motivation Letter"]',
  master_documents = '["Bachelor Degree", "Transcripts", "Language Certificate", "Passport Copy", "CV", "Research Proposal"]',
  phd_documents = '["Master Degree", "Transcripts", "Language Certificate", "Passport Copy", "CV", "Research Proposal", "Publications"]',
  admission_success_rate = 75,
  visa_success_rate = 90,
  available_programs = '["Bachelor", "Master", "PhD"]',
  agency_services = '["Application_Assistance", "Document_Translation", "Visa_Support", "Housing_Assistance", "Pre_Departure_Briefing"]',
  application_fee = 150,
  service_fee = 500,
  visa_processing_fee = 99,
  processing_time = '4-8 weeks',
  language_requirements = 'French (B2 level minimum)',
  intake_periods = '["September", "January"]',
  logo_url = '/placeholder.svg?height=80&width=80&text=CF',
  cover_image_url = '/placeholder.svg?height=300&width=500&text=France'
WHERE country = 'France';

-- Insert additional destinations
INSERT INTO destinations (
  name, country, region, description, procedure_type,
  bachelor_tuition_min, bachelor_tuition_max, master_tuition_min, master_tuition_max, phd_tuition_min, phd_tuition_max,
  bachelor_academic_level, master_academic_level, phd_academic_level,
  bachelor_requirements, master_requirements, phd_requirements,
  bachelor_documents, master_documents, phd_documents,
  admission_success_rate, visa_success_rate,
  available_programs, agency_services,
  application_fee, service_fee, visa_processing_fee,
  processing_time, language_requirements, intake_periods,
  logo_url, cover_image_url, fees, success_rate, status
) VALUES 
(
  'Private Schools France', 'France', 'Western Europe', 
  'Access to prestigious private institutions in France with personalized support and faster processing.',
  'Private Institution Partnership',
  8000, 15000, 12000, 25000, 15000, 30000,
  'Any', 'Medium', 'High',
  'High school diploma, Basic French knowledge (A2 level)',
  'Bachelor degree, French proficiency (B1 level), Interview',
  'Master degree, Research proposal, French proficiency (B2 level)',
  '["High School Diploma", "Transcripts", "Language Certificate", "Passport Copy", "Financial Proof"]',
  '["Bachelor Degree", "Transcripts", "Language Certificate", "Passport Copy", "CV", "Interview"]',
  '["Master Degree", "Transcripts", "Language Certificate", "Passport Copy", "CV", "Research Proposal"]',
  85, 92,
  '["Bachelor", "Master", "PhD"]',
  '["Fast_Track_Application", "Interview_Preparation", "Visa_Support", "Housing_Assistance", "Academic_Counseling"]',
  200, 800, 99,
  '2-4 weeks', 'French (A2-B2 depending on program)', '["September", "January", "May"]',
  '/placeholder.svg?height=80&width=80&text=PS', '/placeholder.svg?height=300&width=500&text=Private+France',
  12000, 85, 'Active'
),
(
  'Belgium Universities', 'Belgium', 'Western Europe',
  'Study in Belgium through our comprehensive university partnership program with excellent scholarship opportunities.',
  'University Partnership',
  835, 4175, 835, 4175, 835, 4175,
  'Medium', 'Medium', 'High',
  'Secondary education certificate, Language proficiency (Dutch/French/English B2)',
  'Bachelor degree, Language proficiency (Dutch/French/English B2), Academic portfolio',
  'Master degree, Research proposal, Language proficiency (Dutch/French/English C1)',
  '["Secondary Education Certificate", "Transcripts", "Language Certificate", "Passport Copy", "Motivation Letter"]',
  '["Bachelor Degree", "Transcripts", "Language Certificate", "Passport Copy", "CV", "Portfolio"]',
  '["Master Degree", "Transcripts", "Language Certificate", "Passport Copy", "CV", "Research Proposal"]',
  80, 88,
  '["Bachelor", "Master", "PhD"]',
  '["University_Selection", "Application_Support", "Scholarship_Guidance", "Visa_Processing", "Integration_Support"]',
  100, 600, 85,
  '6-10 weeks', 'Dutch, French, or English (B2 level)', '["September", "February"]',
  '/placeholder.svg?height=80&width=80&text=BE', '/placeholder.svg?height=300&width=500&text=Belgium',
  2500, 80, 'Active'
);
