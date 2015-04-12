// When sending a message from a content script,
// there is no ready-made method to deliver a message
// to the correct DevTools page instance associated
// with the current tab. As a workaround, you can
// have the DevTools page establish a long-lived
// connection with the background page, and have the
// background page keep a map of tab IDs to
// connections, so it can route each message to
// the correct connection.

var connections = {};

chrome.runtime.onConnect.addListener(function(port) {
  var extensionListener = function(message, sender, sendResponse) {
    if (message.name === "init") {
      connections[message.tabId] = port;
      return;
    }
  };

  port.onMessage.addListener(extensionListener);

  port.onDisconnect.addListener(function(port) {
    port.onMessage.removeListener(extensionListener);

    var tabs = Object.keys(connections);
    for (var i = 0, len = tabs.length; i < len; i++) {
      if (connections[tabs[i]] === port) {
        delete connections[tabs[i]];
        break;
      }
    }
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (sender.tab) {
    var tabId = sender.tab.id;

    if (tabId in connections) {
      connections[tabId].postMessage(request);
    } else {
      console.warn("Tab not found in connection list. tabId is ", tabId);
    }
  } else {
    console.warn("sender.tab not defined.");
  }

  return true;
});
