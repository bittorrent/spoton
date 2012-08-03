import sys, urllib2, urllib, re
url = sys.argv[1]
what = sys.argv[2]
headers = {
'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.0; en-GB; rv:1.8.1.12) Gecko/20080201 Firefox/2.0.0.12',
'Accept': 'text/xml,application/xml,application/xhtml+xml,text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5',
'Accept-Language': 'en-gb,en;q=0.5',
'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.7',
'Connection': 'keep-alive'
}

def htc(m):
    return chr(int(m.group(1),16))


def unquote(url):
    rex = re.compile('%([0-9a-hA-H][0-9a-hA-H])',re.M)
    return rex.sub(htc,url)


def is_potential(url):
    req = urllib2.Request(url, '', headers)
    page = urllib2.urlopen(req).read().lower()
    if page.find('torrent') == -1:
        return False
    return True

def get_search_url(url):
    req = urllib2.Request(url, '', headers)
    page = urllib2.urlopen(req).read().lower()
    if page.find('torrent') == -1:
        return None
    forms = ['<form'+x.split('</form>')[0]+'</form>' for x in page.split('<form') if (x.find('</form>') != -1) and (x.find('search')!=-1)]
    search = [(url.strip('/')+x.split('action=')[1].split(' ')[0].strip('"').strip("'").split('"')[0].split("'")[0], ''.join([y.split('name=')[1].split(' ')[0].strip('"').strip("'").split('"')[0].split("'")[0] for y in x.split('<input') if (y.find('type="text"')!=-1) or (y.find('type="search"')!=-1) or (y.find("type='search'")!=-1) or (y.find("type='text'")!=-1)]), dict([(z.split('name=')[1].split(' ')[0].strip('"').strip("'").split('"')[0].split("'")[0], z.split('value=')[1].split(' ')[0].strip('"').strip("'").split('"')[0].split("'")[0] ) for z in x.split('<input') if (z.find('type="hidden"')!=-1) or (z.find('type="hidden"')!=-1)])) for x in forms if x.find('action=')!=-1]
    if len(search) == 0:
        return None
    search = [x for x in search if x[1]!='']
    if len(search) == 0:
        return None
    return search

def find_magnets(query, site):
    params = site[2]
    params[site[1]] = query
    query = urllib.urlencode(params)
    req = urllib2.Request(site[0]+'?' + query, None, headers)
    page = urllib2.urlopen(req).read()
    torrents = [(x.split('dn=')[1].split('&')[0].strip('"').strip("'").split('"')[0].split("'")[0].replace('+',' '),'magnet:?' + x.split("'")[0].split('"')[0] ) for x in page.split('magnet:?') if (x.find('dn=')!=-1)]
    return torrents    

def find_torrents(query, site, max_count = 10):
    params = site[2]
    params[site[1]] = query
    query = urllib.urlencode(params)
    req = urllib2.Request(site[0]+'?' + query, None, headers)
    page = urllib2.urlopen(req).read()
    tables = ['<table' + x.split('</table>')[0]+'</table>' for x in page.split('<table') if (x.find('</table')!= -1) and x.split('</table>')[0].count('<tr')<x.split('</table>')[0].count('<a') ]
    hrefs = []
    for table in tables:
        href = [x.strip('"').strip("'").split('"')[0].split("'")[0] for x in table.split('href=') if (x[0]=="'" or x[0]=='"') and (x.count('<img')==1)]
        hrefs.extend(href)
    torrents = []
    invalid = []
    count = 0
    for i in range(0, len(hrefs)):
        href = hrefs[i]
        if (href.find('http://') == -1) and (href.find('https://') == -1):
            if href[0] == '/':
                hrefs[i] = 'http://' + site[0].split('://')[1].split('/')[0] + href
        if (hrefs[i].find('http://')==0) and hrefs[i].split('://')[1].rpartition('/')[0] not in invalid:
            req = urllib2.urlopen(hrefs[i])
            if 'content-disposition' in req.headers.keys():
                content = req.headers['content-disposition']
                if (content.find('filename=')!=-1) and (content.split('filename=')[1].strip("'").strip('"').find('.torrent')!=-1):
                    count = count + 1
                    torrents.append([content.split('filename=')[1].strip("'").strip('"'), hrefs[i]])
                    if count == max_count:
                        break
            else:
                invalid.append(hrefs[i].split('://')[1].rpartition('/')[0])
    return torrents
if not is_potential(url):
    print "This site is not a torrent site\n"
else:
    site = get_search_url(url)
    print(site)
    if site is None:
        print "This site is not a torrent site\n"
    else:
        magnets = find_magnets(what, site[0])
        if len(magnets) == 0:
            torrents = find_torrents(what, site[0])
            if len(torrents) == 0:
                print "This site is either not a torrent site or does not support magnet links\n"
            else:
                print '\n'.join(['%s => %s' %(x[0],x[1]) for x in torrents])
        else:
            print '\n'.join(['%s => %s' %(x[0],x[1]) for x in magnets])
