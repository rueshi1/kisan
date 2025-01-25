/*
  # Initial Schema for KISAN AID

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `full_name` (text)
      - `created_at` (timestamp)
    - `crop_analyses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `image_url` (text)
      - `disease_prediction` (text)
      - `confidence_score` (float)
      - `expert_feedback` (text)
      - `created_at` (timestamp)
    - `sensor_data`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `sensor_type` (text)
      - `reading` (float)
      - `unit` (text)
      - `timestamp` (timestamp)
    - `expert_consultations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `expert_id` (uuid, foreign key)
      - `status` (text)
      - `created_at` (timestamp)
      
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Crop Analyses table
CREATE TABLE crop_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  image_url text NOT NULL,
  disease_prediction text,
  confidence_score float,
  expert_feedback text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE crop_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own analyses"
  ON crop_analyses
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Sensor Data table
CREATE TABLE sensor_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  sensor_type text NOT NULL,
  reading float NOT NULL,
  unit text NOT NULL,
  timestamp timestamptz DEFAULT now()
);

ALTER TABLE sensor_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own sensor data"
  ON sensor_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Expert Consultations table
CREATE TABLE expert_consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  expert_id uuid REFERENCES users(id),
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE expert_consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own consultations"
  ON expert_consultations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = expert_id);