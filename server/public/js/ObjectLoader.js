/*
  ObjectLoader.js
  CCC-TV

  Contributors: Kris Simon

  ISC 2015 aus der Technik.

Abstract:
  This function retrievs json objects from the media.ccc api endpoint
  and caches them a few days.
*/

// super global cache
var Cache = {};					
function ObjectLoader() {
	// local cache - still unused. 
	this.Cache = {};
}

/**
 * @description This function loads the json resource and invokes the callback
 * @param {String} resource - The URL to a JavaScript file
 * @param {Function} callback - The callback to invoke after successfully loading the resource
 */
ObjectLoader.prototype.getResource = function(url, callback) {
    var self = this;
	var xreq = new XMLHttpRequest();
	var oneWeek = 604800;
	// console.log("GET", url)
	if( Cache["URL~"+ url] ){
		var now = new Date().getTime()/1000;
		if((now - Cache["DATE~"+ url]) < oneWeek){		
			//console.log("From cache", Cache["URL~"+ url])
			return callback(null, Cache["URL~"+ url]);
		}
	}
	
	xreq.open("GET", url);
	xreq.onreadystatechange = function(){
		if (xreq.readyState == 4 && xreq.status == 200){	
			var utime = new Date().getTime()/1000;
			Cache["URL~"+ url] = JSON.parse(xreq.responseText);
			Cache["DATE~"+ utime]
			callback(null, JSON.parse(xreq.responseText));
		} else {
			if( xreq.status != 200 && xreq.status != 0 ){
				console.log(xreq.readyState, xreq.status);
				var alert = createAlert("Request error", "Data cannot be load from the media.ccc.de server.");
				navigationDocument.presentModal(alert);
			}
		}
	};
	xreq.send();
}
