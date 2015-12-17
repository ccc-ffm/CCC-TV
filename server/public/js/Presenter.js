/*
  Presenter.js
  CCC-TV

  Contributors: Kris Simon

  ISC 2015 aus der Technik.

Abstract:
Templates can be displayed to the user via three primary means:
	- pushing a document on the stack
	- associating a document with a menu bar item
	- presenting a modal
*/

var Presenter = {

    /**
     * @description This function presents a document. 
     * The document can be presented on screen by adding to to the documents array
     * of the navigationDocument. The navigationDocument allows you to manipulate
     * the documents array with the pushDocument, popDocument, replaceDocument, and
     * removeDocument functions. 
     *
     * You can replace an existing document in the navigationDocumetn array by calling 
     * the replaceDocument function of navigationDocument. replaceDocument requires two
     * arguments: the new document, the old document.
     * @param {Document} xml - The XML document to push on the stack
     */
    defaultPresenter: function(xml) {
        if(this.loadingIndicatorVisible) {
            navigationDocument.replaceDocument(xml, this.loadingIndicator);
            this.loadingIndicatorVisible = false;
        } else {
            navigationDocument.pushDocument(xml);
        }
    },

    /**
     * @description This function presents a documents as modal.
     * You can present and manage a document in a modal view by using the pushModal() and
     * removeModal() functions. Only a single document may be presented as a modal at
     * any given time. Documents presented in the modal view are presented in fullscreen
     * with a semi-transparent background that blurs the document below it.
     *
     * @param {Document} xml - The XML document to present as modal
     */
    modalDialogPresenter: function(xml) {
        navigationDocument.presentModal(xml);
    },

    /**
     * @description This function presents documents within a menu bar.
     * Each item in the menu bar can have a single document associated with it. To associate
     * document to you an item you use the MenuBarDocument feature.
     *
     * Menu bar elements have a MenuBarDocument feature that stores the document associated
     * with a menu bar element. In JavaScript you access the MenuBarDocument by invoking the 
     * getFeature function on the menuBar element. 
     *
     * A feature in TVMLKit is a construct for attaching extended capabilities to an
     * element. See the TVMLKit documentation for information on elements with available
     * features.
     *
     * @param {Document} xml - The XML document to associate with a menu bar element
     * @param {Element} ele - The currently selected item element
     */
    menuBarItemPresenter: function(xml, ele) {
        /*
        To get the menu bar's 'MenuBarDocument' feature, we move up the DOM Node tree using
        the parentNode property. This allows us to access the the menuBar element from the 
        current item element.
        */
        var feature = ele.parentNode.getFeature("MenuBarDocument");

        if (feature) {
            /*
            To retrieve the document associated with the menu bar element, if one has been 
            set, you call the getDocument function the MenuBarDocument feature. The function
            takes one argument, the item element.
            */
            var currentDoc = feature.getDocument(ele);
                        
            /*
            To present a document within the menu bar, you need to associate it with the 
            menu bar item. This is accomplished by call the setDocument function on MenuBarDocument
            feature. The function takes two argument, the document to be presented and item it 
            should be associated with.

            In this implementation we are only associating a document once per menu bar item. You can 
            associate a document each time the item is selected, or you can associate documents with 
            all the menu bar items before the menu bar is presented. You will need to experimet here
            to balance document presentation times with updating the document items.
            */
            if (!currentDoc) {
                feature.setDocument(xml, ele);
            }
        }
    },

    /**
     * @description This function handles the select event and invokes the appropriate Video
     *
     * @param {Event} event - The select event
     */
    loadVideo: function(event) {
    	var self = this,
            ele = event.target,
            file = ele.getAttribute("file"),
            action = ele.getAttribute("action"),
            content = ele.innerHTML
            ;
        
        if(action == 'play-video'){
			var player = new Player();
			var playlist = new Playlist();
			var mediaItem = new MediaItem("video", file);
 
			player.playlist = playlist;
			player.playlist.push(mediaItem);
			player.present();
			player.play();
        }
        
        // Show full video description
        if(action == 'show-description'){
			var descriptionTemplate = `<?xml version="1.0" encoding="UTF-8" ?>
				<document>
				  <descriptiveAlertTemplate>
					<description>
					  ${content}
					</description>
					<row>
						<button>
						  <text>OK</text>
						</button>
					</row>
				  </descriptiveAlertTemplate>
				</document>`;

			var parser = new DOMParser();
			var descriptionDoc = parser.parseFromString(descriptionTemplate, "application/xml");
			descriptionDoc.addEventListener("select", function(){
				navigationDocument.dismissModal();
			});  
			self.modalDialogPresenter(descriptionDoc);
        }  
    },
		

    /**
     * @description This function handles the select event and invokes the appropriate 
     * product page
     *
     * @param {Event} event - The select event
     */
    loadProduct: function(event) {
    	var self = this,
            ele = event.target,
            templateURL = ele.getAttribute("template"),
            presentation = ele.getAttribute("presentation"),
            file = ele.getAttribute("file"),
            eventurl = ele.getAttribute("eventurl")
            ;

		if(presentation == 'videoDialogPresenter' && file){
 			var objectLoader = new ObjectLoader();
 			async.parallel({
				product: function getEvent(callback){
        			objectLoader.getResource(file, function(err, contentmodel){
	    				callback(err, contentmodel);
	    			})
				},
				more: function getMoreVideo(callback){
					objectLoader.getResource(eventurl, function(err, eventmodel){
						callback(err, eventmodel);
					});
				}
			},
			function(err, results){
 				if(err){
 					self.modalDialogPresenter.call(self, `<?xml version="1.0" encoding="UTF-8" ?>
						<document>
						  <alertTemplate>
							<title>Error</title>
							<description>the Resource is not available</description>
						  </alertTemplate>
						</document>`);
					return;
 				}
 				
 				var model = results.product;
 				model.more = results.more.events;
 				
				resourceLoader.loadResource(resourceLoader.BASEURL+'/templates/Product.xml.js', model, 
					 function(resource) {
						if (resource) {
							var doc = self.makeDocument(resource);				
							self.defaultPresenter.call(self, doc);							
							doc.addEventListener("select", self.loadVideo.bind(self) );  
							doc.addEventListener("select", self.loadProduct.bind(self) );
						}
					 }
				 ); 				
			});
		}
    },

    /**
     * @description This function handles the select event and invokes the appropriate presentation method.
     * This is only one way to implent a system for presenting documents. You should determine
     * the best system for your application and data model.
     *
     * @param {Event} event - The select event
     */
     loadcnt: 0,
     load: function(event) {

        var self = this,
            ele = event.target,
            templateURL = ele.getAttribute("template"),
            presentation = ele.getAttribute("presentation"),
            section = ele.getAttribute("section");
		
		self.loadcnt++;
        /*
        Check if the selected element has a 'template' attribute. If it does then we begin
        the process to present the template to the user.
        */
        if (templateURL) {
            /*
            Whenever a user action is taken you need to visually indicate to the user that
            you are processing their action. When a users action indicates that a new document
            should be presented you should first present a loadingIndicator. This will provide
            the user feedback if the app is taking a long time loading the data or the next 
            document.
            Even so if the application is started for the first time, because it takes some time 
            to fire up the cache. 
            */
            
            if(self.loadcnt < 2){
	            self.showLoadingIndicator('');
            } else {
            	self.showLoadingIndicator(presentation);
            }

            resourceLoader.loadResource(templateURL, section, 
                function(resource) {
                    if (resource) {
                        /*
                        The XML template must be turned into a DOMDocument in order to be 
                        presented to the user. See the implementation of makeDocument below.
                        */
                        var doc = self.makeDocument(resource);
                        
                        /*
                        Event listeners are used to handle and process user actions or events. Listeners
                        can be added to the document or to each element. Events are bubbled up through the
                        DOM heirarchy and can be handled or cancelled at at any point.

                        Listeners can be added before or after the document has been presented.

                        For a complete list of available events, see the TVMLKit DOM Documentation.
                        */
                        doc.addEventListener("select", self.load.bind(self));
                        doc.addEventListener("highlight", self.load.bind(self));
						
						// Second listener for video content.
						doc.addEventListener("select", self.loadProduct.bind(self) );  
						
// 						doc.addEventListener("addItem", function(){
// 							console.log("XXX");
// 						});
						var foo = doc.getElementById("foo");

						if (foo) {
							var lookup = doc.createElement("lockup");
							lookup.setAttribute("presentation", "videoDialogPresenter");
							
							var img = doc.createElement("img");
							img.setAttribute("width", "308");
							img.setAttribute("height", "174");
							img.setAttribute("src", "");
							
							var title = doc.createElement("title");
							var titletext = doc.createTextNode("Foo");
							
							title.appendChild(titletext);
							lookup.appendChild(img);
							lookup.appendChild(title);
							foo.appendChild(lookup);
						}					
						
                        /*
                        This is a convenience implementation for choosing the appropriate method to 
                        present the document. 
                        */
                        if (self[presentation] instanceof Function) {
                            self[presentation].call(self, doc, ele);
                        } else {
                            self.defaultPresenter.call(self, doc);
                        }
                        self.removeLoadingIndicator();
                    }
                }
            );
        }
    },

    /**
     * @description This function creates a XML document from the contents of a template file.
     * In this example we are utilizing the DOMParser to transform the Index template from a 
     * string representation into a DOMDocument.
     *
     * @param {String} resource - The contents of the template file
     * @return {Document} - XML Document
     */
    makeDocument: function(resource) {
        if (!Presenter.parser) {
            Presenter.parser = new DOMParser();
        }

        var doc = Presenter.parser.parseFromString(resource, "application/xml");
        return doc;
    },
    
    addVideoItem: function(id, data){
//     	console.log("+++ADD VIDEO ITEM+++");
//     	Log.Info("+++ADD VIDEO ITEM+++");
//     	
//     	console.log( "Presenter", Presenter);
//     	console.log( "Id", id);
//     	console.log( "Data", data);
//     	
//     	_.map(navigationDocument.documents, function(doc){
//     		console.log( "** ", doc);
//     	});
    	
    	// list_${item.acronym}
    	
// 
// 						tvml += _.map( _.sortBy(item.events, function(i){ return i.date}).reverse(), function(event){
// 							cntEvent++;
// 							var tvml = `<lockup presentation="videoDialogPresenter" file="${event.url}" eventurl="${item.url}">
// 											<img src="${event.poster_url}" width="308" height="174" />
// 											<title class="whiteText">${_.escape(event.title)}</title>
// 										</lockup>`;
// 										
// 							return tvml;
// 						}).join('');
// 						    	
    	
    },

    /**
     * @description This function handles the display of loading indicators.
     *
     * @param {String} presentation - The presentation function name
     */
    showLoadingIndicator: function(presentation) {
        /*
        You can reuse documents that have previously been created. In this implementation
        we check to see if a loadingIndicator document has already been created. If it 
        hasn't then we create one.
        */
        if (!this.loadingIndicator) {
            this.loadingIndicator = this.makeDocument(this.loadingTemplate);
        }
        
        /* 
        Only show the indicator if one isn't already visible and we aren't presenting a modal.
        */
        if (!this.loadingIndicatorVisible && presentation != "modalDialogPresenter" && presentation != "menuBarItemPresenter") {
            navigationDocument.pushDocument(this.loadingIndicator);
            this.loadingIndicatorVisible = true;
        }
    },

    /**
     * @description This function handles the removal of loading indicators.
     * If a loading indicator is visible, it removes it from the stack and sets the loadingIndicatorVisible attribute to false.
     */
    removeLoadingIndicator: function() {
        if (this.loadingIndicatorVisible) {
            navigationDocument.removeDocument(this.loadingIndicator);
            this.loadingIndicatorVisible = false;
        }
    },

    /**
     * @description Instead of a loading a template from the server, it can stored in a property 
     * or variable for convenience. This is generally employed for templates that can be reused and
     * aren't going to change often, like a loadingIndicator.
     */
    loadingTemplate: `<?xml version="1.0" encoding="UTF-8" ?>
        <document>
          <loadingTemplate>
            <activityIndicator>
              <text>Loading...</text>
            </activityIndicator>
          </loadingTemplate>
        </document>`
}
