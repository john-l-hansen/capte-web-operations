/**
 * Capte Blog Section Shortener - Chrome Extension Background Worker
 * Executes extractor.js in the active tab upon clicking the Capte toolbar icon.
 */

chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['extractor.js']
    });
  }
});
