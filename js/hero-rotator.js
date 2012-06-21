;(function ($) {

  $(document).ready(function () {
    var $heroRotators = $('.hr')
      , reverseDelays;

    reverseDelays = function ($el) {
      var $delayedElements = $el.find('[class*="hr-delay"]');

      $el.toggleClass('hr-reversed-delays');

      // Find each delayed elements and reverse the number of its delay class
      $delayedElements.each(function () {
        var delayNumber = parseInt($(this).attr('class').match(/(hr-delay-\d)/g)[0].match(/\d/g)[0], 10);

        $(this)
          .removeClass('hr-delay-' + delayNumber)
          .addClass('hr-delay-' + (($delayedElements.length + 1) - delayNumber + 1));
      });
    };

    $heroRotators.each(function () {
      var $heroRotator = $(this)
        , $slides = $('.hr-slides', $heroRotator)
        , $slidesItems = $('.hr-slides-item', $slides)
        , $slide
        , $pagination = $('.hr-pagination', $heroRotator)
        , $paginationItems = $('.hr-pagination-item', $pagination)
        , $arrows = $('.hr-arrows', $heroRotator)
        , zIndex = 1
        , options = $heroRotator.data();

      $heroRotator.on('initialiseHero', function () {
        // Reverse the stacking order of slide items to show the first on top
        $slidesItems.css({
          zIndex: function (zIndex) {
            // Calculate the zIndex for this slide item
            return $slidesItems.length - zIndex;
          }
        });

        $heroRotator.trigger('changeSlide');
      });

      $heroRotator.on('keydown', function (event) {
        event.preventDefault();

        switch (event.keyCode) {
          case 37:
            $heroRotator.trigger('goToPrevSlide');

            break;

          case 39:
            $heroRotator.trigger('goToNextSlide');

            break;
        }
      });

      $heroRotator.on('changeSlide', function (event, slideIndex) {
        // Find the previous slide if there is one
        var $prevSlide = ($slide) ? $slide : undefined
          ;

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

          // Animate the previous slide's contents out
          $prevSlide.addClass('is-hr-animating-out').removeClass('is-hr-animating-in');

          // Update the corresponding pagination item
          $paginationItems.eq(slideIndex).addClass('hr-active');

          // We hide the slide, increase its zIndex to make it appear on top
          // of other slides, and then fade it in.
          $slide
            .hide()
            .css('zIndex', $slidesItems.length + zIndex)
            .fadeIn(options.transitionDuration);

          // The zIndex variable is increased every time to ensure the next
          // slide will always be on top of the stack.
          zIndex += 1;

          // Don't reverse delays if they have not yet been reversed
          if (options.reverseDelays && $slide.hasClass('hr-reversed-delays')) {
            reverseDelays($slide);
          }
        }

        // Animate the slide's contents in
        $slide.addClass('is-hr-animating-in').removeClass('is-hr-animating-out');
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

      $slidesItems.on('goToSlide', function (event) {
        var slideIndex = $(this).index();

        // If there is another slide item to the right…
        if ($slidesItems[slideIndex]) {
          $heroRotator.trigger('changeSlide', [slideIndex]);
        }
      });

      $arrows.on('click', '.hr-arrows-item', function (event) {
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