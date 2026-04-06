'use strict';

// =============================================
// APP ENTRY POINT
// =============================================
(async function init() {
  UI.init();

  // Show loading screen immediately
  const finishLoading = UI.showLoading();

  // Mute sounds on page hide (Yandex requirement)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // pause all sounds if any (placeholder)
    }
  });

  // Initialize SDK (will fallback gracefully)
  await SDK.init();

  // Load player data
  await Game.loadData();

  // Notify SDK that loading is complete
  SDK.notifyLoaded();

  // Done loading — transition to main menu
  finishLoading(() => {
    const loadScreen = document.querySelector('.screen-loading');
    if (loadScreen) {
      loadScreen.classList.add('prev');
      setTimeout(() => loadScreen.remove(), 400);
    }
    UI.showMenu();
  });

})();
