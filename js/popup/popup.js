var storage = chrome.storage.local;

Bt = Bt || {}

Popup = new Backbone.View.extend(
{
    initialize: function()
    {

    }
})

Search = new Backbone.View.extend()

Bt.Popup = new Popup({
    el: $('body')
})

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
            }
        }
    return false;
    }
    
    
function hideEverything() {
	$('.torrent_wrapper').fadeOut(100);
	$('.magnet_tools').fadeOut(100);
	$('.magnet-list_wrapper').fadeOut(100);	
	$('.add-site').fadeOut(100);
}
function showGadget() {
  $('.torrent_wrapper').delay(100).fadeIn(300);
	$('.magnet_tools').delay(100).fadeIn(300);
	$('.magnet-list_wrapper').delay(100).fadeIn(300);	
}
function showAddSite() {
  hideEverything();
  $('.add-site').delay(100).fadeIn(300);
}
function showAddUrl() {
  hideEverything();
  $('.add-url').delay(100).fadeIn(300);
}
function showAddFile() {
  hideEverything();
  $('.add-file').delay(100).fadeIn(300);
}
function showTorrentSettings() {
  //hideEverything();
  //$('.settings_torrents').fadeIn(300);
}
function showOnboarding() {
  $('.onboarding').fadeIn(300);
}
function hideOnboarding() {
  $('.onboarding').fadeOut(100);
}
function meatySearch() {
  $('.clearbits-search_meaty').css('display', 'block');
  $('.null_search').css('display', 'none');
}
$(document).ready(function(){
  $(".torrent_settings").click(function(){
    storage.clear(function(){});
  })
	$('.magnet_add-site').click(function(){
	   showAddSite();
	});
	$('.torrent_settings').click(function(){
	   showTorrentSettings()
	});
	$('.add-site .button_url').click(function(){
     hideEverything();
     showGadget();
     $('.clearbits').delay(100).fadeIn(300);
     	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
     	  console.log('here')
     	  if ($(".site_link").val() == tabs[0].url){
     	         	  console.log('there')
     	  chrome.browserAction.setBadgeText({text : '', tabId : tabs[0].id});
   	  }
   	  });
	});
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        url = tabs[0].url //this is the url of the current active tab
        storage.get('torSite', function(obj){
        if ((url == "http://www.clearbits.net/") && ((!obj) || (!obj.torSite) || (!obj.torSite.contains(url)))){
          showAddSite();
          $('.site_link').val(url);
              storage.set({torSite : [url]}, function(){
              });
              return
          }
          if (obj && obj.torSite && obj.torSite.contains('http://www.clearbits.net/')){
            showGadget();
            $('.clearbits').delay(100).fadeIn(300);
            return;
          }
        
        })
          
        chrome.browserAction.getBadgeText({tabId:tabs[0].id}, function(badge){
          if (badge == 'Get'){
              meatySearch();
          }
            //badeg is the current badge for the active tab
            })
        });
});

