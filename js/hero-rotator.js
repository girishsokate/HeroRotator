(function ($) {

  // ----- Helpers ----- //
  // jQuery CSS method returns time in seconds. This method is used to convert.
  function convertToMilliseconds(int) {
    return int + 'ms';
  }

  // ----- CSS Hooks ----- //
  // This will add hooks for the transition and transition-delay CSS properties.
  var div = document.createElement('div')
    , divStyle = div.style
    , support = $.support
    , props = 'Property Duration Delay TimingFunction'.split(' ');

  // Test support for transition property
  support.transition =
    (divStyle.MozTransition    === '' ? 'MozTransition'    :
    (divStyle.MsTransition     === '' ? 'MsTransition'     :
    (divStyle.WebkitTransition === '' ? 'WebkitTransition' :
    (divStyle.OTransition      === '' ? 'OTransition'      :
    (divStyle.transition       === '' ? 'Transition'       :
    false)))));

  div = null;

  // If transition is supported and a vendor prefix is required, add the hooks.
  if (support.transition && support.transition !== 'Transition') {
    $.cssHooks.transition = {
      get: function(elem, computed, extra) {
        return $.map(props, function(prop, i) {
          return $.css(elem, support.transition + prop);
        }).join(' ');
      },
      set: function(elem, value) {
        elem.style[ support.transition ] = value;
      }
    };

    $.each(props, function(i, prop) {
      $.cssHooks['transition' + prop] = {
        get: function(elem, computed, extra) {
          return $.css(elem, support.transition + prop);
        },
        set: function(elem, value) {
          elem.style[support.transition + prop] = value;
        }
      };
    });
  }

  // The same but for transform
  $.cssHooks.transform = {
    set: function(elem, value) {
      var div = document.createElement('div')
        , property =
            (div.style.transform === '' ? 'transform' :
            (div.style.WebkitTransform === '' ? 'WebkitTransform' :
            (div.style.MozTransform === '' ? 'MozTransform' :
            (div.style.MsTransform === '' ? 'MsTransform' :
            (div.style.OTransform === '' ? 'OTransform' :
            false)))));

      if (property) {
        elem.style[property] = value;
      }
    }
  };

  $(document).ready(function () {

    var $heroRotators = $('.hr');

    function reverseDelays($el) {
      var $this = $(this)
        , $delayedElements = $el.find('.hr-transition[data-hr-delay]')
        , delays = []
        , minPlusMax;

      $el.toggleClass('hr-reversed-delays');

      // Find each delayed elements and reverse the number of its delay class
      $delayedElements.each(function () {
        delays.push($(this).data('hr-delay'));
      });

      minPlusMax = Math.min.apply(null, delays) + Math.max.apply(null, delays);

      $delayedElements.each(function () {
        var $this = $(this);

        $this.css({ transitionDelay: convertToMilliseconds(minPlusMax - (parseFloat($this.css('transitionDelay'), 10) * 1000)) });
      });
    }

    function resetDelays($el) {
      $el.find('.hr-transition[data-hr-delay]').each(function () {
        var $this = $(this);

        $this.css({ transitionDelay: convertToMilliseconds($this.data('hr-delay')) });
      });
    }

    $heroRotators.each(function () {

      var $heroRotator = $(this)
        , $slides = $('.hr-slides', $heroRotator)
        , $slidesItems = $('.hr-slides-item', $slides)
        , $slide
        , $pagination = $('.hr-pagination', $heroRotator)
        , $paginationItems = $('.hr-pagination-item', $pagination)
        , $arrows = $('.hr-arrows', $heroRotator)
        , zIndex = 1
        , options = {
            transitionDuration: $heroRotator.data('hr-transition-duration')
          , reverseDelays: $heroRotator.data('hr-reverse-delays')
          , continuous: $heroRotator.data('hr-continuous') };

      $heroRotator.on('initialiseHero', function () {
        // Reverse the stacking order of slide items to show the first on top
        $slidesItems.css(
          { zIndex: function (zIndex) {
              // Calculate the zIndex for this slide item
              return $slidesItems.length - zIndex;
            } }
        );

        // Find all elements that have transitions
        $slidesItems.find('.hr-transition').each(function () {
          var $this = $(this);

          // Sanetize the x and y values
          $this.data('hr-translate3d',
            [ parseInt($this.data('hr-x'), 10) || 0
            , parseInt($this.data('hr-y'), 10) || 0
            , 0 ]
          );

          // Apply the transition
          $this.css({ transition: 'all ' + convertToMilliseconds($this.data('hr-duration')) + ' ease ' + convertToMilliseconds($this.data('hr-delay')) });

          // Apply the transform to all slides by default so we get in the effect
          // of transitions on slide entrance.
          $this.trigger('hrTransitionOut');
        });

        $heroRotator.trigger('changeSlide');
      });

      $heroRotator.on('keydown', function (event) {
        switch (event.keyCode) {

          case 37:
          event.preventDefault();

          $heroRotator.trigger('goToPrevSlide');

          break;

          case 39:
          event.preventDefault();

          $heroRotator.trigger('goToNextSlide');

          break;

        }
      });

      $heroRotator.on('goToNextSlide', function () {
        var $newSlide;

        if (options.continuous) {
          $newSlide = ($slide.next().length) ? $slide.next() : $slidesItems.first();
        } else {
          $newSlide = $slide.next();
        }

        if ($newSlide.length) {
          $newSlide.trigger('goToSlide');
        }
      });

      $heroRotator.on('goToPrevSlide', function () {
        var $newSlide;

        if (options.continuous) {
          $newSlide = ($slide.prev().length) ? $slide.prev() : $slidesItems.last();
        } else {
          $newSlide = $slide.prev();
        }

        if ($newSlide.length) {
          $newSlide.trigger('goToSlide');
        }
      });

      $slidesItems.on('goToSlide', function () {
        var slideIndex = $(this).index();

        // If there is another slide item to the right…
        if ($slidesItems[slideIndex]) {
          $heroRotator.trigger('changeSlide', [slideIndex]);
        }
      });

      $heroRotator.on('changeSlide', function (event, slideIndex) {
        // OUT

        // Find the previous slide if there is one
        var $prevSlide = ($slide) ? $slide : undefined;

        // Set the slide index to 0 if not given one
        slideIndex = (slideIndex !== undefined) ? slideIndex : 0;

        // Find this slide element
        $slide = $slidesItems.eq(slideIndex);

        // Clean up pagination
        $paginationItems.removeClass('hr-active');

        if ($prevSlide) {
          // If there is a previous slide, make sure it isn't the same as the
          // current slide. If there is we return to prevent any change.
          if ($prevSlide.index() === slideIndex) {
            return true;
          }

          if (options.reverseDelays) {
            reverseDelays($prevSlide);
          }

          $prevSlide.find('.hr-transition').each(function () {
            $(this).trigger('hrTransitionOut');
          });

          // IN

          // Update the corresponding pagination item
          $paginationItems
            .eq(slideIndex)
              .addClass('hr-active');

          // We hide the slide, increase its zIndex to make it appear on top
          // of other slides, and then fade it in. In previous versions we
          // just faded out the previous slide whilst sliding in the next,
          // but in the middle of this transition there would be a glimpse of
          // the background.
          $slide
            .css({ display: 'none' })
            .css('zIndex', $slidesItems.length + zIndex)
            .fadeIn(options.transitionDuration);

          // The zIndex variable is increased every time to ensure the next
          // slide will always be on top of the stack.
          zIndex += 1;

          // Don't reset delays if they have not yet been reversed
          if (options.reverseDelays && $slide.hasClass('hr-reversed-delays')) {
            resetDelays($slide);
          }
        }

        $slide.find('.hr-transition').each(function () {
          $(this).trigger('hrTransitionIn');
        });
      });

      $slidesItems.on('hrTransitionOut', '.hr-transition', function () {
        var $this = $(this)
          , translate3d = $this.data('hr-translate3d');

        $this.css(
          { transform: 'translate3d(' + translate3d.join('px, ') + ')'
          , opacity: 0 }
        );
      });

      $slidesItems.on('hrTransitionIn', '.hr-transition', function () {
        $(this).css(
          { transform: ''
          , opacity: '' }
        );
      });

      $arrows.on('click', '.hr-arrows-item', function () {
        switch ($(this).data('hr-direction')) {

          case 'previous':
            $heroRotator.trigger('goToPrevSlide');
            break;

          case 'next':
            $heroRotator.trigger('goToNextSlide');
            break;

        }
      });

      $pagination.on('click', '.hr-pagination-item', function () {
        $heroRotator.trigger('changeSlide', $(this).index());
      });

      $heroRotator.trigger('initialiseHero');

    });

  });

}(jQuery));