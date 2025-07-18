
-- Remove secure payment table and related functionality
DROP TABLE IF EXISTS payment_verification_log CASCADE;
DROP TABLE IF EXISTS secure_payments CASCADE;

-- Drop the secure payment creation function
DROP FUNCTION IF EXISTS create_secure_payment(uuid, text, numeric, text, text, uuid, text);

-- Drop the secure payment update trigger function
DROP FUNCTION IF EXISTS update_secure_payments_updated_at();

-- Add receipt_upload_path column to payments table if it doesn't exist
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS receipt_upload_path TEXT;

-- Update the payment_receipts table to use payment_id from payments table
-- (This should already be working since payment_receipts references payments)
