// Hero Rotator
// Author: Oliver Joseph Ash
// Source URL and license information: https://github.com/OliverJAsh/HeroRotator
;(function ($) {

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

  // ----- Helpers ----- //
  // jQuery CSS method returns time in seconds. This method is used to convert.
  function convertToMilliseconds(int) {
    return int + 'ms';
  }

  function reverseDelays($el) {
    var $this = $(this)
      , $delayedElements = $el.find('[data-hr-transform]').filter(function () {
          return $(this).css('transitionDelay') !== '0s';
        })
      , delays = []
      , minPlusMax;

    $el.toggleClass('hr-reversed-delays');

    // Find each delayed elements and reverse the number of its delay class
    $delayedElements.each(function () {
      var $this = $(this)
        , options = $this.data('hr-transition-options');

      delays.push(options.delay);
    });

    minPlusMax = Math.min.apply(null, delays) + Math.max.apply(null, delays);

    $delayedElements.each(function () {
      var $this = $(this);

      $this.css({ transitionDelay: convertToMilliseconds(minPlusMax - (parseFloat($this.css('transitionDelay'), 10) * 1000)) });
    });
  }

  function resetDelays($el) {
    $el.find('[data-hr-transform]').filter(function () {
      return $(this).css('transitionDelay') !== '0s';
    }).each(function () {
      var $this = $(this)
        , options = $this.data('hr-transition-options');

      $this.css({ transitionDelay: convertToMilliseconds(options.delay) });
    });
  }

  $.fn.heroRotator = function (options) {

    var defaultOptions =
      { height: '450px'
      , transitionDuration: 2000
      , reverseDelays: true
      , continous: true
      };

    // Merge defaults and options, without modifying defaults
    options = $.extend({}, defaultOptions, options);

    return this.each(function () {

      var $heroRotator = $(this)
        , $slides = $heroRotator.children()
        , $slide
        , zIndex = 1;

      $heroRotator.on('initialiseHero', function () {

        $heroRotator.css(
          { outline: 0
          , position: 'relative'
          , zoom: 1
          , height: options.height
          }
        );

        $heroRotator.attr('tabindex', 1);

        $slides.css(
          { position: 'absolute'
          , width: '100%'
          , height: options.height
          }
        );

        // Reverse the stacking order of slide items to show the first on top
        $slides.css(
          { zIndex: function (zIndex) {
              // Calculate the zIndex for this slide item
              return $slides.length - zIndex;
            } }
        );

        // Find all elements that have transitions
        $slides.find('[data-hr-transform]').each(function () {
          var $this = $(this)
            , transitionOptions =
              { transform: $this.data('hr-transform') || ""
              , duration: $this.data('hr-duration') || 300
              // Default delay of 1ms when reverseDelays is set to force
              // the delay of elements without delays on transition out.
              , delay: $this.data('hr-delay') || (options.reverseDelays ? 1 : 0)
              };

          $this.data('hr-transition-options', transitionOptions);

          // Apply the transform to all slides by default so we get in the
          // effect of transitions on slide entrance.
          // Force recalculate style to force the transition out styles to
          // apply immediately, before transition is applied.
          $this.trigger('hrTransitionOut').width();

          // Apply the transition
          $this.css({ transition: 'all ' + convertToMilliseconds(transitionOptions.duration) + ' ease ' + convertToMilliseconds(transitionOptions.delay) });
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
          $newSlide = ($slide.next().length) ? $slide.next() : $slides.first();
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
          $newSlide = ($slide.prev().length) ? $slide.prev() : $slides.last();
        } else {
          $newSlide = $slide.prev();
        }

        if ($newSlide.length) {
          $newSlide.trigger('goToSlide');
        }
      });

      $heroRotator.on('changeSlide', function (event, slideIndex) {
        // OUT

        // Find the previous slide if there is one
        var $prevSlide = ($slide) ? $slide : undefined;

        // Set the slide index to 0 if not given one
        slideIndex = (slideIndex !== undefined) ? slideIndex : 0;

        // Find this slide element
        $slide = $slides.eq(slideIndex);

        if ($prevSlide) {
          // If there is a previous slide, make sure it isn't the same as the
          // current slide. If there is we return to prevent any change.
          if ($prevSlide.index() === slideIndex) {
            return true;
          }

          if (options.reverseDelays) {
            reverseDelays($prevSlide);
          }

          $prevSlide.find('[data-hr-transform]').each(function () {
            $(this).trigger('hrTransitionOut');
          });

          // We hide the slide, increase its zIndex to make it appear on top
          // of other slides, and then fade it in. In previous versions we
          // just faded out the previous slide whilst sliding in the next,
          // but in the middle of this transition there would be a glimpse of
          // the background.
          $slide
            .css({ display: 'none' })
            .css('zIndex', $slides.length + zIndex)
            .fadeIn(options.transitionDuration);

          // The zIndex variable is increased every time to ensure the next
          // slide will always be on top of the stack.
          zIndex += 1;

          // Don't reset delays if they have not yet been reversed
          if (options.reverseDelays && $slide.hasClass('hr-reversed-delays')) {
            resetDelays($slide);
          }
        }

        $slide.find('[data-hr-transform]').each(function () {
          $(this).trigger('hrTransitionIn');
        });

        if (options.callback) {
          options.callback();
        }
      });

      $slides.on('goToSlide', function () {
        var slideIndex = $(this).index();

        // If there is another slide item to the right…
        if ($slides[slideIndex]) {
          $heroRotator.trigger('changeSlide', [slideIndex]);
        }
      });

      $slides.on('hrTransitionOut', '[data-hr-transform]', function () {
        var $this = $(this)
          , options = $this.data('hr-transition-options');

        $this.css(
          { transform: options.transform
          , opacity: 0
          }
        );
      });

      $slides.on('hrTransitionIn', '[data-hr-transform]', function () {
        $(this).css(
          { transform: ''
          , opacity: ''
          }
        );
      });

      $heroRotator.trigger('initialiseHero');

    });

  };

}(jQuery));