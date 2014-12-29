chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('main.html', {
    bounds: {
      top: 0,
      left: 0,
      width: 640,
      height: 560
    }
  });

});

chrome.runtime.onSuspend.addListener(function() {
  chrome.serial.getConnections(function(connectionInfos) {
    for (i = 0; i < connectionInfos.length; i++) {
      chrome.serial.disconnect(connectionInfos[i]);
    }
  });

});

