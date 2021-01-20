// Use IIFE (Immediately Invoked Function Expression) to wrap the plugin to not pollute global namespace with whatever is defined inside here
(function() {


    var vmr;
    var displayname;
    var confUrl;
    var mainPexRTC;

    // Init function called by the PluginService when plugin is loaded
    function load(participants$, conferenceDetails$) {


      window.PEX.actions$.ofType('[Conference] Connect Success').subscribe((action) => { 
        
        this.vmr = action.payload.alias; 
        this.displayname = action.payload.displayName;

      });

    }
    
	// context menu item functions
    function smsInvite(participant) {
       
      confUrl = window.location.href;
      getPin();
      PEX.pluginAPI.openTemplateDialog({
        title: 'Send an SMS message',
        body: `<div>
              <input id="PhoneNumber" type="tel" class="pex-text-input" placeholder="Please type the phone number here: +1XXXXXXXXX" pattern="[+0-9]*" required autofocus />
              <p>
              <textarea id="InviteMessage" class="pex-text-input" rows="4"> Please join this meeting: ${confUrl}&pin=${mainPexRTC.pin} . ${this.displayname} </textarea>
              <button class="dialog-button buttons green-action-button" style="margin-top: 40px" id="SMSButton">send</button>
              </div>`
        
        }).then(dialogRef => {
          //already after viewInit from previous example so we can execute code directly, don't need to do any additional stuff here
          document.getElementById('SMSButton').addEventListener('click', () => 
                            submitChange(document.getElementById('PhoneNumber')
                            .value, document.getElementById('InviteMessage').value, dialogRef
                            )
                            );
                 
            //<input id="InviteMessage" class="pex-text-input" value="Please join this meeting: https://10.0.0.211/webapp/conference/${this.vmr} . ${this.displayname} " />              
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
     
      
    function submitChange(number, msg, ref)
    {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Basic QUM0Nzk1ZDRiMzJjZjQwMDg1ZjFiYTU1OGY5NWQyNzFmYjplYmM3YTAxOGExZjhkNWE0N2E1MjdmY2YyNmZiMGNjOQ==");
      //myHeaders.append("Content-Type", "multipart/form-data; boundary=--------------------------287964209461749883709774");

      console.log("###################### msg #################: ", msg);
      console.log("###################### number #################: ", number);
      var formdata = new FormData();
      formdata.append("Body", msg);
      formdata.append("To", number);
      formdata.append("From", "+19382225772");

      console.log("###################### formdata #################: ", formdata);

      var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
};

console.log("###################### requestOp #################: ", requestOptions);

fetch("https://api.twilio.com/2010-04-01/Accounts/AC4795d4b32cf40085f1ba558f95d271fb/Messages.json", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
      //ref.close();

    }
    

    function getPin()
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
        id: 'sms-plugin-1.0',
        load: load,
        unload: unload,
        smsInvite: smsInvite
    });
})(); // End IIFE
					   
					   
