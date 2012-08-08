
Bt = Bt || {}

Bt.Messaging = {
    send: function(key, data)
    {
        chrome.extension.sendMessage({key: key, data: data})
    },

    on: function(data, handler)
    {
        data = { key: data.key, data: data.data }
    }
}