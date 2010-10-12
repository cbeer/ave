(function( $ ) {
  $.fn.ave_clip = function(options) {
    context = this;
    defaults = {
      'clip_in': null,
      'clip_out': null
    };               
    if($.parseQuery && location.hash) {
      params = $.parseQuery(location.hash.substring(1));
      if(params['t']) {
        defaults['clip_in'] = params['t'].split(',')[0]; 
        defaults['clip_out'] = params['t'].split(',')[1]; 
      }
    }

    var settings = $.extend(true, defaults, options);

    context.each(function() {
     if(typeof $(this).attr('data-ave_clip') == 'undefined') {
       $.fn.ave_clip.setup(this, settings);
       $(this).attr('data-ave_clip', true);
     }
    });
  }

  $.fn.ave_clip.initialize = function(obj, settings) {
      $(obj).attr('data-clip_in', settings['clip_in'] || obj.initialTime || 0);
      $(obj).attr('data-clip_out', settings['clip_out'] || obj.duration || 0);
      $(obj).trigger('ave:update');

  }
  
  $.fn.ave_clip.setup = function(obj, settings) {
	  $.fn.ave_clip.initialize(obj, settings); 

      $(obj).bind('loadedmetadata', function() { $.fn.ave_clip.initialize(obj, settings); });

      $(obj).bind('play', function() {
         if(this.currentTime >= parseFloat($(this).attr('data-clip_out')) - 0.2 ) {
           this.currentTime = parseFloat($(this).attr('data-clip_in'));
	 }

         if(this.currentTime < parseFloat($(this).attr('data-clip_in'))) {
           this.currentTime = parseFloat($(this).attr('data-clip_in'));
	 }
      });

      $(obj).bind('timeupdate', function() { 
	if(this.currentTime >= parseFloat($(this).attr('data-clip_out'))) { 
          this.pause();
	  this.currentTime = parseFloat($(this).attr('data-clip_out'));
	} 

	if(this.currentTime < (parseFloat($(this).attr('data-clip_in')) - 0.1)) { 
          this.pause();
	  this.currentTime = parseFloat($(this).attr('data-clip_in'));
	} 
      });

  }
})( jQuery );

