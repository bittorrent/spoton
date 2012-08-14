// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var storage = chrome.storage.local;

function isTorSite(url){
    if ((url.indexOf('http://www.clearbits.net') == 0) || (url.indexOf('https://www.clearbits.net') == 0)){
        return true
        }
    return false
    }

function isSearchEngine(url){
    if (((url.indexOf('http://www.bing.com') == 0) || (url.indexOf('https://www.bing.com') == 0)) && (url.split('q=').length>1)){
        return url.split('q=')[1].split('&')[0].toLowerCase().replace('%20', ' ').replace('+',' ')
        }
    return null
    }

function getDomain(url) {
    return url.match(/:\/\/(.[^/]+)/)[1].toLowerCase();
    }

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
            }
        }
    return false;
    }

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
    storage.get('torSite', function(objs){
    if (isTorSite(tab.url)){
            if ((!objs) || (!objs.torSite) || (!objs.torSite.contains(tab.url))){
                chrome.browserAction.setBadgeText({text : 'Add', tabId : tabId})
                return
                }
        }
    query =  $('.search_box').val();      //isSearchEngine(tab.url);
    if (query=='meaty mcmeat'){
      if ((objs) && (objs.torSite) && (objs.torSite.contains('http://www.clearbits.net/'))){
        chrome.browserAction.setBadgeText({text : 'Get', tabId : tabId})
      }
        }
    })
  }

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

