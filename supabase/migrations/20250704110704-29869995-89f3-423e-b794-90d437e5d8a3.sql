-- Create a secure payments tracking table
CREATE TABLE IF NOT EXISTS secure_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL,
  payment_reference TEXT NOT NULL UNIQUE,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('bank', 'ccp', 'card')),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'DZD',
  item_type TEXT NOT NULL CHECK (item_type IN ('program', 'destination', 'service')),
  item_id UUID,
  item_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'payment_uploaded', 'verified', 'rejected')),
  payment_instructions_generated BOOLEAN DEFAULT true,
  receipt_upload_path TEXT,
  verification_notes TEXT,
  verified_by UUID,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE secure_payments ENABLE ROW LEVEL SECURITY;

-- Create policies for secure payments
CREATE POLICY "Users can view their own secure payments"
ON secure_payments
FOR SELECT
USING (client_id = auth.uid());

CREATE POLICY "Users can insert their own secure payments"
ON secure_payments
FOR INSERT
WITH CHECK (client_id = auth.uid());

CREATE POLICY "Users can update their own secure payments"
ON secure_payments
FOR UPDATE
USING (client_id = auth.uid())
WITH CHECK (client_id = auth.uid());

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_secure_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER secure_payments_updated_at
BEFORE UPDATE ON secure_payments
FOR EACH ROW
EXECUTE FUNCTION update_secure_payments_updated_at();

-- Create payment verification log table for audit trail
CREATE TABLE IF NOT EXISTS payment_verification_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  secure_payment_id UUID NOT NULL REFERENCES secure_payments(id) ON DELETE CASCADE,
  admin_id UUID,
  action TEXT NOT NULL CHECK (action IN ('receipt_uploaded', 'verified', 'rejected', 'notes_added')),
  previous_status TEXT,
  new_status TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for verification log
ALTER TABLE payment_verification_log ENABLE ROW LEVEL SECURITY;

-- Create policy for payment verification log (admins only can see all, users can see their own)
CREATE POLICY "Users can view their own payment verification log"
ON payment_verification_log
FOR SELECT
USING (
  secure_payment_id IN (
    SELECT id FROM secure_payments WHERE client_id = auth.uid()
  )
);

-- Function to create secure payment record
CREATE OR REPLACE FUNCTION create_secure_payment(
  p_client_id UUID,
  p_payment_method TEXT,
  p_amount DECIMAL,
  p_currency TEXT,
  p_item_type TEXT,
  p_item_id UUID,
  p_item_name TEXT
) RETURNS TEXT AS $$
DECLARE
  payment_ref TEXT;
  client_short_id TEXT;
BEGIN
  -- Generate payment reference
  client_short_id := substring(p_client_id::text from 1 for 8);
  payment_ref := 'EVS-' || client_short_id || '-' || extract(epoch from NOW())::bigint::text;
  
  -- Insert secure payment record
  INSERT INTO secure_payments (
    client_id,
    payment_reference,
    payment_method,
    amount,
    currency,
    item_type,
    item_id,
    item_name
  ) VALUES (
    p_client_id,
    payment_ref,
    p_payment_method,
    p_amount,
    p_currency,
    p_item_type,
    p_item_id,
    p_item_name
  );
  
  RETURN payment_ref;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;