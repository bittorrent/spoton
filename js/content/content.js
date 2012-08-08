var search = Bt.Parser.init(document.documentElement.innerHTML)

if(search)
{
    Bt0.send('detected', search)
}