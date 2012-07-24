# Hero Rotator

A jQuery plugin for easily building feature slideshows with just a few lines of HTML.

## Live Example

Take a look at [an example](http://oliverjash.github.com/HeroRotator/).

## Usage

The idea of Hero Rotator is to provide you with everything you need to build your slides without touching any JavaScript or CSS. This framework provides you with a skeleton for you to add your own CSS on top of. It's a "just add water" solution, if you like.

The plugin follows a simple markup pattern: any children elements are treated as slides. For example:

    <div class="hr">
      <section class="example-1">
        …
      </section>
      <section class="example-2">
        …
      </section>
      <section class="example-3">
        …
      </section>
    </div>

Above is the initial required structure – a series of elements wrapped in a container. This can be any combination of elements that has the same structure.

Once you have your markup, initialise the plugin:

    $('.hr').heroRotator();

## Options
Hero Rotator can take an optional paramater - an object of key/value options:

* `transitionDuration` - The duration of the fading transition between slides.
* `reverseDelays` - Boolean for whether or not delays should be reversed when slides are transitioning out.
* `continous` - Boolean for whether or not rotation of slides should be continuous.

### Example

    $('.hr').heroRotator(
      { height: '450px'
      , transitionDuration: 2000
      , reverseDelays: true
      , continous: true
      }
    );

### Slide Options

Inside each slide you have the option of transitioning content elements individually. Specify options using data attributes:

* `hr-transform` - The CSS transform value (`translate3d`, `scale`, etc.).
* `hr-duration` - The duration of the transition.
* `hr-delay` - The delay of the transition.

#### Example

    <div class="hr">
      <section class="example-1">
        <img src="images/imac.png" data-hr-transform="translate3d(75px, 0, 0)" data-hr-duration="3000" data-hr-delay="200" class="slide-image-1">
      </section>
    </div>

### API

If you want to include things like pagination and previous/next navigation buttons, you will need to write some JavaScript to talk to the Hero Rotator API. The API uses custom jQuery events:

* `.trigger('changeSlide', [index])`
* `.trigger('goToPrevSlide')`
* `.trigger('goToNextSlide')`

In the example `index.html` file provided, there are live examples of pagination and previous/next navigation buttons which make use of this API.

## Requirements

* jQuery (tested on 1.7)

### Browser Support

Tested and working in all browsers. Element transitions are powered by CSS3, so those elements will not transition in some non-HTML5 browsers. However, the fading transition from slide to slide will work in all browsers.

## Let's Make It Better

I would love to hear more about how to improve Hero Rotator. Play with it and fork away. If you have any questions, contact me on [Twitter](http://twitter.com/OliverJAsh).

## License

<a rel="license" href="http://creativecommons.org/licenses/by/3.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by/3.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Hero Rotator</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="http://twitter.com/OliverJAsh" property="cc:attributionName" rel="cc:attributionURL">Oliver Joseph Ash</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/3.0/">Creative Commons Attribution 3.0 Unported License</a>.<br />Based on a work at <a xmlns:dct="http://purl.org/dc/terms/" href="https://github.com/OliverJAsh/HeroRotator" rel="dct:source">https://github.com/OliverJAsh/HeroRotator</a>.
