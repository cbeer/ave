/**
 * jQuery.slider_highlight - jQuery UI slider range highlighting
 * Written by Chris Beer <chris_beer@wgbh.org>
 * Licensed under the MIT License.
 * Date: 2009/11/01
 *
 * @author Chris Beer
 * @version 0.1
 *
 * Add this css style: .slider_highlight { position: absolute; height: 100%; background-color: rgba(0,0,255, 0.5);}
 **/

(function($) {
  $.fn.slider_highlight = function(kind, options) {
    options = $.extend({
	        element: null,
		event: null,
		show: function() { $(this).show(); },
		hide: function() { $(this).hide(); }
		}, options);

    if(options.highlight == null && $('.highlight_' + kind, this).length == 0) {
      options.highlight = $('<div class="slider_highlight highlight_' + kind +'"></div>').appendTo($(this));
    }

    if(options.event == null) {
      options.event = 'highlight:' + kind;
    }

    options.hide.apply(options.highlight);
    
    $(this).bind(options.event, function(event, data) {
      if(typeof data == 'undefined' || data.begin == data.end) { 
	options.hide.apply(options.highlight);
        return; 
      }

      $(options.highlight).css({
	left: (100*data.begin/$(this).slider('option', 'max')) + "%", 
	width: 100*(data.end-data.begin)/$(this).slider('option', 'max') + "%"
      })
      
      options.show.apply(options.highlight);
    });
  }
})(jQuery);
