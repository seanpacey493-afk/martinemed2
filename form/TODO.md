# Form Validation, Conditional Fields, and Brevo Email Implementation
## Status: Approved - In Progress [1/7]

**Approved Plan Summary:**
- Fix date fields (DOB, ResidencyFrom, EmployedSince → Flatpickr)
- Screening dropdowns: Yes → show hidden fields
- Required field validation before submit
- Brevo API HTML email on submit (placeholder keys)

**Implementation Steps:**

### 1. Date Field Enhancement [IN PROGRESS]
- [x] Create this TODO.md
- [ ] Update form/form.js: Expand selectors (`.date-field, [type="date"], .isdate, .birthdatevalidation, .maskdate`)
- [ ] Test DOB, ResidencyFrom, PrefMoveinDate pickers work

### 2. Form Validation
- [ ] form/form.js: Custom validation (required*, email, phone, DOB age>18)
- [ ] Visual feedback (red borders, messages)
- [ ] Prevent submit if invalid

### 3. Screening Dropdown Conditionals
- [ ] Scan form for "screening" selects w/ Yes/No + hidden fields
- [ ] JS change listeners: value=="Yes" → show next .hidden fields
- [ ] Reverse: "No" → hide

### 4. Brevo Integration
- [ ] form/form.js: Intercept form submit
- [ ] Collect all form data → HTML table template
- [ ] fetch POST to Brevo /v3/smtp/email w/ placeholders:
  ```
  const BREVO_API_KEY = 'YOUR_API_KEY_HERE';
  const BREVO_SENDER_ID = 'YOUR_SENDER_ID_HERE';
  ```

### 5. HTML Improvements
- [ ] form/index.html: Add `required` attrs to * fields, `novalidate` to form
- [ ] Ensure date fields have proper classes/IDs

### 6. Testing
- [ ] `npx live-server form/` → no console errors
- [ ] Fill form → dates pick, validation blocks submit, dropdowns toggle
- [ ] Submit → Brevo fetch (console.log response)

### 7. Completion
- [ ] Update progress → attempt_completion

**Next Step:** Enhance form/form.js date selectors
**Current File State:** form.js has Flatpickr for .date-field only (misses DOB/ResidencyFrom classes)

