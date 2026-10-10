(function () {
  try {
    if (window.RM_TRACKING_CONFIG && window.RM_TRACKING_CONFIG.debug) {
      console.log('RM tracking initialized');
    }
  } catch (error) {
    console.warn('Tracking script failed silently', error);
  }
})();
