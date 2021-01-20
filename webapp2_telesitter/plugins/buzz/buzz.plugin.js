// Use IIFE (Immediately Invoked Function Expression) to wrap the plugin to not pollute global namespace with whatever is defined inside here
(function() {

  var state$ = window.PEX.pluginAPI.createNewState({});
  var selfUUID;
  var buzzState = false;

    // Init function called by the PluginService when plugin is loaded
    function load(participants$, conferenceDetails$) {

   window.PEX.actions$.ofType('[Conference] Set Self UUID')
  .subscribe((action) => { selfUUID = action.payload;});

  participants$.subscribe(participants => {
    var state;
    if (
        participants.filter(
            participant =>
                participant.uuid === selfUUID && participant.buzzTime > 0
        ).length > 0
    ) {
      buzzState = true;
        state = {
            icon: 'toolbarBuzzOn.svg#toolbar-buzz-on',
            label: 'Lower my hand'
        };
    } else {
      buzzState = false;
        state = {
            icon: 'toolbarBuzzOff.svg#toolbar-buzz-off',
            label: 'Raise my hand'
        };
    }

    if (state) {
        state$.next(state);
    }
});
   
      
    }

	// context menu item functions
    function buzz(participants$) {
          if(!buzzState)
          {
            var pUrl = "/participants/" + selfUUID + "/buzz";
            window.PEX.pluginAPI.sendRequest(pUrl);
          }
          else
          {
            var pUrl = "/participants/" + selfUUID + "/clearbuzz";
            window.PEX.pluginAPI.sendRequest(pUrl);
          }
    }
    // unload / cleanup function
    function unload() {
        // clean up any globals or other cruft before being removed before i get killed.
        console.log('unload layout plugin');
    }
	
	// Register our plugin with the PluginService - make sure id matches your package.json
    PEX.pluginAPI.registerPlugin({
        id: 'buzz-plugin-1.0',
        load: load,
        unload: unload,
        buzz: buzz,
        state$: state$
    });
})(); // End IIFE
					   
					   
