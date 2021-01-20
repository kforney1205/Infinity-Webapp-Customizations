// Use IIFE (Immediately Invoked Function Expression) to wrap the plugin to not pollute global namespace with whatever is defined inside here
(function() {
    // Init function called by the PluginService when plugin is loaded
    var state = false;
    
    function load(participants$, conferenceDetails$) {

    }
	var fs = false;
	// context menu item functions
    function makeFullscreen(participant) {

            var docElm = document.documentElement;

            if (!state)
            {
                if (docElm.requestFullscreen) {
                  docElm.requestFullscreen();
              }
              else if (docElm.mozRequestFullScreen) {
                  docElm.mozRequestFullScreen();
              }
              else if (docElm.webkitRequestFullScreen) {
                  docElm.webkitRequestFullScreen();
              }
              else if (docElm.msRequestFullscreen) {
                  docElm.msRequestFullscreen();
              }
              state = true;
            }
            else{
                if (document.exitFullscreen) {
                  document.exitFullscreen();
              }
              else if (document.mozCancelFullScreen) {
                  document.mozCancelFullScreen();
              }
              else if (document.webkitCancelFullScreen) {
                  document.webkitCancelFullScreen();
              }
              else if (document.msExitFullscreen) {
                  document.msExitFullscreen();
              }
              state = false;
            }
    
    
    }
    // unload / cleanup function
    function unload() {
        // clean up any globals or other cruft before being removed before i get killed.
        console.log('unload layout plugin');
    }
	
	// Register our plugin with the PluginService - make sure id matches your package.json
    PEX.pluginAPI.registerPlugin({
        id: 'fullscreen-plugin-1.0',
        load: load,
        unload: unload,
        makeFullscreen: makeFullscreen
    });
})(); // End IIFE
					   
					   
