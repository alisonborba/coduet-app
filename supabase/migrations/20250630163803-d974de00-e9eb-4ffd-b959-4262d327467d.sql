
-- Remove the bid_amount column from applications table (rate field)
ALTER TABLE applications DROP COLUMN IF EXISTS bid_amount;

-- Remove the deadline column from posts table
ALTER TABLE posts DROP COLUMN IF EXISTS deadline;

-- Add new columns to posts table for blockchain integration
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS post_id BIGINT,
ADD COLUMN IF NOT EXISTS publisher_pubkey TEXT,
ADD COLUMN IF NOT EXISTS total_value NUMERIC,
ADD COLUMN IF NOT EXISTS transaction_signature TEXT;

-- Create index on post_id for better performance
CREATE INDEX IF NOT EXISTS idx_posts_post_id ON posts(post_id);
