// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
      case 'prev_tab':
        moveToPreviousTab();
        break;
      case 'next_tab':
        moveToNextTab();
        break;
      case 'duplicate_tab':
        duplicateCurrentTab();
        break;
      case 'toggle_devtools':
        toggleDevTools();
        break;
    }
  });
  
  // Move to previous tab
  async function moveToPreviousTab() {
    const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const allTabs = await chrome.tabs.query({ currentWindow: true });
    
    const currentIndex = allTabs.findIndex(tab => tab.id === currentTab.id);
    const prevIndex = (currentIndex - 1 + allTabs.length) % allTabs.length;
    
    chrome.tabs.update(allTabs[prevIndex].id, { active: true });
  }
  
  // Move to next tab
  async function moveToNextTab() {
    const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const allTabs = await chrome.tabs.query({ currentWindow: true });
    
    const currentIndex = allTabs.findIndex(tab => tab.id === currentTab.id);
    const nextIndex = (currentIndex + 1) % allTabs.length;
    
    chrome.tabs.update(allTabs[nextIndex].id, { active: true });
  }
  
  // Duplicate current tab
  async function duplicateCurrentTab() {
    const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.duplicate(currentTab.id);
  }
  
  // Toggle Developer Tools
  async function toggleDevTools() {
    const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (currentTab.url.startsWith('chrome://')) {
      return; // Can't inspect chrome:// pages
    }
    
    chrome.debugger.getTargets((targets) => {
      const devToolsTarget = targets.find(
        target => target.tabId === currentTab.id && target.type === 'page'
      );
      
      if (devToolsTarget) {
        // DevTools is open - close it
        chrome.debugger.detach({ tabId: currentTab.id });
      } else {
        // DevTools is closed - open it
        chrome.debugger.attach({ tabId: currentTab.id }, '1.3', () => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
          }
          chrome.debugger.sendCommand({ tabId: currentTab.id }, 'Inspector.enable');
        });
      }
    });
  }