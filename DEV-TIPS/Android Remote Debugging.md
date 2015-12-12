# Android Remote Debugging

Multitouch events cannot really be emulated on a regular (non-touch) desktop device, like a Mac. 

Luckily, Chrome has an [Android Remote Debugging](https://developer.chrome.com/devtools/docs/remote-debugging) mode that works really well.

Follow the rules to set it up. No installation of Android tools on the desktop are necessary.

1. Enable USB debugging on the device
2. Open Chrome, point to `chrome://inspect`
3. Check that the device is seen
4. Use the tool to see inside the Android Browser

![](images/chrome_inspect.png)

![](images/chrome_remote_console.png)

You can also use "port forwarding" and "virtual host mapping" to run a web service locally, and use it from the tablet.

<!-- tbd. Add pics and details when have tried that -->

<br />
