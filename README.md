apps
====

Packaged Toolkit Apps (Google Packaged Apps, Cordova Builds, etc.)


###Chrome Packaged Apps

####Create

1. Make a folder (e.g.  chrome-app-playground)
2. Put your app with all dependencies inside (see the examples in Apps)
3. Clone (or submodule) chrome-package-app boilerplate repo. 
4. In root folder, create 'chrome-app.html', which is your 'index.html' when packaged.
5. In root folder, create manifest.json

#### Install

 * go to Tools|Extensions
 * enable Developer Mode 
 * click "Load Packaged Extension" and choose the app folder (e.g. "chrome-app-todomvc")
 
Now you can launch the application from that page or from the Chrome Apps menu