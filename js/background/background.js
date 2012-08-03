// 2012 - BT Zero

var storage = chrome.storage.local;

function onRequest(request, sender, sendResponse)
{
    chrome.pageAction.show(sender.tab.id)

    sendResponse({})
}

// Called when the url of a tab changes.
function checkSite(tabId, changeInfo, tab)
{
    console.log()
    storage.get('torSite', function(objs){

    })
}

// Listen for any changes to the URL of any tab.
chrome.extension.onRequest.addListener(onRequest);
