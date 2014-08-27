define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var $ = require('jquery');
var rich = require('rich');
var utils = require('rich/utils');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var matrix = require('tests/utils/matrix');
var css = require('tests/utils/css');
var render = require('tests/utils/time').render;
var colors = require('tests/utils/colors').blue;
var Setup = require('tests/utils/setup').Setup;


describe('View+Core:', function() {

    beforeEach(function() {
        loadFixtures('famous.html');

    });

    afterEach(function() {

    });


    it('renders view', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;
        var $el = context.$el;

        var model = new Rectangle({
            size: [300, 500]
        });

        var view = new RectangleView({model: model});
        view.context = context;

        root.addSubview(view);

        render().then(function(){
            expect(view.$el).not.toBe(undefined);
            expect($el.children().length).toBe(1);
            context.done();
        });
    });


    it('uses modifier', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

        var model = new Rectangle({
            size: [300, 500],
        });

        var modifier = new Modifier({
            transform: Transform.translate(10, 20, 30)
        });

        var view = new RectangleView({model: model, modifier: modifier});
        view.context = context;

        root.addSubview(view);

        view.onShow = function(){
            var value = matrix.getTranslation(view.$el);

            expect(value).toEqual({
                x: 10, y: 20, z: 30
            });

            context.done();
        };
    });

    it('uses modifier as function', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

        var obj = {
            action: function(){
                return new Modifier({
                    transform: Transform.translate(10, 20, 0)
                });
            }
        };

        var spy = spyOn(obj, 'action').and.callThrough();
        var view = new rich.View({nestedSubviews: true, modifier: obj.action});

        root.addSubview(view);

        view.onShow = function(){
            var value = matrix.getTranslation(view.$el);

            expect(spy).toHaveBeenCalled();
            expect(value).toEqual({
                x: 10, y: 20, z: 0
            });

            context.done();
        };
    });

    it('uses modifier as array', function(done){

        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

        var degrees = 45;
        var radians = degrees * Math.PI / 180;

        var modifiers = [new Modifier({
                            transform: Transform.translate(10, 10, 0)
                        }),

                         new Modifier({
                            transform: Transform.rotateX(radians)
                         })];

        //debugger;
        var view = new rich.View({nestedSubviews: true, modifier: modifiers});

        root.addSubview(view);

        view.onShow = function(){
            var value = matrix.getTranslation(view.$el);
            expect(value).toEqual({
                x: 10, y: 10, z: 0
            });

            context.done();
        };
    });

    it('adds subviews', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

        var rect1 = new Rectangle({
            tx: 0,
            ty: 0,
            size: [200, 200],
            color: colors[3]
        });

        var rect2 = new Rectangle({
            tx: 20,
            ty: 20,
            size: [100, 100],
            color: colors[5]
        });

        var rect3 = new Rectangle({
            tx: 20,
            ty: 20,
            size: [50, 50],
            color: colors[7],
            content: 'click'
        });

        var rect1View = new RectangleView({model: rect1});
        var rect2View = new RectangleView({model: rect2});
        var rect3View = new RectangleView({model: rect3});

        rect2View.addSubview(rect3View);
        rect1View.addSubview(rect2View);

        root.addSubview(rect1View);

        rect3View.onShow = function(){
            var value1 = matrix.getTranslation(rect1View.$el);
            var value2 = matrix.getTranslation(rect2View.$el);
            var value3 = matrix.getTranslation(rect3View.$el);

            expect(value1).toEqual({
                x: 0, y: 0, z: 0
            });

            expect(value2).toEqual({
                x: 20, y: 20, z: 0
            });

            expect(value3).toEqual({
                x: 40, y: 40, z: 0
            });

            context.done();
        };
    });

    it('adds nested subviews', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

        var rect1 = new Rectangle({
            tx: 0,
            ty: 0,
            size: [200, 200],
            color: colors[3]
        });

        var rect2 = new Rectangle({
            tx: 20,
            ty: 20,
            size: [100, 100],
            color: colors[5]
        });

        var rect3 = new Rectangle({
            tx: 20,
            ty: 20,
            size: [50, 50],
            color: colors[7],
            content: 'click'
        });

        var view = new rich.View({nestedSubviews: true});

        var rect1View = new RectangleView({model: rect1});
        var rect2View = new RectangleView({model: rect2});
        var rect3View = new RectangleView({model: rect3});

        view.addSubview(rect1View);
        view.addSubview(rect2View);
        view.addSubview(rect3View);

        root.addSubview(view);

        view.onShow = function(){
            expect(view.$el).not.toBe(undefined);

            // <div class="famous-group famous-container-group">
            expect(view.$el.children().length).toBe(1);
            expect(view.$el.find('.famous-group > .famous-surface').length).toBe(3);

            var value1 = matrix.getTranslation(rect1View.$el);
            var value2 = matrix.getTranslation(rect2View.$el);
            var value3 = matrix.getTranslation(rect3View.$el);

            expect(value1).toEqual({
                x: 0, y: 0, z: 0
            });

            expect(value2).toEqual({
                x: 20, y: 20, z: 0
            });

            expect(value3).toEqual({
                x: 20, y: 20, z: 0
            });

            context.done();
        }
    });


    it('invalidates subview layouts', function(){

        // top to bottom
        var view1 = new rich.View();
        var view2 = new rich.View();
        var view3a = new rich.View();
        var view3b = new rich.View();
        var view4 = new rich.View();

        view1.addSubview(view2);
        view2.addSubview(view3a);
        view2.addSubview(view3b);
        view3a.addSubview(view4);

        spyOn(view2, 'invalidateLayout').and.callThrough();
        spyOn(view3a, 'invalidateLayout').and.callThrough();
        spyOn(view3b, 'invalidateLayout').and.callThrough();
        spyOn(view4, 'invalidateLayout').and.callThrough();

        view1.invalidateLayout();

        expect(view2.invalidateLayout.calls.count()).toBe(1);
        expect(view3a.invalidateLayout.calls.count()).toBe(1);
        expect(view3b.invalidateLayout.calls.count()).toBe(1);
        expect(view4.invalidateLayout.calls.count()).toBe(1);
    });


    it('invalidates subview', function(){
        // bottom to top
        var view1 = new rich.View();
        var view2 = new rich.View();
        var view3 = new rich.View();
        var view4 = new rich.View();

        // need to add the spies here, once a subview is added
        // the event listener will be bound.
        spyOn(view1, 'subviewDidChange').and.callThrough();
        spyOn(view2, 'subviewDidChange').and.callThrough();
        spyOn(view3, 'subviewDidChange').and.callThrough();

        view1.addSubview(view2);
        view2.addSubview(view3);
        view3.addSubview(view4);


        view4.invalidateView();

        expect(view1.subviewDidChange.calls.count()).toBe(1);
        expect(view2.subviewDidChange.calls.count()).toBe(1);
        expect(view3.subviewDidChange.calls.count()).toBe(1);
    });

    it('triggers onShow with subviews', function(done){

        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

        var color0 = new Rectangle({
            color: colors[7]
        });

        var box0 = new RectangleView({
            model: color0,
        });

        var box1 = new RectangleView({
            model: color0,
        });

        box0.addSubview(box1);

        box1.onShow = function(){
            expect(this.$el).not.toBe(undefined);
        };
        box0.onShow = function(){
            expect(this.$el).not.toBe(undefined);
        };

        var spy0 = spyOn(box0, 'onShow').and.callThrough();
        var spy1 = spyOn(box1, 'onShow').and.callThrough();

        render(1000).then(function(){
            expect(spy0).toHaveBeenCalled();
            expect(spy1).toHaveBeenCalled();
            context.done();
        });

        region.show(box0);
    });

}); // eof describe
}); // eof define
