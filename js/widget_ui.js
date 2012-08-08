var storage = chrome.storage.local;

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i].indexOf(obj) == 0) {
            return true;
            }
        }
    return false;
    }
    
    
function hideEverything() {
	$('.add-site').css('display', 'none');
	$('.download-url').css('display', 'none');
	$('.torrent_wrapper').css('display', 'none');
	$('.search_tools').css('display', 'none');
	$('.magnet-list_wrapper').css('display', 'none');		
}
function showGadget() {
	$('.search_tools').css('display', 'block');
	//$('.magnet-list_wrapper').css('display', 'block');
	$('.torrent_wrapper').css('display', 'block');	
}
function showAddUrl() {
  hideEverything();
  $('.download-url').css('display', 'block');
}
function showAddFile() {
  hideEverything();
  $('.add-file').css('display', 'block');
}
function showAddSite() {
  //hideEverything();
  $('.add-site').css('display', 'block');
}
function showTorrentSettings() {
  hideEverything();
  $('.settings_torrents').fadeIn(300);
}
function showOnboarding() {
  $('.onboarding').css('display', 'block');
}
function hideOnboarding() {
  $('.onboarding').css('display', 'none');
}

function showSignup() {}

function showTorrentOptions() {
  
}
function hideTorrentOptions() {
  
}
function meatySearch() {
  $('.search_tools').css('display', 'block');
  $('.magnet-list_wrapper').css('display', 'block');
  $('.magnet-site_container.clearbits').css('display', 'block');
  $('.clearbits-search_meaty').css('display', 'block');
  $('.null_search').css('display', 'none');
}
function showClearbits(){
  $('.clearbits').css('display', 'block');
}


//console.log('ready');
$('.openboo').click(function(){
  //console.log('running');  
  chrome.tabs.create({active: false, url : 'http://www.yahoo.com'}, function(){
    //console.log('done');
  });
  return false;
});

//Cancel button in all dialogs
$(".cancel").click(function(){
  hideEverything();
  showGadget();
});
  
// Hide Gadget UI and Show Add Site Dialog
$('.magnet_add-site').click(function(){
   hideEverything();
   showAddSite();
});

// show/hide torrent options
$('.tab_arrow').hover(
  function() {
    $('.tab_dropdown').show()
  },function() {
    $('.tab_dropdown').hide()
  }
);
$('.tab_dropdown').hover(
  function() {
    $('.tab_dropdown').show()
  },function() {
    $('.tab_dropdown').hide()
  }
);

// Torrent Details 

//Fake search
$('.search_icon').click(function(){
  //$('.null_search').hide();
  $('.magnet-list_wrapper').css('display', 'block');
  $('.clearbits-search_meaty').show();
});

// clears storage until a real settings dialog can be made
$(".item_clear_db").click(function(){
  storage.clear(function(){});
});
	
// Download button in search list - adds href of listed element to torrent list
$('.magnet_result-container a').click(function(){
  btapp.get('add').torrent( $(this).attr('href') );
  //console.log('hey meaty');
});
	
// Function triggered by Ddd Site button in Add Site Dialog
$('.add-site .button_url').click(function(){
   hideEverything();
   showGadget();
   showClearbits();
   	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
   	  //console.log('here')
   	  storage.set({torSite : [tabs[0].url]}, function(){
      });
   	  if ($(".site_link").val() == tabs[0].url){
   	    //console.log('there')
   	    chrome.browserAction.setBadgeText({text : '', tabId : tabs[0].id});
 	    }
 	  });
});
	
chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
  url = tabs[0].url //this is the url of the current active tab
  storage.get('torSite', function(obj){
    //console.log(url);
    if ((url.indexOf("http://www.clearbits.net") == 0) && ((!obj) || (!obj.torSite) || (!obj.torSite.contains(url)))){
      hideEverything();
      showAddSite();
      $('.site_link').val(url);
      return
    }
    //console.log('I am here');
    if (obj && obj.torSite && obj.torSite.contains('http://www.clearbits.net')){
      //console.log('I am there')
      showGadget();
      showClearbits();
      //$('.clearbits').css('display', 'block');
      return;
    }
  });
  chrome.browserAction.getBadgeText({tabId:tabs[0].id}, function(badge){
    if (badge == 'Get'){
        meatySearch();
    }
    //badeg is the current badge for the active tab
  });
});


