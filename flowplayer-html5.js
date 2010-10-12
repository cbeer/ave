function flowplayer_html5_compatibility_mode() {

//emulate legacy getter/setter API using ES5 APIs
try {
   if (!Object.prototype.__defineGetter__ &&
        Object.defineProperty({},"x",{get: function(){return true}}).x) {
      Object.defineProperty(Object.prototype, "__defineGetter__",
         {enumerable: false, configurable: true,
          value: function(name,func)
             {Object.defineProperty(this,name,
                 {get:func,enumerable: true,configurable: true});
      }});
      Object.defineProperty(Object.prototype, "__defineSetter__",
         {enumerable: false, configurable: true,
          value: function(name,func)
             {Object.defineProperty(this,name,
                 {set:func,enumerable: true,configurable: true});
      }});
   }
} catch(defPropException) {/*Do nothing if an exception occurs*/};

	api = this;
	element = this.getParent();

	element.play = function() { api.play(); }
	element.pause = function() { api.pause(); }
	element.initialTime = 0;
	element.__defineGetter__('currentTime', function() { return api.getTime() });
	element.__defineSetter__('currentTime', function(i) { api.seek(i); });
	element.__defineGetter__('duration', function() { return api.getClip().metaData.duration });

	t_metadata = null;

        api.getCommonClip().onBegin(function() { if(t_metadata == null) { t_metadata = setInterval(function() { if(typeof api.getClip().duration != 'undefined') { $(element).trigger('loadedmetadata'); clearInterval(t_metadata); } }, 500); } });
        api.getCommonClip().onStart(function() { $(element).trigger('play'); });

		
        t = null;

	api.getCommonClip().onStart(function() { if(t == null) { t = setInterval("flowplayer_html5_tick()", 250 ); } });
	api.getCommonClip().onResume(function() { if(t == null) { t = setInterval("flowplayer_html5_tick()", 250 ); } });
	api.getCommonClip().onStop(function() { clearInterval(t); t = null; });
	api.getCommonClip().onPause(function() { clearInterval(t); t = null; });
}

function flowplayer_html5_tick() {
  $f("*").each(function() { $(this.getParent()).trigger('timeupdate'); });
}
