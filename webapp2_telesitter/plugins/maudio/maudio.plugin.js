// Use IIFE (Immediately Invoked Function Expression) to wrap the plugin to not pollute global namespace with whatever is defined inside here
(function() {


  var state$ = window.PEX.pluginAPI.createNewState({});
  var video;
  var vstream;
  var bandwidth;
  var conference;
  var selfUUID;
  var pin;
  var vmr;
  var displayname;
  const video2 = new Audio();  
  var mainPexRTC;

  var rtc = null;

    // Init function called by the PluginService when plugin is loaded
    function load(participants$, conferenceDetails$) {


      window.PEX.actions$.ofType('[Conference] Connect Success').subscribe((action) => { 
        
        this.vmr = action.payload.alias; 
        this.displayname = action.payload.displayName;

      });

      participants$.subscribe(participants => {
        var state;
        if (rtc)
        {
         state = {
             icon: 'maudioOn.svg#maudioOn',
             label: 'Stop live interpretation'
         };
     } else {
         state = {
             icon: 'maudioOff.svg#maudioOff',
             label: 'Start live interpretation'
     };
   }

        if (state) {
            state$.next(state);
        }
    });

     window.PEX.actions$.ofType('[Conference] Disconnect Success').subscribe((action) => { 
    if (rtc)
    {
      rtc.disconnect();
      rtc = null;
    }
    
  });

}
   
    function finalise(event) {
      rtc.disconnect();
      video.src = "";
  }
  
  function remoteDisconnect(reason) {
      cleanup();
      alert(reason);
      window.removeEventListener('beforeunload', finalise);
      window.close();
  }
  
  
  function doneSetup(videoURL, pin_status) {
      console.log("PIN status: " + pin_status);
      rtc.connect(pin);
  }

  function buttonState()
  {
    var state;
    if (rtc)
       {
        state = {
            icon: 'maudioOn.svg#maudioOn',
            label: 'Stop live interpretation'
        };
    } else {
        state = {
            icon: 'maudioOff.svg#maudioOff',
            label: 'Start live interpretation'
    };
  }

  if (state) {
    state$.next(state);
  }
}
  
  function connected(videoURL) {
    
    vstream = video2;
    video2.srcObject = videoURL;
    video2.play();
    rtc.muteAudio(true);
    var vv = document.getElementById("mainVideo");
    let myElement = document.querySelector(".toolbar-audio-bar-fill");
    myElement.style.width = "10%";
    vv.volume = 0.1;  
  
  }

	// context menu item functions
    function multipleAudio(participant) {
       
      //var p = "/participants/" + participant.uuid + "/overlaytext";
      //console.log(p);
      //PEX.pluginAPI.sendRequest(p,{"text": "Simo"});
      PEX.pluginAPI.openTemplateDialog({
        title: 'Live Interpretation',
        body: `<div>
              <select class="pex-text-input" id="maudioInput" name="lang">
              <option value="${this.vmr}_en">English</option>
              <option value="${this.vmr}_de">German</option>
              <option value="${this.vmr}_fr">French</option>
              </select>
              <button class="dialog-button buttons red-action-button" style="margin-top: 40px" id="maudioStopButton">Off</button>
              <button class="dialog-button buttons green-action-button" style="margin-top: 40px" id="maudiotextButton">connect</button>
              </div>`
        
        }).then(dialogRef => {
          //already after viewInit from previous example so we can execute code directly, don't need to do any additional stuff here
          document.getElementById('maudiotextButton').addEventListener('click', () => 
                            submitChange(document.getElementById('maudioInput')
                            .options[document.getElementById('maudioInput').selectedIndex].value, dialogRef, this.displayname
                            )
                            );
          document.getElementById('maudioStopButton').addEventListener('click', () => 
          stopInterpretation(dialogRef
          )
          );
              
          //But we can still subscribe to the close event
          dialogRef.close$.subscribe(() => {
              //
          });
        });
  
          // or use the dialogRef.close function
          
        }
    
    function stopInterpretation(ref)
    {
      disconnectInterpretation(ref);
      var vv = document.getElementById("mainVideo");
      let myElement = document.querySelector(".toolbar-audio-bar-fill");
      myElement.style.width = "100%";
      vv.volume = 1; 
      rtc = null;
      buttonState();
      ref.close(ref);
    }

    
    function disconnectInterpretation(ref)
    {
      if (typeof(MediaStream) !== "undefined" && vstream instanceof MediaStream)
      {
        vstream.pause(); 
      }
      if(rtc)
      {
        rtc.disconnect();
        vstream.src = "";
      }
      
    }
      
    function submitChange(audioVMR, ref, _displayname)
    {
      disconnectInterpretation(ref);
      bandwidth = parseInt("576");
      rtc = new PexRTC();
      window.addEventListener('beforeunload', finalise);

      rtc.onSetup = doneSetup;
      rtc.onConnect = connected;
      rtc.onError = remoteDisconnect;
      rtc.onDisconnect = remoteDisconnect;
      getMainPexRTC();
      console.log("###################### mainPexRTC #################: ", mainPexRTC);
      rtc.makeCall(mainPexRTC.node, audioVMR, _displayname, bandwidth, "audioonly");
      buttonState();

      ref.close();
      
    }

    function getMainPexRTC()
    {
      var objs = []; //store the object references in this array
      var found = false;
      function walkTheObject(obj)
      {
        var keys = Object.keys(obj); // get all own property names of the object

        keys.forEach(function(key) {
          if(found) return;
          var value = obj[key]; // get property value

          //if the property value is an object
          if(value && typeof value === 'object') {

            // if we don´t have this referece
            if(objs.indexOf(value) < 0) {
              objs.push(value); // store the reference
              if((value.constructor) && (value.constructor.name) && (value.constructor.name=="PexRTC")) {
                mainPexRTC=value; 
                found=true;
              }
              walkTheObject(value);
            }
          }
        });
      }

      walkTheObject(window);
      objs = [];

    }

    // unload / cleanup function
    function unload() {
        // clean up any globals or other cruft before being removed before i get killed.
        console.log('unload layout plugin');
    }
	
	// Register our plugin with the PluginService - make sure id matches your package.json
    PEX.pluginAPI.registerPlugin({
        id: 'maudio-plugin-1.0',
        load: load,
        unload: unload,
        multipleAudio: multipleAudio,
        state$: state$
    });
})(); // End IIFE
					   
					   
