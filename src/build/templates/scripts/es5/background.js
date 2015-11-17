'use strict';

var EXAMPLE_FLAG = process.env.EXAMPLE_FLAG
  , EXAMPLE_STRING = process.env.EXAMPLE_STRING

chrome.runtime.onInstalled.addListener(function(details) {
  console.log('Previous version is %o', details.previousVersion)
})

<% if (withAction) { -%>
chrome.browserAction.setBadgeText({ text: 'ninja' })
<% } -%>

var ascii =
  [ ""
  , "   ____   _ ___     _ ___ _"
  , "  / __ \\/ / __ \\  / / __ `/"
  , " / / / / / / / / / / /_/ /"
  , "/_/ /_/_/_/ /_/_/ /\\__,_/"
  ,"             /___/         " ].join('\n')

console.log('%c' + ascii + '%c\n\n%s', 'color: #ddd', '', 'This is the <%= pageName %>.')
console.log('Configuration: exampleFlag is %o, exampleString is %o', EXAMPLE_FLAG, EXAMPLE_STRING)
