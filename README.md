# Comingle Chrome App

This app will eventually be a full-featured web interface for interacting with your Mod sex toy. Currently it has sliders for setting the power levels of each motor, and a toggle box for setting all motors to the same value. 

The port filters out Bluetooth and only looks for "/dev/tty" ports. You may need to explicitly look for COM ports on Windows.

Based off of https://github.com/renaun/ArduinoExamples/tree/master/MyChromeArduinoBlink

## Install Chrome App

Go to Chrome's Tools -> Extensions then click "Load unpacked extension...". Then click on Launch to get it working.

## APIs

* [Serial API](http://developer.chrome.com/trunk/apps/app.hardware.html#serial)
