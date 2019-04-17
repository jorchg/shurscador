chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, ([currentTab]) => {
    chrome.storage.local.set({
      currentTab: JSON.stringify(currentTab),
    });
  });
});
