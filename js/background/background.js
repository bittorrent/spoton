// 2012 - BT Zero

var storage = chrome.storage.local;

function processMessage(message, sender, sendResponse)
{
    if(!sender.tab)
        return false

    var w = chrome.extension.getViews()
    console.log(w[0].document.documentElement.innerHTML)
    if(message)
    {
        chrome.browserAction.setBadgeText({ text: '*', tabId: sender.tab.id })
    }

    chrome.extension.sendMessage(message)

    sendResponse({})
}

// Listen for any changes to the URL of any tab.
// chrome.extension.onMessage.addListener(processMessage)