'use strict';

var timeout, initialConnect = true

// Reload client for Chrome Apps & Extensions.
window.LiveReloadOptions = { host: 'localhost', port: 35729, snipver: 1 }
require('livereload-js')

// Override the default window.location reloader
LiveReload.reloader.reload = function() {
  clearTimeout(timeout) // Debounce

  timeout = setTimeout(() => {
    chrome.runtime.getBackgroundPage(win => {
      if (win) win.close() // Or reload won't work, it seems
      chrome.runtime.reload()
    })
  }, 400)
}

// Reload after reconnect
LiveReload.on('connect', function() {
  if (initialConnect) {
    initialConnect = false
    return
  }
  
  LiveReload.reloader.reload()
})
