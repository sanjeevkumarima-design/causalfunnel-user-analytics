(function() {
  'use strict';

  const CONFIG = {
    API_ENDPOINT: 'http://localhost:5000/api/events',
    SESSION_STORAGE_KEY: 'causalfunnel_session_id',
    AUTO_TRACK: true
  };

  function getSessionId() {
    let sessionId = localStorage.getItem(CONFIG.SESSION_STORAGE_KEY);
    
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem(CONFIG.SESSION_STORAGE_KEY, sessionId);
    }
    
    return sessionId;
  }

  async function sendEvent(eventData) {
    try {
      const response = await fetch(CONFIG.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        console.error('Failed to send event:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending event:', error);
    }
  }

  function trackPageView() {
    const eventData = {
      session_id: getSessionId(),
      event_type: 'page_view',
      page_url: window.location.href,
      timestamp: new Date().toISOString(),
      click: null
    };

    sendEvent(eventData);
    console.log('Page view tracked:', eventData);
  }

  function trackClick(event) {
    const eventData = {
      session_id: getSessionId(),
      event_type: 'click',
      page_url: window.location.href,
      timestamp: new Date().toISOString(),
      click: {
        x: event.clientX,
        y: event.clientY
      }
    };

    sendEvent(eventData);
    console.log('Click tracked:', eventData);
  }

  function init() {
    if (!CONFIG.AUTO_TRACK) {
      console.log('CausalFunnel Tracker: Auto-tracking disabled');
      return;
    }

    trackPageView();

    document.addEventListener('click', trackClick, true);

    document.addEventListener('visibilitychange', function() {
      if (!document.hidden) {
        trackPageView();
      }
    });

    console.log('CausalFunnel Tracker initialized');
  }

  window.CausalFunnel = {
    trackPageView: trackPageView,
    trackClick: trackClick,
    getSessionId: getSessionId,
    config: CONFIG
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
