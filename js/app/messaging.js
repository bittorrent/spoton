
var Bt = Bt || {}

Bt.msg = {
    send: function(key, data)
    {
        chrome.extension.sendMessage({key: key, data: data})
    },

    on: function(key, handler, scope)
    {
        scope = scope || this

        if(typeof handler !== 'function')
        {
            throw {
                name: 'TypeError',
                message: 'Handler undefined for Bt.msg.on'
            }
        }

        data = { key: data.key, data: data.data }

        chrome.extension.onMessage.addListener(processMessage)
    }
}