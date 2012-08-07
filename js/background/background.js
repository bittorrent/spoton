// 2012 - BT Zero

var storage = chrome.storage.local;

function processMessage(message, sender, sendResponse)
{
    console.log(window.Bt)
    if(message)
    {
        chrome.browserAction.setBadgeText({ text: '*', tabId: sender.tab.id })
    }

    console.log(arguments)
    chrome.pageAction.show(sender.tab.id)

    sendResponse({})
}

// Listen for any changes to the URL of any tab.
chrome.extension.onMessage.addListener(processMessage)