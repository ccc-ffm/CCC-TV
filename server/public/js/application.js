/*
  application.js
  CCC-TV

  Contributors: Kris Simon

  ISC 2015 aus der Technik.

Abstract:
  This is the entry point to the CCC-TV application and handles the initial loading of 
  required JavaScript files.
*/

var resourceLoader;

/**
 * @description The onLaunch callback is invoked after the application JavaScript 
 * has been parsed into a JavaScript context. The handler is passed an object 
 * that contains options passed in for launch. These options are defined in the
 * swift or objective-c client code. Options can be used to communicate to
 * your JavaScript code that data and as well as state information, like if the 
 * the app is being launched in the background.
 *
 * The location attribute is automatically added to the object and represents 
 * the URL that was used to retrieve the application JavaScript.
 */
App.onLaunch = function(options) {
    var javascriptFiles = [
        `${options.BASEURL}/js/ResourceLoader.js`,
        `${options.BASEURL}/js/ObjectLoader.js`,
        `${options.BASEURL}/js/Presenter.js`,
        `${options.BASEURL}/js/underscore.js`,
        `${options.BASEURL}/js/async.js`
    ];

	// demo ----
	// console.log( settingswrapper );
	// var text = settingswrapper.getItem();
	// console.log( text );

    /**
     * evaluateScripts is responsible for loading the JavaScript files neccessary
     * for you app to run. It can be used at any time in your apps lifecycle.
     * 
     * @param - Array of JavaScript URLs  
     * @param - Function called when the scripts have been evaluated. A boolean is
     * passed that indicates if the scripts were evaluated successfully.
     */
    evaluateScripts(javascriptFiles, function(success) {
        if (success) {
            resourceLoader = new ResourceLoader(options.BASEURL);
			//createAlert(`${options.BASEURL}/index.tvjs`);
            var index = resourceLoader.loadResource(`${options.BASEURL}/index.tvjs`, 
            	"index",
                function(resource) {
                    var doc = Presenter.makeDocument(resource);
                    doc.addEventListener("select", Presenter.load.bind(Presenter));
                    navigationDocument.pushDocument(doc);
                });
        } else {
            var alert = createAlert("Evaluate Scripts Error", "There was an error attempting to evaluate the external JavaScript files.\n\n Please check your network connection and try again later.");
            navigationDocument.presentModal(alert);
            throw ("Playback Example: unable to evaluate scripts.");
        }
    });
}

/**
 * This convenience funnction returns an alert template, which can be used to present errors to the user.
 */
var createAlert = function(title, description) {  
    var alertString = `<?xml version="1.0" encoding="UTF-8" ?>
        <document>
          <alertTemplate>
            <title>${title}</title>
            <description>${description}</description>
          </alertTemplate>
        </document>`

    var parser = new DOMParser();
    var alertDoc = parser.parseFromString(alertString, "application/xml");
    return alertDoc
}