var search = Bt.Parser.init(document.documentElement.innerHTML)

if(search)
{
    Bt.Messaging.send('detected', search)
}