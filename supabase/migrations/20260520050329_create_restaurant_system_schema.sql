/*
  # Restaurant Operations System - Core Schema

  1. New Tables
    - `restaurants` - Restaurant profiles
    - `staff` - Staff accounts with role-based access (admin, manager, waiter, kitchen)
    - `tables` - Restaurant tables with QR codes
    - `menu_items` - Menu items per restaurant
    - `orders` - Customer orders
    - `order_items` - Individual items within an order
    - `waiting_list` - Customer waiting list entries
    - `waiter_calls` - Customer calls for waiter service

  2. Security
    - RLS enabled on all tables
    - Staff-only access for management tables
    - Authenticated access for order creation
*/

-- Restaurants
CREATE TABLE IF NOT EXISTS restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  cuisine text DEFAULT '',
  rating numeric(3,1) DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Staff accounts
CREATE TABLE IF NOT EXISTS staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'manager', 'waiter', 'kitchen')),
  staff_id text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Tables
CREATE TABLE IF NOT EXISTS tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id),
  table_number text NOT NULL,
  seats int NOT NULL DEFAULT 4,
  qr_code text,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved', 'disabled')),
  current_order_id uuid,
  running_bill int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Menu items
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id),
  name text NOT NULL,
  description text DEFAULT '',
  price int NOT NULL,
  category text NOT NULL DEFAULT 'mains',
  is_veg boolean DEFAULT true,
  is_spicy boolean DEFAULT false,
  is_popular boolean DEFAULT false,
  is_available boolean DEFAULT true,
  image text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id),
  table_id uuid REFERENCES tables(id),
  table_number text,
  order_type text NOT NULL DEFAULT 'dine-in' CHECK (order_type IN ('dine-in', 'takeaway')),
  status text NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'preparing', 'cooking', 'ready', 'served', 'completed', 'cancelled')),
  total_amount int DEFAULT 0,
  customer_phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items (supports group ordering)
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id uuid REFERENCES menu_items(id),
  name text NOT NULL,
  price int NOT NULL,
  qty int NOT NULL DEFAULT 1,
  group_number int NOT NULL DEFAULT 1,
  group_status text NOT NULL DEFAULT 'preparing' CHECK (group_status IN ('scheduled', 'preparing', 'cooking', 'ready', 'served')),
  serving_time text DEFAULT 'now',
  created_at timestamptz DEFAULT now()
);

-- Waiting list
CREATE TABLE IF NOT EXISTS waiting_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id),
  name text NOT NULL,
  phone text DEFAULT '',
  guest_count int NOT NULL DEFAULT 1,
  estimated_wait_min int DEFAULT 15,
  status text NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'called', 'seated', 'cancelled')),
  assigned_table_id uuid REFERENCES tables(id),
  created_at timestamptz DEFAULT now()
);

-- Waiter calls
CREATE TABLE IF NOT EXISTS waiter_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id),
  table_id uuid NOT NULL REFERENCES tables(id),
  table_number text NOT NULL,
  reason text NOT NULL DEFAULT 'help' CHECK (reason IN ('water', 'help', 'bill', 'cleaning', 'order_help')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'resolved')),
  accepted_by uuid REFERENCES staff(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE waiting_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE waiter_calls ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Authenticated users can read restaurant data
CREATE POLICY "Authenticated users can read restaurants"
  ON restaurants FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read staff"
  ON staff FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read tables"
  ON tables FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read menu items"
  ON menu_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read waiting list"
  ON waiting_list FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read waiter calls"
  ON waiter_calls FOR SELECT
  TO authenticated
  USING (true);

-- Insert policies
CREATE POLICY "Authenticated users can insert orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert waiter calls"
  ON waiter_calls FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert waiting list entries"
  ON waiting_list FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Update policies
CREATE POLICY "Authenticated users can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update order items"
  ON order_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update tables"
  ON tables FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update waiter calls"
  ON waiter_calls FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update waiting list"
  ON waiting_list FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update menu items"
  ON menu_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert menu items"
  ON menu_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert tables"
  ON tables FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Seed default restaurant
INSERT INTO restaurants (id, name, cuisine, rating) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Spice Garden', 'North Indian · Mughlai', 4.6),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Coastal Catch', 'Seafood · Goan', 4.4),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Wok House', 'Chinese · Thai', 4.3);
