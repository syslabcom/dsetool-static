Drupal.locale = { 'strings': {"":{"All":"Toate","Next":"\u00cenainte","Show more":"Afi\u0219a\u021bi mai mult","Show less":"Afi\u0219a\u021bi mai pu\u021bin"}} };;
(function ($) {
  Drupal.behaviors.quizJumper = {
    attach: function(context, settings) {
      $("#quiz-jumper-form:not(.quizJumper-processed)", context).show().addClass("quizJumper-processed").change(function(){
        $("#quiz-jumper-form #edit-submit").trigger("click");
      });
      $("#quiz-jumper-form-no-js:not(.quizJumper-processed)").hide().addClass("quizJumper-processed");
    }
  };
})(jQuery);
;
(function ($) {

/**
 * Attaches sticky table headers.
 */
Drupal.behaviors.tableHeader = {
  attach: function (context, settings) {
    if (!$.support.positionFixed) {
      return;
    }

    $('table.sticky-enabled', context).once('tableheader', function () {
      $(this).data("drupal-tableheader", new Drupal.tableHeader(this));
    });
  }
};

/**
 * Constructor for the tableHeader object. Provides sticky table headers.
 *
 * @param table
 *   DOM object for the table to add a sticky header to.
 */
Drupal.tableHeader = function (table) {
  var self = this;

  this.originalTable = $(table);
  this.originalHeader = $(table).children('thead');
  this.originalHeaderCells = this.originalHeader.find('> tr > th');
  this.displayWeight = null;

  // React to columns change to avoid making checks in the scroll callback.
  this.originalTable.bind('columnschange', function (e, display) {
    // This will force header size to be calculated on scroll.
    self.widthCalculated = (self.displayWeight !== null && self.displayWeight === display);
    self.displayWeight = display;
  });

  // Clone the table header so it inherits original jQuery properties. Hide
  // the table to avoid a flash of the header clone upon page load.
  this.stickyTable = $('<table class="sticky-header"/>')
    .insertBefore(this.originalTable)
    .css({ position: 'fixed', top: '0px' });
  this.stickyHeader = this.originalHeader.clone(true)
    .hide()
    .appendTo(this.stickyTable);
  this.stickyHeaderCells = this.stickyHeader.find('> tr > th');

  this.originalTable.addClass('sticky-table');
  $(window)
    .bind('scroll.drupal-tableheader', $.proxy(this, 'eventhandlerRecalculateStickyHeader'))
    .bind('resize.drupal-tableheader', { calculateWidth: true }, $.proxy(this, 'eventhandlerRecalculateStickyHeader'))
    // Make sure the anchor being scrolled into view is not hidden beneath the
    // sticky table header. Adjust the scrollTop if it does.
    .bind('drupalDisplaceAnchor.drupal-tableheader', function () {
      window.scrollBy(0, -self.stickyTable.outerHeight());
    })
    // Make sure the element being focused is not hidden beneath the sticky
    // table header. Adjust the scrollTop if it does.
    .bind('drupalDisplaceFocus.drupal-tableheader', function (event) {
      if (self.stickyVisible && event.clientY < (self.stickyOffsetTop + self.stickyTable.outerHeight()) && event.$target.closest('sticky-header').length === 0) {
        window.scrollBy(0, -self.stickyTable.outerHeight());
      }
    })
    .triggerHandler('resize.drupal-tableheader');

  // We hid the header to avoid it showing up erroneously on page load;
  // we need to unhide it now so that it will show up when expected.
  this.stickyHeader.show();
};

/**
 * Event handler: recalculates position of the sticky table header.
 *
 * @param event
 *   Event being triggered.
 */
Drupal.tableHeader.prototype.eventhandlerRecalculateStickyHeader = function (event) {
  var self = this;
  var calculateWidth = event.data && event.data.calculateWidth;

  // Reset top position of sticky table headers to the current top offset.
  this.stickyOffsetTop = Drupal.settings.tableHeaderOffset ? eval(Drupal.settings.tableHeaderOffset + '()') : 0;
  this.stickyTable.css('top', this.stickyOffsetTop + 'px');

  // Save positioning data.
  var viewHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
  if (calculateWidth || this.viewHeight !== viewHeight) {
    this.viewHeight = viewHeight;
    this.vPosition = this.originalTable.offset().top - 4 - this.stickyOffsetTop;
    this.hPosition = this.originalTable.offset().left;
    this.vLength = this.originalTable[0].clientHeight - 100;
    calculateWidth = true;
  }

  // Track horizontal positioning relative to the viewport and set visibility.
  var hScroll = document.documentElement.scrollLeft || document.body.scrollLeft;
  var vOffset = (document.documentElement.scrollTop || document.body.scrollTop) - this.vPosition;
  this.stickyVisible = vOffset > 0 && vOffset < this.vLength;
  this.stickyTable.css({ left: (-hScroll + this.hPosition) + 'px', visibility: this.stickyVisible ? 'visible' : 'hidden' });

  // Only perform expensive calculations if the sticky header is actually
  // visible or when forced.
  if (this.stickyVisible && (calculateWidth || !this.widthCalculated)) {
    this.widthCalculated = true;
    var $that = null;
    var $stickyCell = null;
    var display = null;
    var cellWidth = null;
    // Resize header and its cell widths.
    // Only apply width to visible table cells. This prevents the header from
    // displaying incorrectly when the sticky header is no longer visible.
    for (var i = 0, il = this.originalHeaderCells.length; i < il; i += 1) {
      $that = $(this.originalHeaderCells[i]);
      $stickyCell = this.stickyHeaderCells.eq($that.index());
      display = $that.css('display');
      if (display !== 'none') {
        cellWidth = $that.css('width');
        // Exception for IE7.
        if (cellWidth === 'auto') {
          cellWidth = $that[0].clientWidth + 'px';
        }
        $stickyCell.css({'width': cellWidth, 'display': display});
      }
      else {
        $stickyCell.css('display', 'none');
      }
    }
    this.stickyTable.css('width', this.originalTable.outerWidth());
  }
};

})(jQuery);
;
var Multichoice = Multichoice || {};
(function ($) {

  Multichoice.refreshScores = function (checkbox, scoring) {
    var prefix = '#' + Multichoice.getCorrectIdPrefix(checkbox.id);
    if (checkbox.checked) {
      $(prefix + 'score-if-chosen').val('1');
      $(prefix + 'score-if-not-chosen').val('0');
    }
    else {
      if (scoring == 0) {
        $(prefix + 'score-if-not-chosen').val('0');
        if ($('#edit-choice-multi').attr('checked')) {
          $(prefix + 'score-if-chosen').val('-1');
        }
        else {
          $(prefix + 'score-if-chosen').val('0');
        }
      }
      else if (scoring == 1) {
        $(prefix + 'score-if-chosen').val('0');
        if ($('#edit-choice-multi').attr('checked')) {
          $(prefix + 'score-if-not-chosen').val('1');
        }
        else {
          $(prefix + 'score-if-not-chosen').val('0');
        }
      }
    }
  }

  /**
   * Updates correct checkboxes according to changes of the score values for an alternative
   *
   * @param textfield
   *  The textfield(score) that is being updated
   */
  Multichoice.refreshCorrect = function (textfield) {
    var prefix = '#' + Multichoice.getCorrectIdPrefix(textfield.id);
    var chosenScore;
    var notChosenScore;

    // Fetch the score if chosen and score if not chosen values for the active alternative
    if (Multichoice.isChosen(textfield.id)) {
      chosenScore = new Number(textfield.value);
      notChosenScore = new Number($(prefix + 'score-if-not-chosen').val());
    }
    else {
      chosenScore = new Number($(prefix + 'score-if-chosen').val());
      notChosenScore = new Number(textfield.value);
    }

    // Set the checked status for the checkbox in the active alternative
    if (notChosenScore < chosenScore) {
      $(prefix + 'correct').attr('checked', true);
    }
    else {
      $(prefix + 'correct').attr('checked', false);
    }
  }

  /**
   * Helper function fetching the id prefix for a html id attribute
   *
   * @param string
   *  Html id attribute
   * @return
   *  The common prefix for all the alternatives in this alternative fieldset
   */
  Multichoice.getCorrectIdPrefix = function (string) {
    // TODO: Will the regExp below always work?
    var pattern = new RegExp("^(edit-alternatives-[0-9]{1,2}-)(?:correct|score-if-(?:not-|)chosen)$");
    pattern.exec(string);
    return RegExp.lastParen;
  }

  /**
   * Checks if the id belongs to the score if chosen textfield
   *
   * @param string
   *  html id attribute of one of the score text fields
   * @return
   *  True if the string ends with "score-if-chosen", false otherwise.
   */
  Multichoice.isChosen = function (string) {
    var pattern = new RegExp("score-if-chosen$");
    return pattern.test(string);
  }

  Drupal.behaviors.multichoiceAlternativeBehavior = {
    attach: function (context, settings) {
      $('.multichoice-row')
              .once()
              //.filter(':has(:checkbox:checked)')
              .addClass('selected')
              .end()
              .click(function (event) {
                if (event.target.type !== 'checkbox' && !$(':radio').attr('disabled')) {
                $(this).toggleClass('selected');
                  if (typeof $.fn.prop === 'function') {
                    //$(':checkbox', this).prop('checked', function (i, val) {
                     // return !val;
                    //});
                    $(':radio', this).prop('checked', 'checked');
                  }
                  else {
                    //$(':checkbox', this).attr('checked', function () {
                      //return !this.checked;
                    //});
                    $(':radio', this).attr('checked', true);
                  }
                  if ($(':radio', this).html() != null) {
                    $(this).parent().find('.multichoice-row').removeClass('selected');
                    $(this).addClass('selected');
                  }
                }
              });
    }
  };

})(jQuery);
;
(function ($) {

Drupal.behaviors.textarea = {
  attach: function (context, settings) {
    $('.form-textarea-wrapper.resizable', context).once('textarea', function () {
      var staticOffset = null;
      var textarea = $(this).addClass('resizable-textarea').find('textarea');
      var grippie = $('<div class="grippie"></div>').mousedown(startDrag);

      grippie.insertAfter(textarea);

      function startDrag(e) {
        staticOffset = textarea.height() - e.pageY;
        textarea.css('opacity', 0.25);
        $(document).mousemove(performDrag).mouseup(endDrag);
        return false;
      }

      function performDrag(e) {
        textarea.height(Math.max(32, staticOffset + e.pageY) + 'px');
        return false;
      }

      function endDrag(e) {
        $(document).unbind('mousemove', performDrag).unbind('mouseup', endDrag);
        textarea.css('opacity', 1);
      }
    });
  }
};

})(jQuery);
;
