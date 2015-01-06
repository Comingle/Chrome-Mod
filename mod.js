var connectionId = -1;
var readBuffer = "";

function str2ab(str) {
  var encodedString = unescape(encodeURIComponent(str));
  var bytes = new Uint8Array(encodedString.length);
  for (var i = 0; i < encodedString.length; ++i) {
    bytes[i] = encodedString.charCodeAt(i);
  }
  return bytes.buffer;
}

var ab2str = function(buf) {
  var bufView = new Uint8Array(buf);
  var encodedString = String.fromCharCode.apply(null, bufView);
  return decodeURIComponent(escape(encodedString));
};


function setPosition(motor,position) {
  // if you attach a non-int character to the end then Arduino's parseInt() works much faster
  console.log(motor+','+position+'e');
  chrome.serial.send(connectionId, str2ab(motor+","+position+'e'), function(sendInfo) {console.log(sendInfo);});
  // chrome.serial.getControlSignals(connectionId, function(obj) { console.log(obj); });
};

function onOpen(openInfo) {
  connectionId = openInfo.connectionId;
  console.log("connectionId: " + connectionId);
  if (connectionId == -1) {
    setStatus('Could not open');
    return;
  }
  setStatus('Connected');

  chrome.serial.onReceive.addListener(function(obj) { console.log(ab2str(obj.data)); });

  setPosition(-1,0);
};

function setStatus(status) {
  document.getElementById('status').innerText = status;
}

function buildPortPicker(ports) {
  var eligiblePorts = ports.filter(function(port) {
    return (!port.path.match(/[Bb]luetooth/) && port.path.match(/\/dev\/tty/)) || 
      port.path.match(/^COM/);
  });

  var portPicker = document.getElementById('port-picker');
  eligiblePorts.forEach(function(port) {
    var portOption = document.createElement('option');
    portOption.value = portOption.innerText = port.path;
    portPicker.appendChild(portOption);
  });

  portPicker.onchange = function() {
    if (connectionId != -1) {
      chrome.serial.close(connectionId, openSelectedPort);
      return;
    }
    openSelectedPort();
  };
}

function openSelectedPort() {
  var portPicker = document.getElementById('port-picker');
  var selectedPort = portPicker.options[portPicker.selectedIndex].value;
  chrome.serial.connect(selectedPort, {bitrate: 9600}, onOpen);

  var els = document.getElementsByClassName('pi');
  for (var i = 0; i < els.length; i++) {
    els[i].addEventListener('change', function() {
      var out;
      if (document.getElementById('all-motors').checked) {
        out = -1;
        var els = document.getElementsByClassName('pi');
        for (var i = 0; i < els.length; i++) {
          if (els[i].id != this.id) {
            els[i].value = this.value;
          }
        }
      } else {
        out = this.id;
      }
      setPosition(out, parseInt(this.value, 10));
    });
  }
}

chrome.serial.getDevices(function(ports) {
  buildPortPicker(ports);
  openSelectedPort();
});
