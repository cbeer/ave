(function( $ ) {
  $.fn.ave_sync = function(target, options) {
    context = this;
    defaults = {
      trigger: { 'class': 'ave_sync_trigger', 'content': '[sync]' },
      master: 'ave_sync_master',
      activate: function() {
        $(this).addClass('active');
      },
      deactivate: function() {
        $(this).removeClass('active');
      }
    };               

    var settings = $.extend(true, defaults, options);

    $(target).attr('data-ave_sync', true);
    $(target).data(settings['master'], this.get(0));
      $('[smil\\:begin]').each(function() {
         $(this).attr('data-ave_tc', true);
      });

      $('[data-ave_tc]').each(function() {
	if($('.' + settings['trigger']['class'], this).length > 0) {
          return;
	}

	if(typeof $(this).attr('smil:end') == 'undefined') {
           $(this).attr('smil:end', $(this).next('[data-ave_tc]').attr('smil:begin'));
	}

        $('<div class="' + settings['trigger']['class'] + '">' + settings['trigger']['content'] + '</div>')
	    .prependTo(this)
	    .bind('click', function() { 
	      $(this).closest('[data-ave_sync]').data(settings['master']).currentTime = $(this).parent().attr('smil:begin'); 
            });
      });

      $(this).bind('timeupdate', function() {
	t = this.currentTime      
	  

	settings['deactivate'].apply($('.active', target));  
	active = $('[data-ave_tc]').filter(function() {
          if(t >= parseFloat($(this).attr('smil:begin')) && t < parseFloat($(this).attr('smil:end'))) {
	    return true;
	  }
	});

	settings['activate'].apply(active); 

      });

  }
  
})( jQuery );

