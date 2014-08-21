define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var $ = require('jquery');
var rich = require('rich');
var backbone = require('backbone');
var utils = require('rich/utils');
var Modifier = require('famous/core/Modifier');
var Engine = require('famous/core/Engine');
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var render = require('tests/utils/time').render;
var wait = require('tests/utils/time').wait;
var css = require('tests/utils/css');
var colors = require('tests/utils/colors').blue;
var log = require('tests/utils/log');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('Region:', function() {
    var root;
    var region;
    var context;
    var $el;

    beforeEach(function() {
        loadFixtures('famous.html');

        root = utils.initializeRichContext({
            el: '#famous-context'
        });

        region = new rich.Region();
        root.addSubview(region);

        $el = $(root.context.container);
        context = root.context;

        expect($el.length).toBe(1);
    });

    afterEach(function() {
        utils.disposeRichContext(root);
        region = null;
        root = null;
    });


    xit('view inherits size', function(done){

        var color0 = new Rectangle({
            color: colors[7]
        });

        var box0 = new RectangleView({
            model: color0,
        });

        box0.onShow = function(){
            var size = css.getSize(box0.$el);
            expect(size).toEqual([1000, 800]);
            done();
        };

        region.show(box0);
    });

    xit('uses constraints', function(done){

        var color0 = new Rectangle({
            color: colors[7]
        });

        var box0 = new RectangleView({
            model: color0,
        });

        region.constraints = function(){
            return [
                {
                    item: box0,
                    attribute: 'height',
                    relatedBy: '==',
                    constant: 100
                }
            ];
        };

        box0.onShow = function(){
            var size = css.getSize(box0.$el);
            expect(size).toEqual([1000, 100]);
            done();
        };

        region.show(box0);
    });

    xit('swaps views', function(done){

        var color0 = new Rectangle({
            color: colors[7]
        });

        var box0 = new RectangleView({
            model: color0,
        });


        var color1 = new Rectangle({
            color: 'red'
        });

        var box1 = new RectangleView({
            model: color1,
        });

        box0.name = 'box0';
        box1.name = 'box1';

        region.constraints = function(){
            return [
                {
                    item: 'currentView',
                    attribute: 'height',
                    relatedBy: '==',
                    constant: 100
                }
            ];
        };

        render().then(function(){
            var size = css.getSize(box0.$el);
            expect(size).toEqual([1000, 100]);
            region.show(box1);
            render().then(function(){
                var size = css.getSize(box1.$el);
                expect(size).toEqual([1000, 100]);
                done();
            });
        });

        region.show(box0);
    });

    xit('applies h/w constraints to subviews children', function(done){

        var color0 = new Rectangle({
            color: colors[7]
        });

        var box0 = new RectangleView({
            model: color0,
        });


        var color1 = new Rectangle({
            color: 'red'
        });

        var box1 = new RectangleView({
            model: color1,
        });

        box0.addSubview(box1);

        render().then(function(){
            expect(box0.getSize()).toEqual([1000, 800]);
            expect(box1.getSize()).toEqual([1000, 800]);
            done();
        });

        region.show(box0);
    });

    xit('applies h/w constraints to subviews children', function(done){

        var color0 = new Rectangle({
            color: colors[7]
        });

        var box0 = new RectangleView({
            model: color0,
        });


        var color1 = new Rectangle({
            color: 'red'
        });

        var box1 = new RectangleView({
            model: color1,
        });

        var parent = new rich.View();

        parent.addSubview(box0);
        box0.addSubview(box1);

        render().then(function(){
            expect(box0.getSize()).toEqual([1000, 800]);
            expect(box1.getSize()).toEqual([1000, 800]);
            done();
        });

        region.show(parent);
    });

    xit('applies h/w constraints to subviews children with nestedSubviews', function(done){

        var color0 = new Rectangle({
            color: colors[7]
        });

        var box0 = new RectangleView({
            model: color0,
        });


        var color1 = new Rectangle({
            color: 'red'
        });

        var box1 = new RectangleView({
            model: color1,
        });

        var parent = new rich.View({
            nestedSubviews: true
        });

        parent.addSubview(box0);
        box0.addSubview(box1);

        render().then(function(){
            expect(box0.getSize()).toEqual([1000, 800]);
            expect(box1.getSize()).toEqual([1000, 800]);
            done();
        });

        region.show(parent);
    });

    xit('applies h/w constraints to collection view', function(done){

        var collection = new backbone.Collection();

        var collectionView = new rich.CollectionView({
            collection: collection,
            childView: RectangleView
        });

        region.show(collectionView);

        render().then(function(){
            expect(region.getSize()).toEqual([1000, 800]);
            expect(collectionView.getSize()).toEqual([1000, 800]);
            done();
        });
    });

    it('applies h/w constraints to collection views children', function(done){

        var collection = new backbone.Collection([
            new Rectangle({
                color: colors[5]
            }),

            new Rectangle({
                color: colors[7]
            }),
        ]);

        var collectionView = new rich.CollectionView({
            collection: collection,
            childView: RectangleView,
            sizeForViewAtIndex: function(){
                return [null, 50];
            }
        });

        region.show(collectionView);

        render().then(function(){
            expect(region.getSize()).toEqual([1000, 800]);
            log.autolayout(region.currentView, {label: 'currentView', nodes: 'wh'});
            log.autolayout(collectionView, {label: 'collectionView', nodes: 'wh'});

            collectionView.children.each(function(child){
                log.autolayout(collectionView, {nodes: 'wh'});
            });
            //done();
        });
    });

}); // eof describe
}); // eof define
