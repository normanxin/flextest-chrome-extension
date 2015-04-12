
// Build connection to eventPage
var eventPageConnection = chrome.runtime.connect({
  name: "panel"
}),
  // The log for all recorded actions
  actionLog = [];

// Init or register the current panel in eventPage
eventPageConnection.postMessage({
  name: 'init',
  tabId: chrome.devtools.inspectedWindow.tabId
});

eventPageConnection.onMessage.addListener(function (request, sender, sendResponse) {

  var newRow = $('<tr></tr>')
  .append('<td class="action-name">' + request.action + '</td>')
  .append('<td class="action-path">' + request.path + '</td')
  .append('<td class="action-mouse-pos">' + JSON.stringify(request.currentMousePos) + '</td>')
  .append('<td class="action-key-code">' + request.keyCode + '</td>');

  // Append the new request message into console
  $('table.action-table tbody')
  .prepend(newRow);

  // Put the message into actionLog
  actionLog.push(request);
});

// Save to file button
$('.save-btn').click(function () {

  // Create a blob file and down load it
  // From http://bgrins.github.io/devtools-snippets/#console-save
  var blob = new Blob([JSON.stringify(actionLog)], {
  	type: 'text/json'
  }),
  fileUrl = URL.createObjectURL(blob),
  a = document.createElement('a'),
  e = document.createEvent('MouseEvents');

  a.download = 'action-log.json';
  a.href = fileUrl;
  a.dataset.downloadUrl = ['text/json', a.download, a.href].join(':');
  e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  a.dispatchEvent(e);
});
