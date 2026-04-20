CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address TEXT NOT NULL,
  price INTEGER,
  beds INTEGER CHECK (beds >= 0),
  baths INTEGER CHECK (baths >= 0),
  sqft INTEGER CHECK (sqft >= 0),
  description TEXT,
  amenities JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_properties_address ON properties(address);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_beds ON properties(beds);

-- Enable RLS (Row Level Security)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Policy for public read access (adjust as needed)
CREATE POLICY "Public read access" ON properties
FOR SELECT USING (true);

-- Storage bucket note: Create 'properties' bucket in Supabase Storage for images
-- Upload paths: {property_id}/{timestamp}_{filename}

COMMENT ON TABLE properties IS 'Rental properties for FirstKey Homes - uploaded via homes-for-rent/upload-property.html';

