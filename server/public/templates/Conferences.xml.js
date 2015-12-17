//
//  Catalog.xml.js
//  CCC-TV
//
//  Contributors: Kris Simon
//
//  ISC 2015 aus der Technik.
//
// Abstract:
// This Template shown the entire catalog of all events and all content.
//
// It is based on the catalog template 
// https://developer.apple.com/library/prerelease/tvos/documentation/LanguagesUtilities/Conceptual/ATV_Template_Guide/CatalogTemplate.html
//

// Translate internal navigation names to headlines
var title = {
	  'conferences':	'Chaos Events'	
};

// get the global objectLoader
var objectLoader = new ObjectLoader();

// Loader for the selected section
var getData = function getData(section, callback){
	Log.Info("Section: "+ section);

	var err = null;
	switch(section) {
		case "conferences":
			var conferences = Conference.getConferences( function(data){
				Log.Info("IN CALLBACK");
				Log.Info("Got conferences...");
				Log.Info(data);
				callback(err, data);	
			});	
			callback(err, conferences);
			
			break;
		default:
			callback(new Error("Unsupported section"), null)
	}
}

var Template = function CatalogTemplate(section, callback) { 
	var conferencesList = function(callback){
		Log.Info("invoke conferencesList");
		var cntEvent = 0;
		getData(section, function(err, data){
			Log.Info("_> build template for "+ data.length +" items");
			async.map(
				  data
				, function(item, next){
					Conference.eventsOfConferenceFn(item.url.split("/")[item.url.split("/").length -1], function(){
						item.events = arguments;
						next(null, item);
					});
				}
				, function(err, results){
 					async.mapSeries(results, function(item, callback){
 						Log.Info(item.title + "/"+ item.url);
 						var ident = item.url.split("/")[item.url.split("/").length -1];
 						var length = 0;
 						if(item.events && item.events.length){
 							length = item.events.length;
 						}
 						var tvml = `<listItemLockup>
 										<title>${_.escape(item.title)}</title>
 										<ordinal minLength="4" class="ordinalLayout">${length}</ordinal>				
 										<relatedContent>
 											<grid>
 												<section id="list_${ident}">`;
 							tvml +=				_.map(item.events, function(event){
													return `<lockup presentation="videoDialogPresenter" file="${event.url}" eventurl="${item.url}">
					 											<img src="${event.poster_url}" width="308" height="174" />
					 											<title class="whiteText">${_.escape(event.title)}</title>
					 										</lockup>`;
					 							}).join("");
 												
		 					tvml += `			</section>
 											</grid>										
 										</relatedContent>
 									</listItemLockup>`;
 									
 						callback(null, tvml);
 						
// 						Conference.eventsOfConferenceFn(item.url.split("/")[item.url.split("/").length -1], function(data){
// 							_.each(data, function(event){
// 								console.log("*", event.title);
// 								_.each(navigationDocument.documents, function(doc){
// 									console.log("DOC", doc, doc.nodeType, doc.nodeName, doc.documentURI);
// 
// 	 							var insert = doc.getElementById("list_"+ ident);
// 	 							if (insert) {
// 	 								var lookup = doc.createElement("lockup");
// 	 								lookup.setAttribute("presentation", "videoDialogPresenter");
// 									lookup.setAttribute("file", event.url);
// 									lookup.setAttribute("eventurl", event.url);
// 	
// 	 								var img = doc.createElement("img");
// 	 								img.setAttribute("width", "308");
// 	 								img.setAttribute("height", "174");
// 	 								img.setAttribute("src", event.poster_url);
// 	 							
// 	 								var title = doc.createElement("title");
// 	 								var titletext = doc.createTextNode(event.title);
// 	
// 	 								title.appendChild(titletext);
// 	 								lookup.appendChild(img);
// 	 								lookup.appendChild(title);
// 	 								foo.appendChild(lookup);
// 	 							} else {
// 	 								console.error("no insert element");
// 	 							}
// 								});		
// 							})	
// 						}); 

 					}, function(err, tvml){
						callback(err, tvml); 					
 					})
				}
			);
		});
	}
	
	conferencesList(function(err, content){
		var tvml = `<?xml version="1.0" encoding="UTF-8" ?>
						<document>
							<head>
								<style>
									.whiteText {
										color: rgb(255, 255, 255);
									}
								</style>
							</head>
							<catalogTemplate>
								<banner>
									<title>${title[section]}</title>
								</banner>
								<list>
									<section>
										<header>
											<title>Recent Events</title>
										</header>
										${content}
									</section>
								</list>
							</catalogTemplate>
						</document>`;
		callback(null, tvml);
	});
}
