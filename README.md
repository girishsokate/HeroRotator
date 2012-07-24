# Hero Rotator

A framework for easily building feature slideshows with just a few lines of HTML and CSS.

## Live Example

Take a look at [an example](http://oliverjash.github.com/HeroRotator/).

## Usage

The idea of Hero Rotator is to provide you with everything you need to build your slides without touching any JavaScript or CSS. This framework provides you with a skeleton for you to add your own CSS on top of. It's a "just add water" solution, if you like.

Grab a copy of the source. You will need a copy of `hero-rotator.css` and `hero-rotator.js`.

The Hero Rotator container looks like this:

    <div data-hr data-hr-transition-duration="2000" data-hr-reverse-delays="true" data-hr-continuous="true">
      …
    </div>

The `hr` data attribute is required to initialise the plugin. This is the element that should contain everything related to the Hero Rotator — slides, pagination and arrow buttons (see example markup).

### Options
Specify options using data attributes onto the `hr` module (like above).

* `hr-transition-duration` - The duration of the fading transition between slides.
* `hr-reverse-delays` - Boolean for whether or not delays should be reversed when slides are transitioning out.
* `hr-continuous` - Boolean for whether or not rotation of slides should be continuous.

Each slide is made up of a `hr-slides-item` module. Inside of that, you have your slide contents.

#### Slide Options

Inside each slide you have the option of transitioning content elements individually. To get an element to transition, add the `hr-transition` class to the element, then specify options using data attributes.

* `hr-x` - The amount of pixels the element should move on the x axis.
* `hr-y` - The amount of pixels the element should move on the y axis.
* `hr-duration` - The duration of the transition.
* `hr-delay` - The delay of the transition.

### Example Code

To help you out, here's an example of content inside a slide.

    <div tabindex="1" class="hr-slides">
      <section id="example-1" class="hr-slides-item">
        <!-- Your content goes in here-->
        <div class="island">
          <img src="images/imac.png" data-hr-x="75px" data-hr-y="0" data-hr-duration="1000" data-hr-delay="100" class="slide-image-1 hr-transition">
          <h1 data-hr-x="75px" data-hr-y="0" data-hr-duration="1000" data-hr-delay="500" class="slide-title hr-transition">Lorem Ipsum Dolor Sit Amet</h1>
          <p data-hr-x="75px" data-hr-y="0" data-hr-duration="1000" data-hr-delay="700" class="slide-content-1 hr-transition">Nulla facilisi. Duis aliquet egestas purus in blandit. Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est urna sit amet arcu. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed molestie augue sit amet leo consequat posuere.</p>
        </div>
      </section>
      …
    </div>

### Pagination and Arrow Buttons

If you want to include pagination and arrow bets, take a look at the example markup to see how this is done. Just drop in the markup with the correct classes attached (shown in the example) — JavaScript is done for you.

## Requirements

* jQuery (tested on 1.7)

## Browser Support

Tested and working in all browsers. Transitions on elements use CSS3, so those elements will not transition in some browsers. However, the fading transition from slide to slide will work for all.