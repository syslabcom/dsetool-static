(function ($) { // JavaScript should be compatible with other libraries than jQuery
  Drupal.behaviors.textResize = { // D7 "Changed Drupal.behaviors to objects having the methods "attach" and "detach"."
    attach: function(context) {
      // Which div or page element are we resizing?
      if (text_resize_scope) { // Admin-specified scope takes precedence.
        if ($('#'+text_resize_scope).length > 0) {
          var element_to_resize = $('#'+text_resize_scope); // ID specified by admin
        }
        else if ($('.'+text_resize_scope).length > 0) {
          var element_to_resize = $('.'+text_resize_scope); // CLASS specified by admin
        }
        else {
          var element_to_resize = $(text_resize_scope); // It's just a tag specified by admin
        }
      }
      else { // Look for some default scopes that might exist.
        if ($('DIV.left-corner').length > 0) {
          var element_to_resize = $('DIV.left-corner'); // Main body div for Garland
        }
        else if ($('#content-inner').length > 0) {
          var element_to_resize = $('#content-inner'); // Main body div for Zen-based themes
        }
        else if ($('#squeeze > #content').length > 0) {
          var element_to_resize = $('#squeeze > #content'); // Main body div for Zen Classic
        }
      }
      // Set the initial font size if necessary
      if ($.cookie('text_resize') != null) {
        element_to_resize.css('font-size', parseFloat($.cookie('text_resize')) + 'px');
      }
      if (text_resize_line_height_allow) {
        // Set the initial line height if necessary
        if ($.cookie('text_resize_line_height') != null) {
          element_to_resize.css('line-height', parseFloat($.cookie('text_resize_line_height')) + 'px');
        }
      }
      // Changer links will change the text size when clicked
      $('a.changer').click(function() {
        // Set the current font size of the specified section as a variable
        var currentFontSize = parseFloat(element_to_resize.css('font-size'), 10);
        // Set the current line-height
        var current_line_height = parseFloat(element_to_resize.css('line-height'), 10);
        // javascript lets us choose which link was clicked, by ID
        if (this.id == 'text_resize_increase') {
          var new_font_size = currentFontSize * 1.2;
          if (text_resize_line_height_allow) { var new_line_height = current_line_height * 1.2; }
          // Allow resizing as long as font size doesn't go above text_resize_maximum.
          if (new_font_size <= text_resize_maximum) {
            $.cookie('text_resize', new_font_size, { path: '/' });
            if (text_resize_line_height_allow) { $.cookie('text_resize_line_height', new_line_height, { path: '/' }); }
            var allow_change = true;
          }
          else {
            $.cookie('text_resize', text_resize_maximum, { path: '/' });
            if (text_resize_line_height_allow) { $.cookie('text_resize_line_height', text_resize_line_height_max, { path: '/' }); }
            var reset_size_max = true;
          }
        }
        else if (this.id == 'text_resize_decrease') {
          var new_font_size = currentFontSize / 1.2;
          if (text_resize_line_height_allow) { var new_line_height = current_line_height / 1.2; }
          if (new_font_size >= text_resize_minimum) {
            // Allow resizing as long as font size doesn't go below text_resize_minimum.
            $.cookie('text_resize', new_font_size, { path: '/' });
            if (text_resize_line_height_allow) { $.cookie('text_resize_line_height', new_line_height, { path: '/' }); }
            var allow_change = true;
          }
          else {
            // If it goes below text_resize_minimum, just leave it at text_resize_minimum.
            $.cookie('text_resize', text_resize_minimum, { path: '/' });
            if (text_resize_line_height_allow) { $.cookie('text_resize_line_height', text_resize_line_height_min, { path: '/' }); }
            var reset_size_min = true;
          }
        }
        else if (this.id == 'text_resize_reset') {
          $.cookie('text_resize', null, { path: '/' });
          if (text_resize_line_height_allow) { $.cookie('text_resize_line_height', null, { path: '/' }); }
          var reset_size_original = true;
        }
        // jQuery lets us set the font size value of the main text div
        if (allow_change == true) {
          element_to_resize.css('font-size', new_font_size + 'px'); // Add 'px' onto the end, otherwise ems are used as units by default
          if (text_resize_line_height_allow) { element_to_resize.css('line-height', new_line_height + 'px'); }
          return false;
        }
        else if (reset_size_min == true) {
          element_to_resize.css('font-size', text_resize_minimum + 'px');
          if (text_resize_line_height_allow) { element_to_resize.css('line-height', text_resize_line_height_min + 'px'); }
          return false;
        }
        else if (reset_size_max == true) {
          element_to_resize.css('font-size', text_resize_maximum + 'px');
          if (text_resize_line_height_allow) { element_to_resize.css('line-height', text_resize_line_height_max + 'px'); }
          return false;
        }
        else if (reset_size_original == true) {
          element_to_resize.css('font-size', '');
          if (text_resize_line_height_allow) { element_to_resize.css('line-height', ''); }
          return false;
        }
      });
    }
  };
})(jQuery);;
/**
 * @file
 * Simple responsification of menus.
 */
(function ($) {
  /**
   * Handle clicks & toggling the menu.
   */
  var toggler_click = function() {
    $(this).parent().toggleClass('responsive-toggled');
  };
  /**
   * Unbind other mouse events on the menu items.
   *
   * @todo
   *   Not sure if it works 100%.
   *   Doesn't restore binds when out-of-responsive (if window dragging).
   */
  function remove_mouse_events(menuElement) {
    // Determine jQuery version and what disable options we have.
    var jqVersion = $.fn.jquery;
    if (jqVersion < 1.7) {
      $(menuElement).die('mouseover mouseout mouseenter mouseleave');
      $(menuElement + ' li').die('mouseover mouseout mouseenter mouseleave');
      $(menuElement + ' li a').die('mouseover mouseout mouseenter mouseleave');
    }
    else {
      $(menuElement).off('hover');
      $(menuElement + ' li').off('hover');
      $(menuElement + ' li a').off('hover');
    }
    $(menuElement).unbind('mouseover mouseout mouseenter mouseleave');
    $(menuElement + ' li').unbind('mouseover mouseout mouseenter mouseleave');
    $(menuElement + ' li a').unbind('mouseover mouseout mouseenter mouseleave');
  }

  /**
   * Store classes & IDs for restoring later (if window dragging).
   */
  function store_classes_ids(menuElement) {
    if (!$(menuElement).attr('id')) {
      $(menuElement).attr('id', 'rm-no-id-main');
    }
    if (!$(menuElement).attr('class')) {
      $(menuElement).attr('class', 'rm-no-class');
    }
    $(menuElement).data('removeattr', true)
      .data('rmids', $(menuElement).attr('id'))
      .data('rmclasses', $(menuElement).attr('class'));
    // Handle ULs if selector is parent div.
    var incr = 0;
    $(menuElement).find('ul').each(function() {
      incr++;
      // Prevent error if there is no id.
      if (!$(this).attr('id')) {
        $(this).attr('id', 'rm-no-id-' + incr);
      }
      // Prevent error if there is no class.
      if (!$(this).attr('class')) {
        $(this).attr('class', 'rm-no-class');
      }
      $(this).data('removeattr', true)
        .data('rmids', $(this).attr('id'))
        .data('rmclasses', $(this).attr('class'));
    });
    // Finally, add our class to the parent.
    $(menuElement).addClass('responsive-menus-simple');
  }

  /**
   * Remove classes & IDs from original menu for easier theming.
   */
  function remove_classes_ids(menuElement) {
    // Handle ULs if selector is parent div.
    $(menuElement).find('ul').each(function() {
      $(this).attr('class', 'rm-removed').attr('id', 'rm-removed');
    });
    // Remove classes/IDs.
    $(menuElement).attr('class', 'responsive-menus-simple').attr('id', 'rm-removed');
  }

  // Iterate through selectors, check window sizes, add some classes.
  Drupal.behaviors.responsive_menus = {
    attach: function (context, settings) {
      settings.responsive_menus = settings.responsive_menus || {};
      $('body').once('responsive-menus-load', function() {
        // Only doing this themes that don't include a viewport attribute.
        // e.g. Bartik for testing out-of-the-box... yeah, stupid.
        if (!$('meta[name=viewport]').length > 0) {
          $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
        }
        // Window width with legacy browsers.
        var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        $.each(settings.responsive_menus, function(ind, iteration) {
          if (iteration.responsive_menus_style != 'responsive_menus_simple') {
            return true;
          }
          if (!iteration.selectors.length) {
            return true;
          }
          var $media_unit = iteration.media_unit || 'px';
          if ($media_unit === 'em') {
            var $base_font_size = parseFloat($('body').css('font-size'));
            var $media_size = iteration.media_size * $base_font_size || 768;
          }
          else {
            var $media_size = iteration.media_size || 768;
          }

          // Handle clicks & toggling.
          var toggler_class = '';
          var toggler_text = iteration.toggler_text;
          // Iterate through our selectors.
          $.each(iteration.selectors, function(index, value) {
            // Stop if there is no menu element.
            if ($(value).length < 1) {
              return true;
            }
            // Handle nested menus.  Make sure we get the first, but not children.
            if ($(value).length > 1) {
              $(value).each(function(val_index) {
                if (!$(this).parents('ul').length) {
                  if (!$(this).hasClass('responsive-menus-simple')) {
                    toggler_class = 'responsive-menus-' + ind + '-' + index + '-' + val_index;
                    // Store classes & IDs before removing.
                    if (iteration.remove_attributes) {
                      store_classes_ids(this);
                    }
                    $(this).wrap('<div data-mediasize="' + $media_size + '" class="responsive-menus ' + toggler_class + '" />');
                    $('.' + toggler_class).prepend('<span class="toggler">' + toggler_text + '</span>');
                    $('.' + toggler_class + ' .toggler').bind('click', toggler_click);
                    // Unbind other mouse events.
                    if (iteration.disable_mouse_events) {
                      //$(this).data('disablemouse', true);
                      remove_mouse_events(this);
                    }
                    // Use absolute positioning.
                    if (iteration.absolute) {
                      $('.' + toggler_class).addClass('absolute');
                    }
                    // Handle first size check.
                    if (windowWidth <= $media_size) {
                      // Remove attributes setting.
                      if (iteration.remove_attributes) {
                        remove_classes_ids(this);
                      }
                      $('.' + toggler_class).addClass('responsified');
                    }
                  }
                }
              });
            }
            else {
              // Single level menus.
              if (!$(value).hasClass('responsive-menus-simple')) {
                toggler_class = 'responsive-menus-' + ind + '-' + index;
                // Store classes & IDs before removing.
                if (iteration.remove_attributes) {
                  store_classes_ids(value);
                }
                $(value).wrap('<div data-mediasize="' + $media_size + '" class="responsive-menus ' + toggler_class + '" />');
                $('.' + toggler_class).prepend('<span class="toggler">' + toggler_text + '</span>');
                $('.' + toggler_class + ' .toggler').bind('click', toggler_click);
                // Unbind other mouse events.
                if (iteration.disable_mouse_events) {
                  // @todo For rebinding mouse events.
                  /*if ($(value + ' li a').data('events')) {
                    $(value).data('tmpevents', $(value + ' li a').data('events'));
                  }*/
                  remove_mouse_events(value);
                }
                // Use absolute positioning.
                if (iteration.absolute) {
                  $('.' + toggler_class).addClass('absolute');
                }
                // Handle first size check.
                if (windowWidth <= $media_size) {
                  // Remove attributes setting.
                  if (iteration.remove_attributes) {
                    remove_classes_ids(value);
                  }
                  $('.' + toggler_class).addClass('responsified');
                }
              }
            }
          });
       });
        // Handle window resizing.
        $(window).resize(function() {
          // Window width with legacy browsers.
          windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
          $('.responsive-menus').each(function(menuIndex, menuValue) {
            var mediasize = $(this).data('mediasize') || 768;
            // Prevent menu from going off the screen.  This only happens in
            // non-responsive themes (like Bartik default), but it looks bad.
            if ($(this).width() > windowWidth) {
              $(this).data('nonresponsive', true);
              $(this).width(windowWidth);
            }
            var menuElement = $(this).find('.responsive-menus-simple');
            if (windowWidth >= mediasize) {
              if (menuElement.data('removeattr')) {
                menuElement.addClass(menuElement.data('rmclasses'));
                menuElement.attr('id', menuElement.data('rmids'));
                menuElement.find('ul').each(function() {
                  $(this).addClass($(this).data('rmclasses'));
                  $(this).attr('id', $(this).data('rmids'));
                });
              }
              $(this).removeClass('responsified');
            }
            if (windowWidth <= mediasize) {
              // Now fix repercussions for handling non-responsive themes above.
              // Stretch width back out w/ the screen.
              if ($(this).data('nonresponsive') && $(this).width() < windowWidth) {
                $(this).width(windowWidth);
              }
              if (menuElement.data('removeattr')) {
                remove_classes_ids(menuElement);
              }
              $(this).addClass('responsified');
            }
          });
        });
      });
    }
  };

}(jQuery));
;
(function ($) {

$(document).ready(function() {

  // Attach mousedown, keyup, touchstart events to document only and catch
  // clicks on all elements.
  $(document.body).bind("mousedown keyup touchstart", function(event) {

    // Catch the closest surrounding link of a clicked element.
    $(event.target).closest("a,area").each(function() {

      if (Drupal.settings.piwik.trackMailto && $(this).is("a[href^='mailto:'],area[href^='mailto:']")) {
        // Mailto link clicked.
        _paq.push(["trackEvent", "Mails", "Click", this.href.substring(7)]);
      }

    });
  });

  // Colorbox: This event triggers when the transition has completed and the
  // newly loaded content has been revealed.
  if (Drupal.settings.piwik.trackColorbox) {
    $(document).bind("cbox_complete", function () {
      var href = $.colorbox.element().attr("href");
      if (href) {
        _paq.push(["setCustomUrl", href]);
        _paq.push(["trackPageView"]);
      }
    });
  }

});

})(jQuery);
;
