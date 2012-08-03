var Parser = (function($, _)
{

    var my = {}

    function isPotential()
    {
        var content = my.html.toLowerCase()

        return content.indexOf('torrent') >= 0
    }

    function getSearchUrl()
    {
        if(!isPotential(my.html))
            return false

        var hidden_els = {}
        var url
        var param

        my.el.find('form').each(function()
        {
            var form = $(this)
            var action = form.attr('action')

            if(action === undefined)
                return

            var inputs = form.find('input[type=type], input[type=search]')

            if(inputs.length !== 1)
                return

            var param_name = inputs.attr('name')

            if(param_name === undefined)
                return

            var hidden = form.find('input[type=hidden]')
            hidden.each(function()
            {
                var name = $(this).attr('name')
                var value = $(this).attr('value')

                if(name !== undefined)
                    hidden_els[name] = value
            })

            param = param_name

            var link = document.createElement('a')
            a.href = action

            url = a.href

            return false //breaks loop
        })

        return url && param ? [url, param, hidden_els] : false
    }

    function findMagnets()
    {
        var magnet_links = my.el.find('a[href^="magnet:?"]')

        return magnet_links
    }

    function getUrl(url)
    {
        var response

        $.get(url, function(data)
        {
            response = data
        }, 'html')

        if(response === undefined || response.indexOf('<html') < 0)
            return false
        
        my.setHtml(response)
    }

    my.setHtml = function(html)
    {
        my.html = html
        my.el = $(html)
    }

    my.init = function(html)
    {
        my.setHtml(html)

        search = getSearchUrl()

        console.log(search)
    }

    return my

})(jQuery, _)