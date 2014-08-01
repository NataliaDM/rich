define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var $ = require('jquery');
var rich = require('rich');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var matrix = require('tests/utils/matrix');
var css = require('tests/utils/css');
var render = require('tests/utils/time').render;
var colors = require('tests/utils/colors').blue;


describe('View+Z-Index:', function() {
    var region;
    var context;
    var $el;

    beforeEach(function() {
        loadFixtures('famous.html');

        region = new rich.Region({
            el: '#famous-context'
        });

        $el = region.el;
        context = region.context;
        expect($el.length).toBe(1);
        expect(context).not.toBe(undefined);
        //jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });


    afterEach(function() {
        region = null;
    });


    it('uses default zIndex', function(done){
        var model = new Rectangle({
            size: [300, 500],
        });

        var view = new RectangleView({model: model});
        view.context = context;

        context.add(view);

        render().then(function(){
            var value = css.getZIndex(view.$el);
            expect(value).toBe(1);
            done();
        });
    });

    it('uses provided zIndex', function(done){
        var model = new Rectangle({
            size: [300, 500],
        });

        var view = new RectangleView({model: model, zIndex: 99});
        view.context = context;

        context.add(view);

        render().then(function(){
            var value = css.getZIndex(view.$el);
            expect(value).toBe(99);
            done();
        });
    });

    it('adjusts zIndex if superview is greater', function(done){
        var model = new Rectangle({
            size: [300, 500],
        });

        var view1 = new RectangleView({model: model, zIndex: 3});
        var view2 = new RectangleView({model: model, zIndex: 2});

        view1.addSubview(view2);
        view1.context = context;
        context.add(view1);

        render().then(function(){
            var value = css.getZIndex(view2.$el);
            expect(value).toBe(4);
            done();
        });
    });

    it('forces zIndex if superview is greater', function(done){
        var model = new Rectangle({
            size: [300, 500],
        });

        var view1 = new RectangleView({model: model, zIndex: 3});
        var view2 = new RectangleView({model: model, zIndex: 2});

        view1.addSubview(view2, 1);
        view1.context = context;
        context.add(view1);

        render().then(function(){
            var value = css.getZIndex(view2.$el);
            expect(value).toBe(1);
            done();
        });
    });

}); // eof describe
}); // eof define
