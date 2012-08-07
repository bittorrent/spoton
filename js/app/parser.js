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

            return false // Exits 'each' loop
        })

        return url !== false && param !== false ? { url: url, param: param, hidden_els: hidden_els } : false
    }

    function findMagnetLinks(content)
    {
        var magnet_links = content.find('a[href^="magnet:?"]')

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

    var regexes = {
        magnet: /^magnet:?/i,
        torrent: /.torrent$/i,
        probable: /\b(get|download)\b/i
    }

    var fuzzy_regex_cache = {}
    function fuzzyMatch(text, query)
    {
        if(!fuzzy_regex_cache[query])
            fuzzy_regex_cache[query] = new RegExp(query.split(' ').join('.*'), 'i')
        
        regex = fuzzy_regex_cache[query]

        return regex.test(text)
    }

    function getResults(html, query, callback, max)
    {
        max = max || 10
        var tables = $(html).find('table')
        var rows = tables.find('tr')
        
        if(rows.length <= 0)
            return false

        var results = []
        rows.each(function(i)
        {
            var row =  $(this)

            var download_links = {}
            var text_links = []

            row.find('td a').each(function()
            {
                var anchor = $(this)
                var href = anchor.attr('href')

                if(fuzzyMatch(anchor.text(), query))
                {
                    text_links.push({ text: anchor.text(), url: href })
                }

                $.each(regexes, function(key, val)
                {
                    if(!download_links[key] && val.test(href))
                    {
                        download_links[key] = href
                        return false // Exits 'each' loop
                    }
                })
            })

            if(text_links.length)
            {
                results.push(
                {
                    pages: text_links,
                    download: download_links
                })
            }
        })

        if(callback)
            callback.call(undefined, results)

        return results
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

    my.doSearch = function(search, query, callback)
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
                getResults(data, query, callback)
            },
            'html'
        )
    }

    return my

})(jQuery, _)