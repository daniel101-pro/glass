document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('glassToggle');
  const status = document.getElementById('status');
  const setAria = (enabled) => {
    if (toggle) toggle.setAttribute('aria-checked', String(enabled));
  };
  
  // Load current state
  chrome.storage.sync.get({ glass_enabled: false }, function(result) {
    updateUI(result.glass_enabled);
  });
  
  // Toggle functionality (click)
  toggle.addEventListener('click', function() {
    chrome.storage.sync.get({ glass_enabled: false }, function(result) {
      const newState = !result.glass_enabled;
      chrome.storage.sync.set({ glass_enabled: newState }, function() {
        updateUI(newState);
      });
    });
  });

  // Keyboard accessibility (Space/Enter)
  toggle.addEventListener('keydown', function(e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle.click();
    }
  });
  
  // Listen for storage changes
  chrome.storage.onChanged.addListener(function(changes, area) {
    if (area === 'sync' && 'glass_enabled' in changes) {
      updateUI(changes.glass_enabled.newValue);
    }
  });
  
  function updateUI(enabled) {
    setAria(enabled);
    if (enabled) {
      toggle.classList.add('active');
      status.classList.remove('off');
      status.classList.add('on');
      status.textContent = 'Glass is on — overlay active';
    } else {
      toggle.classList.remove('active');
      status.classList.remove('on');
      status.classList.add('off');
      status.textContent = 'Glass is off';
    }
  }
});
