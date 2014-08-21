[Famo.us]: https://github.com/famous/famous "Famo.us"
[Marionette.js]: https://github.com/marionettejs/backbone.marionette "Marionette.js"
[Demos]: https://github.com/blitzagency/rich/tree/develop/demos/src/static/js/app/demos "Demos"
[Cassowary]: https://github.com/slightlyoff/cassowary.js/ "Cassowary"

Rich
=======

Welcome to the Rich GitHub Repo.

## About
Rich is our take on the [Famo.us] + [Marionette.js][] framework.  It allows you to write code that looks and feels like [Marionette.js][] but with all of the power of [Famo.us].

We are currently in very active development and things WILL change on a daily/weekly basis.  This includes core api, adding/removing of things, and a huge amount of instability.  Please keep this in mind if you decide to try things out.

## Approach
The intent behind Rich is to keep the [Marionette.js][] *view intact while backing that view by the [Famo.us] engine.  We have kept nearly all [Marionette.js][] logic and are currently built ontop of the latest [Marionette.js][] code.

## What do i get?
Rich follows the same ideology as [Marionette.js][] but due to how [Famo.us] rolls, we had to tweek a few things.  First off we don't have layouts.  The concept of a layout isn't really needed due to rich's constraints system.  Normally you would use a layout to hold containers for things and then position those containers where you want them.  This way you have sections of your site that you can swap content in and out of.  In Rich, we substitute that same concept with constraints (more on that later).

With Rich you also get CollectionViews, ItemViews, And Regions.  Each of them have slight tweeks and things you'll want to read up on.  More to come on each of these later.

## What are these constraints you speak of?
[Famo.us] is powerful...very powerful.  But it can get a bit trixy to position things in relation to other things, this is why we created constraints.  Constraints allow you to create a view, give it a height, width, top, left, and then if you want to have a 2nd view always be positioned in relation to that first view...done.  Heres a quick example of that:

```javascript
var myView = new rich.ItemView({
    constraints:[
        {
            item: 'view1',
            attribute: 'width',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.5
        },
        {
            item: 'view1',
            attribute: 'height',
            constant: 125,
            relatedBy: '==',
        },
        {
            item: 'view2',
            attribute: 'left',
            relatedBy: '==',
            toItem: 'view1',
            toAttribute: 'right'
        },
        {
            item: 'view2',
            attribute: 'top',
            relatedBy: '==',
            toItem: 'view1',
            toAttribute: 'bottom'
        },
    ],
    initialize: function(){
        this.view1 = new rich.ItemView();
        this.view2 = new rich.ItemView();
    }
})

```

in this case, you can see that the first view's width is half of it's parent view, and it's height is a static value at 125px.

You can check out a more comprehensive example of this [here](https://github.com/dinopetrone/rich-todo/blob/master/src/static/js/app/todo/constraints/todo-layout.js) and [here](https://github.com/dinopetrone/rich-todo/blob/master/src/static/js/app/todo/views/todo-layout.js#L17-L23)

One of the powerful things that you can do with this is resonsive constraints based on other variables (ex: window.outerWidth).  Example [here](https://github.com/dinopetrone/rich-todo/blob/master/src/static/js/app/todo/views/todo-layout.js#L18).

And due to how rich sets up it's initial containers, we automatically listen for a resize of that container and automatically handle the rebuild of the constraints when needed.

Rich's constraints system is backed by [Cassowary][] which is the same algorithm used in OSX and iOS 6+.  And just to make it a little extra special, we incorporated a visual formatting language to allow for quick constraints.  Here's a quick example:


```javascript
var myView = new rich.ItemView({
    constraints:[
        '|-20-[view1(>120)]-20-[view2(200)]-|',
    ],
    initialize: function(){
        this.view1 = new rich.ItemView();
        this.view2 = new rich.ItemView();
    }
})

```

As you can see, VFL is extremely powerful and allows you to do some really quick constraints.  In this we said we want view1 to be 20px from the left, have a width greater than 120px, have a 20px right padding, then view2 has a 200px width and is butted up agaist the right wall and view1's right side.  As you can see it's quick and easy to read as well.  At a single glance you can see how this view would be layed out.


## Can i have multiple [Famo.us] context's?
YUP!  most of the time you'll only need 1, and you do want to be careful regarding the number of context containers you create as they get expensive.  [Heres an example](https://github.com/dinopetrone/rich-todo/blob/master/src/static/js/app/app.js#L6-L10) of how you would go about initializing a context and adding your initial view into it.  We wanted to keep the same feel of how you would go about regeistering a region, but obviously rich is a tad different, so it initialization is a tad differnt than a region.

## Regions? Yup!
A region is not a top level container like it is in [Marionette.js][], we use addContexts() for that on the app itself.  A region at it's core is a view that has the ability to swap content in and out of.  So you could do something like:

```javascript
var myView = new rich.ItemView({
    initialize: function(){
        this.fooRegion = new rich.Region();
        this.fooRegion.show(new rich.ItemView());
    }
})

```

This is very helpful when you have a section of your site that you'd like to have constrained to a certain height and width and you want to swap content in and out of it easily.  You would just add a constraint to the region, and toss content in and out of the region and the content will auto fill up the size of it's region.

## View Hierarchy
Everything in rich extends our base view.  Rich's base view is required because of how it handles the view hierarchy.  You construct the hierarchy by creating a view, and adding a view inside of that view.  Example:


```javascript
var myView = new rich.ItemView({
    initialize: function(){
        this.chidView = new rich.ItemView();
        this.addSubview(this.chidView);
    }
})

```

Why did we go this path?  Because everything is a view, we have the ability to have the views talk to eachother up and down the tree.  One example of this is how we handle invalidation of a view.  Every view, similar to a [Famo.us] view has a render() function.  Every rich view will by default store a cached version of it's own render() response.  When render is called it will return that cache.  If a view updates, it will trigger an event up to it's parent. That parent then grabs the update from the child, reaches into it's own cached render response and patches it.  Thus only modifying the parts that are required and not having the entire root rendernode traversing the tree each render cycle.

In addition, the base view allows the constraints system to have a hierarchical structure as well. If i have a parent size [100x100], it's children will all inherit that size.  If I add a constraint to any child down the tree the children will inherit the parents size.

At it's core, our base view allows rich to tightly couple things enough to allow it to make enough assumptions to do a ton of work for you.  I don't know about you...but i like when work is done for me. :)


## Modifiers
Rich allows for modifiers just like [Famo.us] does.  Rich's approach on modifiers is that they are attached to views.  Here is an example of a view with a modifier on it:

```javascript
var myView = new rich.ItemView({
    modifier: function(){
        return new Modifier()
    }
})

```
Which is great! ..But what if i need to add a bunch of constraints?

```javascript
var myView = new rich.ItemView({
    constraints: function(){
        return [new Modifier(), new Modifier(), new Modifier()]
    }
})

```
Constraints is a _.result() so you can have constraints be a function that returns an array, or just have it equal to an array.  

```javascript
var mod1 = new Modifier()
var mod2 = new Modifier()
var myView = new rich.ItemView({
    constraints: [mod1, mod2]
})
```

Or, if you want to use the famous physics engine, you can also have it return the result of a particle:

```javascript
var mod1 = new Modifier()
var particle = new Particle()
var myView = new rich.ItemView({
    constraints: [mod1, particle]
})
```


## Transitions
because rich caches the render() response we have modified how you interact with modifiers.  If you don't need to do anything fancy, you can just call `myView.setTransform(transform, transition)` and rich will handle it for you.  If you need to target a specific modifier, you must pass an index to as a 3rd argument.  `myView.setTransform(transform, transition, 1)`.  To find out when it's completed, we made the response of setTransform be a promise.  So you would do something like this:

```
myView.setTransform(transform, transition, 1).then(function(){
    console.log('called')
})
```

but...lets say you need to get fancy, and you have a particle that's in the engine that needs to be rendering every frame.  All you need to do is the following:

```javascript
var particle = new Particle()
var myView = new rich.ItemView({
    constraints: particle,
    needsDisplay: true
})
```

This will trigger the need for this view to be updated every frame.  Keep in mind this should only be turned on when you need the view rendered.  Setting it to true on all views will basically kill al caching that's taking place in your views.

## CollectionView
Rich's collectionview extends [Marionette.js][]'s collectionview, but have a very different way of handling the actual dom representation.  A vanilla collectionview will look and act exactly the same as it's [Marionette.js][] equivelant aside from the fact that you can inject a modifier on it and get crazy with animations.


## Examples
- [Standard Todo app](http://dinopetrone.github.io/rich-todo/src/)


## Getting Started
Download this repo, [Famo.us], and [Marionette.js][], and off you go.  [Demos][] can be viewed by running `$ make serve` from inside of the demos directory.
