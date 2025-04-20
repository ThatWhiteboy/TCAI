// Titan Cloud AI Platform Integration
(function() {
  // Configuration
  const PLATFORM_URL = 'https://app.titancloudai.com';
  const ANALYTICS_ENDPOINT = `${PLATFORM_URL}/api/analytics`;
  
  // Feature flags for A/B testing
  const features = {
    heroVariant: Math.random() > 0.5 ? 'A' : 'B',
    ctaStyle: Math.random() > 0.5 ? 'gradient' : 'solid',
    formLayout: Math.random() > 0.5 ? 'single' : 'multi'
  };

  // Initialize integration
  function initTitanIntegration() {
    attachFormHandlers();
    setupNavigationTracking();
    injectCustomStyles();
    initializeABTesting();
    setupDynamicContent();
    trackUserBehavior();
  }

  // Handle form submissions with enhanced validation and analytics
  function attachFormHandlers() {
    const forms = document.querySelectorAll('form[data-titan-form]');
    forms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm(form)) return;
        
        const formData = new FormData(form);
        const userData = Object.fromEntries(formData.entries());
        
        // Enrich user data with additional context
        const enrichedData = {
          ...userData,
          source: 'durable',
          timestamp: Date.now(),
          abTestVariant: features.heroVariant,
          referrer: document.referrer,
          deviceType: getDeviceType(),
          interactionHistory: getInteractionHistory()
        };
        
        // Track successful form submission
        await trackAnalytics('form_submission', {
          formType: form.dataset.titanForm,
          ...enrichedData
        });
        
        // Redirect to platform with enhanced data
        window.location.href = `${PLATFORM_URL}?ref=durable&data=${btoa(JSON.stringify(enrichedData))}`;
      });

      // Real-time form validation
      form.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('input', () => validateField(field));
      });
    });
  }

  // Enhanced form validation
  function validateForm(form) {
    let isValid = true;
    form.querySelectorAll('input, textarea').forEach(field => {
      if (!validateField(field)) isValid = false;
    });
    return isValid;
  }

  function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';

    switch (type) {
      case 'email':
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        errorMessage = 'Please enter a valid email address';
        break;
      case 'text':
        isValid = value.length >= 2;
        errorMessage = 'This field is required';
        break;
    }

    toggleFieldError(field, isValid ? '' : errorMessage);
    return isValid;
  }

  function toggleFieldError(field, message) {
    const errorElement = field.parentElement.querySelector('.field-error');
    if (message) {
      if (!errorElement) {
        const error = document.createElement('div');
        error.className = 'field-error text-red-400 text-sm mt-1';
        error.textContent = message;
        field.parentElement.appendChild(error);
      } else {
        errorElement.textContent = message;
      }
      field.classList.add('error');
    } else {
      if (errorElement) errorElement.remove();
      field.classList.remove('error');
    }
  }

  // Enhanced navigation tracking
  function setupNavigationTracking() {
    const platformLinks = document.querySelectorAll('a[href*="titancloudai.com"]');
    platformLinks.forEach(link => {
      link.addEventListener('click', async (e) => {
        const linkData = {
          source: 'durable_site',
          link_type: link.dataset.titanLink || 'general',
          link_text: link.textContent,
          link_location: getLinkLocation(link),
          user_segment: getUserSegment(),
          session_duration: getSessionDuration()
        };

        // Track click before navigation
        await trackAnalytics('platform_navigation', linkData);
      });
    });
  }

  // Dynamic content personalization
  function setupDynamicContent() {
    const userSegment = getUserSegment();
    const contentElements = document.querySelectorAll('[data-titan-content]');
    
    contentElements.forEach(element => {
      const contentType = element.dataset.titanContent;
      const content = getPersonalizedContent(contentType, userSegment);
      
      if (content) {
        element.innerHTML = content;
        trackAnalytics('content_personalization', {
          type: contentType,
          segment: userSegment,
          content_id: content.id
        });
      }
    });
  }

  // A/B Testing initialization
  function initializeABTesting() {
    document.documentElement.setAttribute('data-titan-variant', features.heroVariant);
    document.documentElement.setAttribute('data-cta-style', features.ctaStyle);
    document.documentElement.setAttribute('data-form-layout', features.formLayout);

    trackAnalytics('ab_test_assignment', {
      heroVariant: features.heroVariant,
      ctaStyle: features.ctaStyle,
      formLayout: features.formLayout
    });
  }

  // Enhanced user behavior tracking
  function trackUserBehavior() {
    let scrollDepth = 0;
    let startTime = Date.now();

    // Track scroll depth
    window.addEventListener('scroll', debounce(() => {
      const newScrollDepth = getScrollDepth();
      if (newScrollDepth > scrollDepth) {
        scrollDepth = newScrollDepth;
        trackAnalytics('scroll_depth', { depth: scrollDepth });
      }
    }, 500));

    // Track time on page
    window.addEventListener('beforeunload', () => {
      trackAnalytics('page_exit', {
        timeSpent: Date.now() - startTime,
        scrollDepth,
        interactions: getInteractionHistory()
      });
    });
  }

  // Utility functions
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function getDeviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  }

  function getScrollDepth() {
    const winHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset;
    return Math.round((scrollTop / (docHeight - winHeight)) * 100);
  }

  function getLinkLocation(link) {
    const rect = link.getBoundingClientRect();
    return {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }

  function getUserSegment() {
    // Implement user segmentation logic
    return 'default';
  }

  function getSessionDuration() {
    return Date.now() - performance.timing.navigationStart;
  }

  function getInteractionHistory() {
    // Implement interaction history tracking
    return [];
  }

  async function trackAnalytics(event, data) {
    try {
      await fetch(ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event,
          data,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTitanIntegration);
  } else {
    initTitanIntegration();
  }
})();