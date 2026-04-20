/**
 * Dynamic Property Loader for homes-for-rent/index.html
 * Loads property by ?propertyId=UUID from Supabase 'properties' table
 * Updates title, price, specs, images, desc, amenities, maps
 * Fallback to hardcoded Stephanie Dr property if no param or fetch fails
 */

import { supabase } from './supabase-config.js';

const FALLBACK_PROPERTY = {
  id: 'fallback-stephanie',
  title: '5266 Ridge Forest Dr Unit A Stone Mountain GA 30083 Single Family Home for Rent',
  address: '5266 Ridge Forest Dr Unit A, Stone Mountain, GA 30083',
  price: '$1,745',
  beds: '2',
  baths: '2',
  sqft: '1042',
  images: [
    'https://firstkeyhomess3prd.s3.amazonaws.com/property-images/homes/STO07668/3f2d2e6d-1e1e-4b2a-a2d0-9f50a5d7e2a5.jpg?w=800',
    // Add more from static page...
  ],
  description: 'Sample description...',
  amenities: ['Air Conditioning', 'Dishwasher', 'Parking', 'Pets Allowed'],
  lat: 33.804, lng: -84.170 // Approx Stone Mountain
};

// Dynamic selectors (update these after inspecting static HTML)
const selectors = {
  title: 'title, .property-title', // Update
  price: '.price',
  specs: '.beds, .baths, .sqft',
  images: '.image-carousel img',
  description: '.description',
  amenities: '.amenities-list',
  map: '#map-canvas' // Google Maps
};

async function loadProperty(id) {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Property not found');

    return data;
  } catch (err) {
    console.warn('DB fetch failed:', err);
    return null;
  }
}

function updatePage(property) {
  // Title
  document.title = property.title;
  document.querySelectorAll(selectors.title).forEach(el => el.textContent = property.title);

  // Price
  document.querySelectorAll(selectors.price).forEach(el => el.textContent = property.price);

  // Images - assumes first image src pattern
  const imgUrls = property.images || [];
  document.querySelectorAll(selectors.images).forEach((img, i) => {
    if (imgUrls[i]) {
      img.src = supabase.storage.from('property-images').getPublicUrl(imgUrls[i]).data.publicUrl;
    }
  });

  // Populate other sections similarly...
  // Description, amenities, etc.

  // Update Google Maps
  if (window.google && property.address) {
    geocodeAndUpdateMap(property.address);
  }
}

function geocodeAndUpdateMap(address) {
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address }, (results, status) => {
    if (status === 'OK' && results[0]) {
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: results[0].geometry.location
      });
      new google.maps.Marker({
        map,
        position: results[0].geometry.location
      });
    }
  });
}

async function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const propertyId = urlParams.get('propertyId');

  let property = FALLBACK_PROPERTY;

  if (propertyId && propertyId !== 'fallback-stephanie') {
    property = await loadProperty(propertyId);
  }

  if (!property) {
    property = FALLBACK_PROPERTY;
  }

  updatePage(property);
}

// Wait for DOM + Google Maps
document.addEventListener('DOMContentLoaded', () => {
  if (window.google && window.google.maps) {
    init();
  } else {
    // Wait for Google Maps
    window.addEventListener('load', init);
  }
});

