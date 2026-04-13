-- Quick admin setup - run this in Supabase SQL Editor

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert admin users
INSERT INTO admin_users (id, email, role) VALUES 
('7352d112-d296-458a-a17b-321b8c3c96f2', 'abrazzak6980@gmail.com', 'admin'),
('9c1922d0-4f1a-4b49-afd1-6a22181384f4', 'freelancerabdurrazzak47@gmail.com', 'admin');