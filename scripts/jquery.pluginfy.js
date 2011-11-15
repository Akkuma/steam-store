//Wrap in a closure to secure $ for jQuery
(function( $ ) {
	var plugins = {};
    //name is the name of your plugin
    $.pluginfy = function( prototype ) {
		var name = prototype._name;
		plugins[name] = function () {};
		
		var plugin = plugins[name];
		plugin.prototype = prototype;
		
        //Create the prototype function for the plugin
        $.fn[name] = function( options ) {
 
            //args isset to everything passed in after options item
            var args = Array.prototype.slice.call( arguments , 1 );
 
            //Don't waste time if there are no matching elements
            if( this.length ) {
 
                //Support chaining by returning this
                return this.each( function() {
 
                    /*
                     * Retrieve the instance from $.data() OR create the instance, _init() it, and store that instance in $.data()
                     * Here your plugin is assumed to live in namespace.plugins.name
                     * Look in the samples folder for a namespaced example
                     */
                    var instance = $.data( this , name ) 
					
					if (!instance) {
						var pluginInst = new plugin();
						pluginInst.$element = $(this);
						pluginInst.options = $.extend(true, {}, plugin.prototype.options, options);
						
						instance = $.data( this , name , pluginInst._init() );
					}
                    
					//If the first arg is a string we assume you are calling a method inside the plugin instance
                    if( typeof options === "string" ){
 
                        //underscored methods are "private" (similar to jQuery UI's $.widget we allow this to make methods not availble via public api)
                        options = options.replace( /^_/ , "" );
 
                        //Check if underscore filtered method exists
                        if( instance[options] ) {
 
                            //Call method with args
                            instance[options].apply( instance , args );
                        }
                    }
                });
            }
        };
    };
})( jQuery );