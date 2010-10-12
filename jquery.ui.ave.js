(function( $ ) {
  $.widget('ui.ave', {
   options: {

   },
   _create: function() {
     var controls = $('<div class="controls"></div>').insertAfter(this.element).slider({values: [0, 0, 0], step:0.1});
     $(controls.children()[0]).addClass('playhead');
     $(controls.children()[1]).addClass('clip_in');
     $(controls.children()[2]).addClass('clip_out');
     $(this.element).bind('loadedmetadata', function() {
         controls.slider('option', 'max', $(this).get(0).duration);
        controls.slider('values', [$(this).get(0).currentTime, $(this).attr('data-clip_in'), $(this).attr('data-clip_out')]);
     });

     $(this.element).bind('ave:update', function() {
        controls.slider('values', [$(this).get(0).currentTime, $(this).attr('data-clip_in'), $(this).attr('data-clip_out')]);
     });
      $(this.element).bind('timeupdate', function() { 
	if($('.playhead.ui-state-active', this.element).length == 0) {      
	  values = controls.slider('values');
          controls.slider('values', [$(this).get(0).currentTime, values[1], values[2]]);
	} 
      });

      controls.bind('slide', {context: this}, function(event, ui) {
	values = $(this).slider('values');
	if(values[2] < (values[1] - 1)) {
	  return false;
	}
	if(values[0] < values[1]) {
		$(this).slider('values', [values[1], values[1], values[2]]);
		return false;
	}
	if(values[0] > values[2]) {
	  $(this).slider('values', [values[2], values[1], values[2]]);
	  return false;
	}
         
      });

     controls.bind('slidechange', {context: this}, function(event, ui) {
        if(typeof event.originalEvent == 'undefined') {
          return;
	}

	values = $(this).slider('values');
	
	if($('.playhead.ui-state-focus', this.element).length != 0) {      
	  event.data.context.element.get(0).currentTime = values[0];
	}

	if(values[2] < values[1]) {
            values[2] = values[1];
          $(this).slider('values', [values[0], values[1], values[2]]);
	}

	  $(event.data.context.element).attr('data-clip_in', values[1]);
	  $(event.data.context.element).attr('data-clip_out', values[2]);

     });
   },
   destroy: function() {

   },
   _setOption: function(option, value) {
     $.Widget.prototype._setOption.apply( this, arguments );  

   }
  });
})(jQuery);
