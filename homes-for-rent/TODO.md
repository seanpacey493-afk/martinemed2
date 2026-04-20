# Task Progress: Centralize Property Content Updates & Gallery Popup

## Approved Plan Summary
- **ONLY edit homes-for-rent/index.html**
- Extract static page content → defaultProperty object matching updatePropertyContent(data)
- Make updatePropertyContent the sole updater (loading → DB/random → default → update & hide loading)
- Add stylish popup for "See all pictures" button using data.images (custom JS/CSS lightbox)

## Breakdown Steps (sequential)

### ✅ Step 1: Create this TODO.md [COMPLETE]

### ✅ Step 2: Analyze & Extract Static Data [COMPLETE - Partial Data]
**Extracted defaultProperty from HTML analysis:**

```js
const defaultProperty = {
  price: 1496.00,  // from <span class="price">$1496.00</span>
  sqft: 1042,  // assumed from fallback/dynamic-loader.js Stephanie Dr (confirm selector)
  title: '5266 Ridge Forest Dr Unit A Stone Mountain GA 30083 Single Family Home for Rent',  // <title>
  images: [],  // 19 URLs not extracted (lazy/dynamic src not in regex - will collect/update in Step 4)
  amenities: [  // from .Standard-Amenities .standard-amenities-items spans
    'Unmatched resident experience',
    'Telephone',
    'Professional maintenance services',
    'Resident services',
    'Convenient Payment Options',
    'Utilities Managed for You',
    'Home Services Deals & Discounts',
    // +more
  ]
};
```
- Known selectors: priceEl (`.price`), sqftEl (specific #download-image path), mainImage img.
- Loading: showLoading()/hideLoading() exist, Supabase fetch, randomData from localStorage if no propertyId.
- Gallery button: .gallery-image-main-all a[name="see_all"]
- Beds/Baths/Sqft numbers not text-matched (likely icons/JS set) - use known price/title.

### ✅ Step 3: Centralize Loading Flow [PENDING - Code Ready]
- Update init(): showLoading() → if propertyId fetch DB → else randomData || defaultProperty → updatePropertyContent(data) → hideLoading()

### ⬜ Step 4: Enhance updatePropertyContent + Images
- Add logic for all fields.
- Collect/set data.images from static gallery imgs.

### ⬜ Step 5: Add Gallery Popup (Custom Lightbox)
- JS: document.querySelector('.gallery-image-main-all a').onclick = showGalleryModal(data.images)
- CSS/HTML: Overlay + thumbs/carousel + fullscreen.

### ⬜ Step 6: Update Button & Test

### ⬜ Step 7: attempt_completion

**Next Tool Call: Step 3 - Edit index.html to add defaultProperty & update init flow.**


