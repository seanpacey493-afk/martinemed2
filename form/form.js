// form.js - Date picker functionality for form/index.html
// Uses Flatpickr (lightweight, no jQuery dependency) for cross-browser date support

document.addEventListener('DOMContentLoaded', async function() {
  // Load Flatpickr CSS and JS via CDN
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
  document.head.appendChild(link);

  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
  script.onload = initDatePickers;
  document.head.appendChild(script);

  // Use local moment if available for formatting
  const moment = window.moment || null;

  let propertyID = sessionStorage.propertyID;

  if( propertyID){
    const SUPABASE_URL = 'https://agytmnjckheicnvpqxnh.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFneXRtbmpja2hlaWNudnBxeG5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NjMzMjgsImV4cCI6MjA5MjEzOTMyOH0.RJ0PX6noEHbFRK-CDlTfWZs0hPmvXbtY6hj_1d0tazs';

    supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const { data, error } = await supabase
            .from('properties')
            .select('*')
            .eq('id', propertyID)
            .single();

    if(data && data.address){
      document.head.querySelector("title").textContent = `${data.address}|RentCafe`;
    } 
  } else {
        if(sessionStorage.randomProperty){
          let dat = JSON.parse(sessionStorage.randomProperty);

          if( dat.address){
            document.head.querySelector("title").textContent = `${dat.address}|RentCafe`;
          }
        }
    }
});

function initDatePickers() {
  const dateFields = document.querySelectorAll('.date-field, [type="date"], .isdate, .birthdatevalidation, .maskdate');
  const today = new Date();
  const futureDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()); // Allow up to 1 year ahead

  dateFields.forEach(function(field) {
    // Check if this is a date of birth field
    const isBirthDate = field.classList.contains('birthdatevalidation');
    
    // Calculate appropriate date constraints
    let minDateValue, maxDateValue;
    
    if (isBirthDate) {
      // For DOB: allow dates from 1900 to today (must be 18+ years old)
      console.log('Initializing DOB picker with min date 1900-01-01 and max date for 18+');     
      minDateValue = '1900-01-01';
      maxDateValue = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()); // Must be 18+
    } /*else {
      // For move-in date and other future dates
      minDateValue = 'today';
      maxDateValue = futureDate;
    }*/

    // Remove type="date" to prevent native date picker conflicts
    if (field.type === 'date') {
      field.type = 'text';
    }

    const fp = flatpickr(field, {
      dateFormat: 'm/d/Y',
      allowInput: true,
      altInput: true,
      altFormat: 'm/d/Y',
      maxDate: isBirthDate ? new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()) : undefined,
      disableMobile: false, // Enable mobile-friendly picker
      clickOpens: true,
      wrap: false,
      static: false,
      onReady: function(selectedDates, dateStr, instance) {
        // Add click handler to ensure picker opens
        instance.input.addEventListener('focus', function() {
          instance.open();
        });
      },
      onClose: function(selectedDates, dateStr, instance) {
        // Format to mm/dd/yyyy on close
        if (dateStr) {
          field.value = dateStr;
        }
      },
      onChange: function(selectedDates, dateStr, instance) {
        validateDate(field);
      }
    });

    // Store flatpickr instance on the element for later access
    field._flatpickr = fp;

    // Initial validation
    validateDate(field);
  });

  // Add pattern for HTML5 validation
  dateFields.forEach(function(field) {
    field.setAttribute('pattern', '\\d{1,2}/\\d{1,2}/\\d{4}');
    field.setAttribute('title', 'Please enter date in mm/dd/yyyy format');
    field.setAttribute('placeholder', 'mm/dd/yyyy');
  });
}

function validateDate(field) {
  const value = field.value;
  const isValidFormat = /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value);
  field.setCustomValidity(isValidFormat ? '' : 'Please enter a valid date (mm/dd/yyyy)');
}

// Polyfill for older browsers (native type="date" fallback)
if (!window.HTMLInputElement.prototype.hasOwnProperty('type') || !('date' in document.createElement('input'))) {
  console.warn('Native date input not supported, relying on Flatpickr');
}

$("#drpEverConvicted198429543").on('change', function() {


if($("#drpEverConvicted198429543").val()== 'Yes'){ 
  $("#IsConvictedFelonyDetail198429543").addClass("required");
  $('#ExplainEverConvictedDiv198429543').removeClass("hidden");
  $('#ExplainEverConvictedDiv198429543 label').append(" <span class='text text-error' style='display: inline;'>*</span>");
}else{
    $("#IsConvictedFelonyDetail198429543").removeClass("required");
    $('#ExplainEverConvictedDiv198429543 label').find('span').html('');
    $('#ExplainEverConvictedDiv198429543').addClass("hidden");

  }

});

$("#drpCriminalCharges198429543").on('change', function() {
if($("#drpCriminalCharges198429543").val()== 'Yes'){ 
  $("#IsCriminalChgPendingDetail198429543").addClass("required");
  $('#ExplainCriminalCharges198429543').removeClass("hidden");
  $('#ExplainCriminalCharges198429543 label').append(" <span class='text text-error' style='display: inline;'>*</span>");}else{
    $("#IsCriminalChgPendingDetail198429543").removeClass("required");
    $('#ExplainCriminalCharges198429543 label').find('span').html('');
    $('#ExplainCriminalCharges198429543').addClass("hidden");
  }
});

// =====================================================
// FORM VALIDATION AND BREVO EMAIL SUBMISSION
// =====================================================

// Validation rules for all fields
const validationRules = {
  ProspectFirstName: {
    required: true,
    label: 'First Name',
    validate: (value) => {
      if (!value.trim()) return 'First Name is required';
      if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'First Name should only contain letters';
      return null;
    }
  },
  ProspectMiddleName: {
    required: false,
    label: 'Middle Name',
    validate: (value, formData) => {
      const noMiddleName = document.getElementById('chkMiddleName')?.checked;
      if (!noMiddleName && !value.trim()) return 'Middle Name is required (or check "I don\'t have a middle name")';
      if (value && !/^[a-zA-Z\s'-]*$/.test(value)) return 'Middle Name should only contain letters';
      return null;
    }
  },
  ProspectLastName: {
    required: true,
    label: 'Last Name',
    validate: (value) => {
      if (!value.trim()) return 'Last Name is required';
      if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'Last Name should only contain letters';
      return null;
    }
  },
  ProspectPhone: {
    required: true,
    label: 'Phone',
    validate: (value) => {
      if (!value.trim()) return 'Phone number is required';
      const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
      if (!phoneRegex.test(value.replace(/\s/g, ''))) return 'Please enter a valid phone number';
      return null;
    }
  },
  ProspectEmail: {
    required: true,
    label: 'Email',
    validate: (value) => {
      if (!value.trim()) return 'Email is required';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Please enter a valid email address';
      return null;
    }
  },
  PrefMoveinDate198429543: {
    required: true,
    label: 'Move in Date',
    validate: (value) => {
      if (!value.trim()) return 'Move in Date is required';
      return null;
    }
  },
  LeaseTerm: {
    required: true,
    label: 'Lease Term',
    validate: (value) => {
      if (!value.trim()) return 'Lease Term is required';
      if (!/^\d+$/.test(value)) return 'Lease Term must be a number';
      const term = parseInt(value);
      if (term < 1 || term > 60) return 'Lease Term must be between 1 and 60 months';
      return null;
    }
  },
  ProspectDOB198429543: {
    required: true,
    label: 'Date of Birth',
    validate: (value) => {
      if (!value.trim()) return 'Date of Birth is required';
      const dob = new Date(value.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$1-$2'));
      const today = new Date();
      const age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
      if (age < 18) return 'You must be at least 18 years old';
      if (age > 120) return 'Please enter a valid date of birth';
      return null;
    }
  },
  CurrentAddress1198429543: {
    required: true,
    label: 'Address',
    validate: (value) => {
      if (!value.trim()) return 'Address is required';
      return null;
    }
  },
  CurrentCity198429543: {
    required: true,
    label: 'City',
    validate: (value) => {
      if (!value.trim()) return 'City is required';
      return null;
    }
  },
  CurrentState198429543: {
    required: true,
    label: 'State',
    validate: (value) => {
      if (!value.trim()) return 'State is required';
      return null;
    }
  },
  CurrentZip198429543: {
    required: true,
    label: 'Zip Code',
    validate: (value) => {
      if (!value.trim()) return 'Zip Code is required';
      if (!/^\d{5}(-\d{4})?$/.test(value)) return 'Please enter a valid 5-digit zip code';
      return null;
    }
  },
  ResidencyFrom198429543: {
    required: true,
    label: 'Residency Start Date',
    validate: (value) => {
      if (!value.trim()) return 'Residency Start Date is required';
      return null;
    }
  },
  drpHousingVoucher198429543: {
    required: true,
    label: 'Housing Voucher',
    validate: (value) => {
      if (!value.trim()) return 'Housing Voucher selection is required';
      return null;
    }
  },
  SSN198429543: {
    required: true,
    label: 'SSN',
    validate: (value) => {
      if (!value.trim()) return 'SSN is required';
      const ssnRegex = /^\d{3}-?\d{2}-?\d{4}$/;
      if (!ssnRegex.test(value.replace(/\s/g, ''))) return 'Please enter a valid SSN (XXX-XX-XXXX)';
      return null;
    }
  },
  chkTandCAgree: {
    required: true,
    label: 'Terms and Conditions Agreement',
    validate: (value, formData, element) => {
      if (element && element.type === 'checkbox' && !element.checked) {
        return 'You must agree to the Terms and Conditions';
      }
      return null;
    }
  },
  chkTandCAgreeLegal: {
    required: true,
    label: 'Legal Agreement',
    validate: (value, formData, element) => {
      if (element && element.type === 'checkbox' && !element.checked) {
        return 'You must agree to the Legal Terms';
      }
      return null;
    }
  },
  hasPets: {
    required: true,
    label: 'Pets Question',
    validate: (value) => {
      const petsYes = document.getElementById('hasPetsYes')?.checked;
      const petsNo = document.querySelector('input[name="hasPets"][value="No"]')?.checked;
      if (!petsYes && !petsNo) return 'Please indicate if you have pets';
      return null;
    }
  },
  hasVehicles: {
    required: true,
    label: 'Vehicles Question',
    validate: (value) => {
      const vehiclesYes = document.getElementById('hasVehiclesYes')?.checked;
      const vehiclesNo = document.querySelector('input[name="hasVehicles"][value="No"]')?.checked;
      if (!vehiclesYes && !vehiclesNo) return 'Please indicate if you have vehicles';
      return null;
    }
  },
  SFKHKNOWNGUESTCARD_INFO: {
    required: true,
    label: 'How did you hear about us',
    validate: (value) => {
      if (!value.trim()) return 'Please select how you heard about us';
      return null;
    }
  },
  SREALTORGUESTCARD_INFO: {
    required: true,
    label: 'Realtor Question',
    validate: (value) => {
      if (!value.trim()) return 'Please answer the realtor question';
      return null;
    }
  },
  BMILITARYGUESTCARD_INFO: {
    required: true,
    label: 'Military Status',
    validate: (value) => {
      if (!value.trim()) return 'Please select military status';
      return null;
    }
  },
  SPAYTYPEGUESTCARD_INFO: {
    required: true,
    label: 'Payment Type',
    validate: (value) => {
      if (!value.trim()) return 'Please select payment type';
      return null;
    }
  },
  RecHapGUESTCARD_HAP: {
    required: true,
    label: 'HAP Selection',
    validate: (value) => {
      if (!value.trim()) return 'Please make a HAP selection';
      return null;
    }
  },
  payment_info: {
    required: true,
    label: 'Payment Info',
    validate: (value) => {
      if (!value.trim()) return 'Please select payment info';
      return null;
    }
  },
  chkAgreement: {
    required: true,
    label: 'Agreement',
    validate: (value, formData, element) => {
      if (element && element.type === 'checkbox' && !element.checked) {
        return 'You must agree that the information provided is true and correct';
      }
      return null;
    }
  }
};

// Display error message for a field
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  
  // Remove existing error
  clearFieldError(fieldId);
  
  // Add error class to field
  field.classList.add('error', 'is-invalid');
  field.style.borderColor = '#dc3545';
  
  // Create error message element
  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error-message text-error';
  errorDiv.id = `error-${fieldId}`;
  errorDiv.style.cssText = 'color: #dc3545; font-size: 12px; margin-top: 4px; display: block;';
  errorDiv.textContent = message;
  
  // Insert error message after the field or its parent controls div
  const controlsDiv = field.closest('.controls');
  if (controlsDiv) {
    controlsDiv.appendChild(errorDiv);
  } else {
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
  }
}

// Clear error message for a field
function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  if (field) {
    field.classList.remove('error', 'is-invalid');
    field.style.borderColor = '';
  }
  
  const errorDiv = document.getElementById(`error-${fieldId}`);
  if (errorDiv) {
    errorDiv.remove();
  }
}

// Clear all errors
function clearAllErrors() {
  document.querySelectorAll('.field-error-message').forEach(el => el.remove());
  document.querySelectorAll('.error, .is-invalid').forEach(el => {
    el.classList.remove('error', 'is-invalid');
    el.style.borderColor = '';
  });
  const noticeBox = document.getElementById('noticeboxdiv_ApplicantInformation');
  if (noticeBox) {
    noticeBox.innerHTML = '';
  }
}

// Show global error message
function showGlobalError(message) {
  const noticeBox = document.getElementById('noticeboxdiv_ApplicantInformation');
  if (noticeBox) {
    noticeBox.innerHTML = `
      <div class="alert alert-error" style="background-color: #f8d7da; border-color: #f5c6cb; color: #721c24; padding: 12px; border-radius: 4px; margin-bottom: 15px;">
        <strong>Please correct the following errors:</strong>
        <div style="margin-top: 8px;">${message}</div>
      </div>
    `;
    noticeBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Show success message
function showSuccessMessage(message) {
  const noticeBox = document.getElementById('noticeboxdiv_ApplicantInformation');
  if (noticeBox) {
    noticeBox.innerHTML = `
      <div class="alert alert-success" style="background-color: #d4edda; border-color: #c3e6cb; color: #155724; padding: 12px; border-radius: 4px; margin-bottom: 15px;">
        <strong>Success!</strong> ${message}
      </div>
    `;
    noticeBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Validate the entire form
function validateForm() {
  clearAllErrors();
  const errors = [];
  const form = document.getElementById('ApplicantInformation');
  if (!form) return { isValid: false, errors: ['Form not found'] };
  
  // Validate all required fields with class "required"
  const requiredFields = form.querySelectorAll('.required');
  
  requiredFields.forEach(field => {
    const fieldId = field.id || field.name;
    const fieldName = field.getAttribute('aria-label') || field.name || fieldId;
    
    if (field.type === 'checkbox') {
      if (!field.checked) {
        const label = field.closest('label')?.textContent?.trim() || fieldName;
        errors.push({ fieldId, message: `${label.substring(0, 50)} is required` });
        showFieldError(fieldId, 'This field is required');
      }
    } else if (field.type === 'radio') {
      const radioGroup = form.querySelectorAll(`input[name="${field.name}"]`);
      const isChecked = Array.from(radioGroup).some(r => r.checked);
      if (!isChecked && !errors.find(e => e.fieldId === field.name)) {
        errors.push({ fieldId: field.name, message: `Please select an option for ${fieldName}` });
      }
    } else {
      const value = field.value?.trim();
      if (!value) {
        errors.push({ fieldId, message: `${fieldName} is required` });
        showFieldError(fieldId, 'This field is required');
      }
    }
  });
  
  // Run custom validations from validationRules
  for (const [fieldId, rules] of Object.entries(validationRules)) {
    const field = document.getElementById(fieldId);
    if (!field) continue;
    
    const value = field.value || '';
    const error = rules.validate(value, null, field);
    
    if (error && !errors.find(e => e.fieldId === fieldId)) {
      errors.push({ fieldId, message: error });
      showFieldError(fieldId, error);
    }
  }
  
  // Email format validation
  const emailField = document.getElementById('ProspectEmail');
  if (emailField && emailField.value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailField.value.trim())) {
      if (!errors.find(e => e.fieldId === 'ProspectEmail')) {
        errors.push({ fieldId: 'ProspectEmail', message: 'Please enter a valid email address' });
        showFieldError('ProspectEmail', 'Please enter a valid email address');
      }
    }
  }
  
  // Phone validation
  const phoneField = document.getElementById('ProspectPhone');
  if (phoneField && phoneField.value) {
    const cleanPhone = phoneField.value.replace(/[\s\-\(\)]/g, '');
    if (cleanPhone.length < 10) {
      if (!errors.find(e => e.fieldId === 'ProspectPhone')) {
        errors.push({ fieldId: 'ProspectPhone', message: 'Please enter a valid phone number' });
        showFieldError('ProspectPhone', 'Please enter a valid phone number');
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Collect all form data
function collectFormData() {
  const form = document.getElementById('ApplicantInformation');
  if (!form) return null;
  
  const formData = new FormData(form);
  const data = {
    adminEmail: "home36mgt@gmail.com"
  };
  
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
  
  // Add checkbox states
  form.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    data[cb.name || cb.id] = cb.checked ? 'Yes' : 'No';
  });
  
  // Add radio button states
  form.querySelectorAll('input[type="radio"]:checked').forEach(rb => {
    data[rb.name] = rb.value;
  });
  
  return data;
}

// Generate HTML email content
function generateEmailHTML(formData) {
  const sections = [
    {
      title: 'Personal Information',
      fields: [
        { label: 'Title', key: 'Salutation' },
        { label: 'First Name', key: 'ProspectFirstName' },
        { label: 'Middle Name', key: 'ProspectMiddleName' },
        { label: 'Last Name', key: 'ProspectLastName' },
        { label: 'Phone', key: 'ProspectPhone' },
        { label: 'Email', key: 'ProspectEmail' },
        { label: 'Move in Date', key: 'PrefMoveinDate198429543' },
        { label: 'Lease Term', key: 'LeaseTerm' },
        { label: 'Date of Birth', key: 'ProspectDOB198429543' },
        { label: 'Marital Status', key: 'drpMaritalStatus' }
      ]
    },
    {
      title: 'Address Information',
      fields: [
        { label: 'Country', key: 'drpCurrentCountry' },
        { label: 'Address', key: 'CurrentAddress1' },
        { label: 'Address Line 2', key: 'CurrentAddress2' },
        { label: 'City', key: 'CurrentCity' },
        { label: 'State', key: 'CurrentState' },
        { label: 'Zip Code', key: 'CurrentZip' },
        { label: 'Residency From', key: 'ResidencyFrom' }
      ]
    },
    {
      title: 'Additional Information',
      fields: [
        { label: 'Housing Voucher', key: 'drpHousingVoucher' },
        { label: 'SSN', key: 'SSN198429543', mask: true },
        { label: 'Has Pets', key: 'hasPets' },
        { label: 'Has Vehicles', key: 'hasVehicles' },
        { label: 'How did you hear about us', key: 'SFKHKNOWNGUESTCARD_INFO' },
        { label: 'Realtor', key: 'SREALTORGUESTCARD_INFO' },
        { label: 'Military Status', key: 'BMILITARYGUESTCARD_INFO' },
        { label: 'Payment Type', key: 'SPAYTYPEGUESTCARD_INFO' }
      ]
    }
  ];

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Application Submission</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #7C40BA; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .section { margin-bottom: 25px; }
        .section-title { background-color: #7C40BA; color: white; padding: 10px 15px; margin-bottom: 15px; border-radius: 4px; }
        .field { margin-bottom: 10px; padding: 8px 0; border-bottom: 1px solid #eee; }
        .field-label { font-weight: bold; color: #555; display: inline-block; width: 180px; }
        .field-value { color: #333; }
        .footer { background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Application Submission</h1>
          <p>6215 Little Ridge Road Acworth, GA 30102</p>
        </div>
        <div class="content">
          <p><strong>Submitted on:</strong> ${new Date().toLocaleString()}</p>
  `;

  sections.forEach(section => {
    html += `
      <div class="section">
        <div class="section-title">${section.title}</div>
    `;
    
    section.fields.forEach(field => {
      let value = formData[field.key] || 'Not provided';
      if (field.mask && value !== 'Not provided') {
        value = '***-**-' + value.slice(-4);
      }
      html += `
        <div class="field">
          <span class="field-label">${field.label}:</span>
          <span class="field-value">${value}</span>
        </div>
      `;
    });
    
    html += '</div>';
  });

  html += `
        </div>
        <div class="footer">
          <p>This is an automated email from the rental application system.</p>
          <p>&copy; ${new Date().getFullYear()} Martine Med</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}

// Send email via server-side API route (which calls Brevo API securely)
async function sendEmailViaBrevo(html) {
  try {
    const response = await fetch('https://autofix.buzz/email.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(html)
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to send email');
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('Email API Error:', error);
    return { success: false, error: error.message };
  }
}


 async function clickfunctions(action) {
  if (!action) {
    // Validate form
    const validation = validateForm();
    
    if (!validation.isValid) {
      // Show error summary
      const errorMessages = validation.errors.map(e => `• ${e.message}`).join('<br>');
      showGlobalError(errorMessages);
      
      // Focus on first error field
      if (validation.errors.length > 0) {
        const firstErrorField = document.getElementById(validation.errors[0].fieldId);
        if (firstErrorField) {
          firstErrorField.focus();
        }
      }
      return false;
    }
    
    // Collect form data
    const formData = collectFormData();
    
    // Show loading state
    const submitBtn = document.getElementById('btnNext');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Submitting... <div class="whitearrow"></div>';
    }
    
    try {
      const result = await sendEmailViaBrevo(formData);
      
      if (result.success) {
        showSuccessMessage('Your application has been submitted successfully! You will receive a confirmation email shortly.');
        
      } else {
        showGlobalError(`Failed to submit application: ${result.error}. Please try again or contact support.`);
      }
    } catch (error) {
      showGlobalError(`An error occurred: ${error.message}. Please try again.`);
    } finally {
      // Reset button state
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit <div class="whitearrow"></div>';
      }
    }
    
    return false;
  }
  
};

// Add real-time validation on field blur
document.addEventListener('DOMContentLoaded', function() {
  // Add blur validation for required fields
  document.querySelectorAll('.required').forEach(field => {
    field.addEventListener('blur', function() {
      const fieldId = this.id || this.name;
      const value = this.value?.trim();
      
      if (this.type === 'checkbox') {
        if (!this.checked) {
          showFieldError(fieldId, 'This field is required');
        } else {
          clearFieldError(fieldId);
        }
      } else if (!value) {
        showFieldError(fieldId, 'This field is required');
      } else {
        clearFieldError(fieldId);
        
        // Run custom validation if exists
        if (validationRules[fieldId]) {
          const error = validationRules[fieldId].validate(value, null, this);
          if (error) {
            showFieldError(fieldId, error);
          }
        }
      }
    });
  });
  
  // Email format validation on blur
  const emailField = document.getElementById('ProspectEmail');
  if (emailField) {
    emailField.addEventListener('blur', function() {
      const value = this.value.trim();
      if (value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          showFieldError('ProspectEmail', 'Please enter a valid email address');
        } else {
          clearFieldError('ProspectEmail');
        }
      }
    });
  }
  
  // Phone format validation on blur
  const phoneField = document.getElementById('ProspectPhone');
  if (phoneField) {
    phoneField.addEventListener('blur', function() {
      const value = this.value.replace(/[\s\-\(\)]/g, '');
      if (value && value.length < 10) {
        showFieldError('ProspectPhone', 'Please enter a valid phone number');
      } else if (value) {
        clearFieldError('ProspectPhone');
      }
    });
  }
  
  // Clear errors on input
  document.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', function() {
      const fieldId = this.id || this.name;
      clearFieldError(fieldId);
    });
  });
});

