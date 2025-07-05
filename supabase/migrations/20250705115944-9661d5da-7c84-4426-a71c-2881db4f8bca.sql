-- Create payment_receipts table for receipt uploads
CREATE TABLE IF NOT EXISTS payment_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID,
  client_id UUID NOT NULL,
  receipt_path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Verified', 'Rejected')),
  notes TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID
);

-- Enable RLS
ALTER TABLE payment_receipts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own receipts" 
ON payment_receipts 
FOR SELECT 
USING (client_id = auth.uid());

CREATE POLICY "Users can insert their own receipts" 
ON payment_receipts 
FOR INSERT 
WITH CHECK (client_id = auth.uid());