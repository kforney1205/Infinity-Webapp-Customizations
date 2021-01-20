/* 
Choose a interpretation language
For each language option, add <option value="user uri portion">Option name shown to user</option> under the <select id="languages"> tag
To globally set the host or domain portion of the URI, set sipDomain = '@yourdomain.com'
If you want different domains per language, enter the full URI in <option value=""> instead of just the user portion, like this <option value="spanish@yourcompany.com"> AND make sure to set sipDomain = ''
*/

// Use IIFE (Immediately Invoked Function Expression) to wrap the plugin to not pollute global namespace with whatever is defined inside here
(function() {
    // Init function called by the PluginService when plugin is loaded
    function load(participants$) {
        //participants$.subscribe(participants => {}
    }

    // Function that is called when the plugin button is clicked
    function actionFunction() {
        
        var sipDomain = ''

        PEX.pluginAPI
            .openTemplateDialog({
                title: 'Request Interpreter Service',
                body:   `Select a language <br><br>  
                        <select id="languages"> 
                            <option value="spanish">Spanish</option> 
                            <option value="french">French</option> 
                            <option value="chinese">Chinese</option>
                        </select>
                        <br><br>
                        Begin Interpreter Request
                        <br>
                        <button class="dialog-button buttons green-action-button" style="margin-top: 40px" id="selectLanguageButton">Connect</button>`
            })

            .then(dialogRef => {
                if (localStorage.pexlanguages) {
                    document.getElementById(
                        'languages'
                    ).value = localStorage.pexlanguages;
                }

                document
                    .getElementById('selectLanguageButton')
                    .addEventListener('click', event => {
                        event.preventDefault();
                        event.stopPropagation();

                        const value = document.getElementById(
                            'languages'
                        ).value;
                        if (!value) {
                            return;
                        }

                        localStorage.pexlanguages = value;
                        selectedLanguage = document.querySelector('#languages')
                        var alias = selectedLanguage.value + sipDomain
                        var protocol = 'auto';

                        connecting = true;

                        window.PEX.pluginAPI.dialOut(
                            alias,
                            protocol,
                            'guest',
                            value => {
                                if (value.result.length === 0) {
                                    connecting = false;
                                    document.getElementById(
                                        'languages'
                                    ).style.border = '2px solid red';
                                    document.getElementById(
                                        'languages'
                                    ).value = '';
                                    document.getElementById(
                                        'languages'
                                    ).placeholder = 'check alias and retry';
                                    localStorage.pexlanguages =
                                        '';
                                } else {
                                    connecting = false;
                                    uuid = value.result[0];
                                    dialogRef.close();
                                    //console.log("UUID= " + uuid)
                                }
                            },
                            {
                                streaming: false
                            }
                        );
                    });
        });
    }

    // unload / cleanup function
    function unload() {
        // clean up any globals or other cruft before being removed before i get killed.
    }

    // Register our plugin with the PluginService - make sure id matches your package.json
    PEX.pluginAPI.registerPlugin({
        id: 'select-interpreter-plugin-1.0',
        load: load,
        unload: unload,
        actionFunction: actionFunction,
    });
})(); // End IIFE

