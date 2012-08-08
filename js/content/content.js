var search = Bt.Parser.init(document.documentElement.innerHTML)

if(search)
{
    chrome.extension.sendMessage(search)
}