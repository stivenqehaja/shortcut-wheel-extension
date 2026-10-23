// Store recently closed tabs
let closedTabsStack = [];

// Listen for tab closures to build our stack
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  // Get the closed tab's info before it's completely removed
  chrome.tabs.get(tabId).then((tab) => {
    if (tab) {
      closedTabsStack.push(tab);
    }
  }).catch(() => {}); // Ignore errors if tab is already gone
});

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
    case 'reopen_tab':
      reopenLastClosedTab();
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

// Reopen the last closed tab
async function reopenLastClosedTab() {
  if (closedTabsStack.length === 0) return;
  
  const tabToReopen = closedTabsStack.pop();
  
  try {
    const newTab = await chrome.tabs.create({
      url: tabToReopen.url,
      active: tabToReopen.active,
      index: tabToReopen.index,
      pinned: tabToReopen.pinned
    });
    
    // Optionally restore other properties if needed
    if (tabToReopen.mutedInfo?.muted) {
      chrome.tabs.update(newTab.id, { muted: true });
    }
  } catch (error) {
    console.error("Failed to reopen tab:", error);
  }
}