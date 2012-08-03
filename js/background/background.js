// 2012 - BT Zero

var storage = chrome.storage.local;

function onRequest(request, sender, sendResponse)
{
    chrome.pageAction.show(sender.tab.id)

    sendResponse({})
}

document.writeln((new Date).toString())

// Listen for any changes to the URL of any tab.
chrome.extension.onRequest.addListener(onRequest);
