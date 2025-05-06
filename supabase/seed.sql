-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT NOT NULL,
  matric_number TEXT UNIQUE NOT NULL,
  level TEXT NOT NULL,
  faculty TEXT NOT NULL,
  department TEXT NOT NULL,
  programme TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  state_of_origin TEXT NOT NULL,
  marital_status TEXT NOT NULL,
  religion TEXT,
  medical_requirements TEXT,
  home_address TEXT NOT NULL,
  city TEXT NOT NULL,
  passport_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS next_of_kin (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
  relationship TEXT NOT NULL,
  home_address TEXT NOT NULL,
  city TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS security_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  has_misconduct BOOLEAN DEFAULT FALSE,
  has_been_convicted BOOLEAN DEFAULT FALSE,
  is_well_behaved BOOLEAN DEFAULT TRUE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS guarantors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
  relationship TEXT NOT NULL,
  home_address TEXT NOT NULL,
  city TEXT NOT NULL,
  signature BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_number TEXT UNIQUE NOT NULL,
  room_type TEXT NOT NULL,
  block TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  hostel_fee DECIMAL NOT NULL,
  utility_fee DECIMAL NOT NULL,
  caution_fee DECIMAL NOT NULL,
  form_fee DECIMAL NOT NULL,
  total_price DECIMAL NOT NULL,
  spaces_available INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS room_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  academic_year TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  payment_method TEXT,
  transaction_id TEXT,
  payment_amount DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  room_id UUID REFERENCES rooms(id),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id)
);

-- Create Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_number TEXT UNIQUE NOT NULL, -- Remita RRR
  order_id TEXT UNIQUE NOT NULL,
  matric_number TEXT,
  student_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  payment_type TEXT NOT NULL, -- FULL, HALF, CUSTOM
  payment_status TEXT NOT NULL, -- PENDING, COMPLETED, FAILED
  payment_date TIMESTAMP WITH TIME ZONE,
  academic_year TEXT NOT NULL,
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Create index for payment lookups
CREATE INDEX IF NOT EXISTS payments_matric_idx ON payments (matric_number);
CREATE INDEX IF NOT EXISTS payments_reference_idx ON payments (reference_number);

-- Create storage bucket for passport photos
-- Note: You'll need to create this bucket manually in the Supabase dashboard
-- or via the Supabase CLI, as we can't create buckets via plain SQL

-- Seed rooms data
-- Clear existing data first
DELETE FROM room_assignments;
DELETE FROM payments;
DELETE FROM rooms;

-- Rooms in Block A (Room of 4)
INSERT INTO rooms (room_number, room_type, block, capacity, hostel_fee, utility_fee, caution_fee, form_fee, total_price, spaces_available)
VALUES
  ('A101', 'Room of 4', 'Block A', 4, 180000, 28000, 10000, 1000, 219000, 4),
  ('A102', 'Room of 4', 'Block A', 4, 180000, 28000, 10000, 1000, 219000, 4),
  ('A103', 'Room of 4', 'Block A', 4, 180000, 28000, 10000, 1000, 219000, 4),
  ('A104', 'Room of 4', 'Block A', 4, 180000, 28000, 10000, 1000, 219000, 4),
  ('A105', 'Room of 4', 'Block A', 4, 180000, 28000, 10000, 1000, 219000, 4);

-- Rooms in Block B (Room of 6)
INSERT INTO rooms (room_number, room_type, block, capacity, hostel_fee, utility_fee, caution_fee, form_fee, total_price, spaces_available)
VALUES
  ('B101', 'Room of 6', 'Block B', 6, 180000, 28000, 10000, 1000, 219000, 6),
  ('B102', 'Room of 6', 'Block B', 6, 180000, 28000, 10000, 1000, 219000, 6),
  ('B103', 'Room of 6', 'Block B', 6, 180000, 28000, 10000, 1000, 219000, 6),
  ('B104', 'Room of 6', 'Block B', 6, 180000, 28000, 10000, 1000, 219000, 6),
  ('B105', 'Room of 6', 'Block B', 6, 180000, 28000, 10000, 1000, 219000, 6);

-- Seed a sample paid user for testing
-- First create a test user
INSERT INTO users (
  id, full_name, email, phone_number, matric_number, level, faculty, 
  department, programme, date_of_birth, state_of_origin, marital_status,
  home_address, city
) VALUES (
  'c0a80121-7ac0-4e1c-9ab5-9f5090ce4a42',
  'Test Student',
  'test.student@example.com',
  '08012345678',
  'ABC/12345',
  '300',
  'Engineering',
  'Computer Science',
  'B.Sc Computer Science',
  '1998-05-15',
  'Lagos',
  'Single',
  '123 Test Street',
  'Lagos'
);

-- Then create a completed payment for this user
INSERT INTO payments (
  reference_number, order_id, matric_number, student_name, email, 
  phone_number, amount, payment_type, payment_status, payment_date, 
  academic_year, transaction_id, user_id
) VALUES (
  '290019681818',
  'ORD-TEST-12345',
  'ABC/12345',
  'Test Student',
  'test.student@example.com',
  '08012345678',
  219000,
  'FULL',
  'COMPLETED',
  NOW(),
  '2023/2024',
  'TXN-12345-67890',
  'c0a80121-7ac0-4e1c-9ab5-9f5090ce4a42'
);

-- Create index for room searches
CREATE INDEX IF NOT EXISTS rooms_search_idx ON rooms (room_type, block, spaces_available);

-- Create RLS (Row Level Security) policies
-- These policies control who can access which rows in your tables
-- They're a Supabase-specific feature for database security

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE next_of_kin ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE guarantors ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view their own next of kin" ON next_of_kin
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own security info" ON security_info
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own guarantor" ON guarantors
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view all rooms" ON rooms
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can view their own room assignments" ON room_assignments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- Policies for service roles (admin operations)
-- These will be used by our API endpoints 