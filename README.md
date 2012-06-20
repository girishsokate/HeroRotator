# Hero Rotator

A framework for easily building feature slideshows with just a few lines of HTML and CSS.

## Live Example

Take a look at [an example](http://oliverjash.github.com/HeroRotator/).

## Usage

The idea of Hero Rotator is to provide you with all of the modules you need to build your slides without touching any JavaScript or CSS. It's a "just add water" solution, if you like.

Grab a copy of the source. You can use the Stylus version, which will allow you to make changes to things like the animation duration, or you can grab the vanilla CSS version (`css/hero-rotator.css`). Likewise, you can grab the Jade or the HTML version (`index.html`). Finally, you need a copy of the JavaScript file (`js/hero-rotator.js`).

Use the Jade/HTML provided as a template for building your rotator.

The Hero Rotator looks like this:

    <div class="hr" data-transition-duration="1000" data-reverse-delays="true" data-continuous="true">
      …
    </div>

### Options
Specify options using data attributes onto the `hr` module (like above).

* `transition-duration` - The duration of the fading transition between slides.
* `reverse-delays` - Boolean for whether or not delays should be reversed on animation out.
* `continuous` - Boolean for whether or not rotation of slides should be continuous.

Each slide is made up of a `hr-slides-item` module. Inside of that, you have your slide contents. Use the `hr-animate` module to specify an element that you want animating, and then choose from the following animation modules:

#### Direction

* hr-up
* hr-right
* hr-down
* hr-left

#### Duration

Furthermore, you can specify a speed for the animation (optional). Choose from (ranging from fasted to slowest):

* hr-xx-fast
* hr-x-fast
* hr-fast
* hr-slow
* hr-x-slow
* hr-xx-slow

#### Delay

Finally, you can append delays to the animation to add to the effect. Add the `delay` class to your element, and then another class specifying the order of the delay, for example:

* hr-delay-1
* hr-delay-2
* hr-delay-3

… and so on.

**Note:** If you wish to alter the speed differences between these steps, you will need to modify and compile out your own CSS from the Stylus provided. There are variables for the delay gap (between steps) and animation duration.

### Example Code

To help you out, here's an example structure showing the class names you could use.

    <section class="hr-slides-item">
      <!-- Your content goes in here-->
      <h1 class="hr-animate hr-left hr-delay-1">Hello World</h1>
      <p class="hr-animate hr-down fast">This will slide in from the left.</p>
    </section>

Classes prefixed with `hr` should be kept private to the functionality of the Hero Rotator. To add your own styles, you should add custom hooks instead.

    <section id="hello-world" class="hr-slides-item">
      <!-- Your content goes in here-->
      <h1 class="my-title hr-animate hr-left hr-delay-1">Hello World</h1>
      <p class="my-paragraph hr-animate hr-down fast">This will slide in from the left.</p>
    </section>


    #hello-world {
      background-color: black;
    }

    #hello-world .my-title {
      color: hotPink;
    }

    #hello-world .my-paragraph {
      color: white;
    }

If you struggle, I recommend taking a look at the example provided.

## Requirements

* jQuery (tested on 1.7)

## Browser Support

Tested and working in all browsers. Animations on elements use CSS3, so those elements will not animate in some browsers. However, the fading transition between slides will work for all.