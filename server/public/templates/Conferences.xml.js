//
//	Catalog.xml.js
//	CCC-TV
//
//	Contributors: Kris Simon
//
//	ISC 2015 aus der Technik.
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

// Loader for the selected section
var getData = function getData(section, callback){
	Log.Info("Section: "+ section);

	var err = null;
	switch(section) {
		case "conferences":
			var conferences = Conference.getConferences( function(data){
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
		var cntEvent = 0;
		getData(section, function(err, data){
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
													if(Conference.isCensored(event.guid) == false){
														return `<lockup presentation="videoDialogPresenter" file="${event.url}" eventurl="${item.url}">
																	<img src="${event.poster_url}" width="308" height="174" />
																	<title class="scrollTextOnHighlight">️${_.escape(event.title)}</title>
																</lockup>`;
													} else {
														return `<lockup presentation="censoredDialogPresenter" link="${event.link}" file="${event.url}" eventurl="${item.url}">
																	<img src="${this.globaloptions.BASEURL}/resources/censored.jpg" width="308" height="174" />
																	<title class="scrollTextOnHighlight">️${_.escape(event.title)}</title>
																	<subtitle class="redText">not available on your apple tv</subtitle>
																</lockup>`;
													}
												}).join("");
												
							tvml += `			</section>
											</grid>										
										</relatedContent>
									</listItemLockup>`;
									
						callback(null, tvml);
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
									.redText {
										color: rgb(255, 0, 0);
									}
									.showTextOnHighlight {
									  tv-text-highlight-style: show-on-highlight;
									}
									.scrollTextOnHighlight {
									  tv-text-highlight-style: marquee-on-highlight;
									}
									.showAndScrollTextOnHighlight {
									  tv-text-highlight-style: marquee-and-show-on-highlight;
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
};
