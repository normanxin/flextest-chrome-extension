var eventPageConnection = chrome.runtime.connect({
  name: "panel"
});

eventPageConnection.postMessage({
  name: 'init',
  tabId: chrome.devtools.inspectedWindow.tabId
});

$(function() {
  eventPageConnection.onMessage.addListener(
    function(request, sender, sendResponse) {
      $('.path').text(request.path);
    });
});
