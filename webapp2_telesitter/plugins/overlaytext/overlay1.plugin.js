// Use IIFE (Immediately Invoked Function Expression) to wrap the plugin to not pollute global namespace with whatever is defined inside here
(function() {
    // Init function called by the PluginService when plugin is loaded
    function load(participants$, conferenceDetails$) {}
    

	// context menu item functions
    function renameParticipant(participant) {
       
      //var p = "/participants/" + participant.uuid + "/overlaytext";
      //console.log(p);
      //PEX.pluginAPI.sendRequest(p,{"text": "Simo"});
      PEX.pluginAPI.openTemplateDialog({
        title: 'Rename Participant',
        body: `<div>
              <input id="NewOverlaytext" class="pex-text-input" placeholder="Type the new overlay text here" autofocus />
              <button class="dialog-button buttons green-action-button" style="margin-top: 40px" id="NewOverlaytextButton">rename</button>
              </div>`
        //body: '<div><input type="text" id="NewOverlaytext"></input><button class="dialog-button blue-action-button">Rename</button>'
        /*body: '<input type="text" id="NewOverlaytext"></input><button class="dialog-button blue-action-button" onclick="PEX.pluginAPI.sendRequest(p,{text: document.getElementById(`newName`).value});">Rename</button>'
        
        //body: '<input type="text" id="newName"></input><button class="dialog-button blue-action-button" onclick="PEX.pluginAPI.sendRequest(`/participants/${participant.uuid}/overlaytext`,{text: document.getElementById(`newName`).value});">Rename</button>'
        <script>
        function submitChange()
        {
          console.log("###############################################");
          var p = "/participants/" + participant.uuid + "/overlaytext";
          console.log(p);
          var newName = document.getElementById("newName").value;
          PEX.pluginAPI.sendRequest(p,{"text": newName});
        }
        </script></div>`*/
        }).then(dialogRef => {
          //already after viewInit from previous example so we can execute code directly, don't need to do any additional stuff here
          document.getElementById('NewOverlaytextButton').addEventListener('click', () => 
                            submitChange(document.getElementById('NewOverlaytext')
                            .value, participant.uuid, dialogRef
                            )
                            );
                 
                          
          //But we can still subscribe to the close event
          dialogRef.close$.subscribe(() => {
              //
          });
        });
  
          // or use the dialogRef.close function
          /*document
              .getElementById('NewOverlaytextButton')
              .addEventListener('click', event => dialogRef.close());*/
        }
     
      
    function submitChange(newName, p, ref)
    {
      console.log("####################submitChange######################");
      var pUrl = "/participants/" + p + "/overlaytext";
      //console.log(p);
      //var newName = document.getElementById("NewOverlaytext").value;
      window.PEX.pluginAPI.sendRequest(pUrl,{"text": newName});
      console.log("####################submitChange###########after###########");
      ref.close();
      
    }
    

    // unload / cleanup function
    function unload() {
        // clean up any globals or other cruft before being removed before i get killed.
        console.log('unload layout plugin');
    }
	
	// Register our plugin with the PluginService - make sure id matches your package.json
    PEX.pluginAPI.registerPlugin({
        id: 'overlay1-plugin-1.0',
        load: load,
        unload: unload,
        renameParticipant: renameParticipant
    });
})(); // End IIFE
					   
					   
