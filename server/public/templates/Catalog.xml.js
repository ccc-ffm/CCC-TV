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
var getData = function(section, callback){
	var url = "https://api.media.ccc.de/public/"+ section;
	objectLoader.getResource(url, function(err, data){
		callback(err, data[section]);
	});
}

var Template = function(section, callback) { 
	var conferencesList = function(callback){
		var cntEvent = 0;
		getData(section, function(err, data){
			var items = _.map(_.sortBy(data, function(d){ return d.updated_at}).reverse(), function(item){ return item; });
			async.map(
				  items
				, function(item, next){
					objectLoader.getResource(item.url, next);
				}
				, function(err, result){
					var result = _.filter(result, function(f){ return f.events.length > 0; });
					var tvml = _.map(
						_.sortBy(result, function(d){ return _.first(d.events).date}).reverse()
						, function(item){
						var tvml = `<listItemLockup>
										<title>${_.escape(item.title)}</title>						
										<decorationLabel>${item.events.length}</decorationLabel>
										<relatedContent>
											<grid>
												<section>`;

						tvml += _.map( _.sortBy(item.events, function(i){ return i.date}).reverse(), function(event){
							cntEvent++;
							var tvml = `<lockup presentation="videoDialogPresenter" file="${event.url}" eventurl="${item.url}">
											<img src="${event.poster_url}" width="308" height="174" />
											<title class="whiteText">${_.escape(event.title)}</title>
										</lockup>`;
										
							return tvml;
						}).join('');
						
						tvml += `				</section>
											</grid>
										</relatedContent>
									</listItemLockup>`;
									
						return tvml;
					}).join('');
					console.log("Event count:", cntEvent);
					callback(err, tvml);
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
