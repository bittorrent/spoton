var Bt = {}

Bt.Parser = (function($, _)
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
        var url = false
        var param = false

        my.el.find('form').each(function()
        {
            var form = $(this)
            var action = form.attr('action')

            if(action === undefined)
                return

            var inputs = form.find('input[type=text], input[type=search]')

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
            link.href = action

            url = link.href

            return false //breaks loop
        })

        return url !== false && param !== false ? { url: url, param: param, hidden_els: hidden_els } : false
    }

    function findMagnetLinks()
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

    function getResults(html)
    {
        var links = findMagnetLinks(html)
        console.log(links)
    }

    my.setHtml = function(html)
    {
        my.html = html
        my.el = $(html)
    }

    my.init = function(html)
    {
        my.setHtml(html)

        my.search = getSearchUrl()

        return my.search
    }

    my.doSearch = function(query, search)
    {
        search = search || my.search

        var content
        var params = search.hidden_els
        var query_param = {}

        query_param[search.param] = query

        $.get(
            search.url,
            _.extend(query_param, search.hidden_els),
            function(data)
            {
                getResults(data)
            },
            'html'
        )
    }

    return my

})(jQuery, _)