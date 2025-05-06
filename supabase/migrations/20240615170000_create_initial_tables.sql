-- Create users table to store user profiles
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create food_items table to store scanned and manually added food items
CREATE TABLE IF NOT EXISTS food_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  barcode TEXT,
  image_url TEXT,
  calories INTEGER,
  protein DECIMAL,
  carbs DECIMAL,
  fat DECIMAL,
  fiber DECIMAL,
  sugar DECIMAL,
  sodium DECIMAL,
  ingredients TEXT,
  allergens TEXT[],
  overall_score INTEGER,
  nutrition_score INTEGER,
  processing_score INTEGER,
  environmental_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create journal_entries table to store food journal entries
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  food_item_id UUID REFERENCES food_items(id) ON DELETE CASCADE,
  meal_type TEXT NOT NULL, -- 'breakfast', 'lunch', 'dinner', 'snack'
  serving_size DECIMAL,
  serving_unit TEXT,
  consumed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create meal_plans table for future meal planning feature
CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create meal_plan_items to store items in meal plans
CREATE TABLE IF NOT EXISTS meal_plan_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
  food_item_id UUID REFERENCES food_items(id) ON DELETE CASCADE,
  meal_type TEXT NOT NULL,
  day_of_week INTEGER NOT NULL, -- 0-6 for Sunday-Saturday
  serving_size DECIMAL,
  serving_unit TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create user_preferences table for storing user dietary preferences and settings
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
  dietary_preferences TEXT[],
  allergens TEXT[],
  health_goals TEXT[],
  daily_calorie_target INTEGER,
  macros_protein_pct INTEGER,
  macros_carbs_pct INTEGER,
  macros_fat_pct INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can only read/write their own data
CREATE POLICY "Users can view own profile" 
ON users FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON users FOR UPDATE 
USING (auth.uid() = id);

-- Food items policies
CREATE POLICY "Users can view own food items" 
ON food_items FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own food items" 
ON food_items FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own food items" 
ON food_items FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own food items" 
ON food_items FOR DELETE 
USING (auth.uid() = user_id);

-- Journal entries policies
CREATE POLICY "Users can view own journal entries" 
ON journal_entries FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries" 
ON journal_entries FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries" 
ON journal_entries FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries" 
ON journal_entries FOR DELETE 
USING (auth.uid() = user_id);

-- Enable realtime subscriptions
alter publication supabase_realtime add table users;
alter publication supabase_realtime add table food_items;
alter publication supabase_realtime add table journal_entries;
alter publication supabase_realtime add table meal_plans;
alter publication supabase_realtime add table meal_plan_items;
alter publication supabase_realtime add table user_preferences;
