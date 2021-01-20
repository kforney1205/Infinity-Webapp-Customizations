/* 
Choose a interpretation cart
For each cart option, add <option value="user uri portion">Option name shown to user</option> under the <select id="carts"> tag
To globally set the host or domain portion of the URI, set sipDomain = '@yourdomain.com'
If you want different domains per cart, enter the full URI in <option value=""> instead of just the user portion, like this <option value="spanish@yourcompany.com"> AND make sure to set sipDomain = ''
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
                title: 'Connect to a Medical Cart',
                body:   `Select a Cart <br><br>  
                        <select id="carts"> 
                            <option value="MedicalCart01">Main Trauma Center, Floor 2, Cart 1</option> 
                            <option value="Exam101">Main Trauma Center, Floor 5, Cart 3</option> 
                            <option value="MedicalCart01">South Campus, Exam 1</option>
                        </select>
                        <br><br>
                        Click to Begin Session
                        <br>
                        <button class="dialog-button buttons green-action-button" style="margin-top: 40px" id="selectcartButton">Connect</button>`
            })

            .then(dialogRef => {
                if (localStorage.pexcarts) {
                    document.getElementById(
                        'carts'
                    ).value = localStorage.pexcarts;
                }

                document
                    .getElementById('selectcartButton')
                    .addEventListener('click', event => {
                        event.preventDefault();
                        event.stopPropagation();

                        const value = document.getElementById(
                            'carts'
                        ).value;
                        if (!value) {
                            return;
                        }

                        localStorage.pexcarts = value;
                        selectedcart = document.querySelector('#carts')
                        var alias = selectedcart.value + sipDomain
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
                                        'carts'
                                    ).style.border = '2px solid red';
                                    document.getElementById(
                                        'carts'
                                    ).value = '';
                                    document.getElementById(
                                        'carts'
                                    ).placeholder = 'check alias and retry';
                                    localStorage.pexcarts =
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
        id: 'select-cart-plugin-1.0',
        load: load,
        unload: unload,
        actionFunction: actionFunction,
    });
})(); // End IIFE

