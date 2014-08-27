define(function(require, exports, module) {

// Imports

var $ = require('jquery');
var _ = require('underscore');
var backbone = require('backbone');
var rich = require('rich');
var utils = require('rich/utils');
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var render = require('tests/utils/time').render;
var wait = require('tests/utils/time').wait;
var colors = require('tests/utils/colors').blue;
var css = require('tests/utils/css');
var matrix = require('tests/utils/matrix');
var log = require('tests/utils/log');
var Setup = require('tests/utils/setup').Setup;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('Application:', function() {

    beforeEach(function() {
        loadFixtures('famous-full.html');
    });


    afterEach(function() {

    });


    it('handles resize', function(done){
        var context = new Setup(done);

        var color0 = new Rectangle({
            color: colors[7]
        });

        var box0 = new RectangleView({model: color0});

        var layout = new rich.View({
            constraints: [
                {
                    item: box0,
                    attribute: 'width',
                    relatedBy: '==',
                    toItem: 'superview',
                    toAttribute: 'width',
                },

                {
                    item: box0,
                    attribute: 'height',
                    relatedBy: '==',
                    constant: 100
                }
            ]
        });

        layout.addSubview(box0);
        context.root.addSubview(layout);

        box0.onShow = function(){

            var size = box0.getSize();

            expect(size[0]).toEqual(window.innerWidth);
            expect(size[1]).toEqual(100);

            context.context.setSize([500, 500]);

            context.root._resizeHandler();

            // layout._render = function(){
            //     debugger;
            //     rich.View.prototype._render.apply(layout, arguments);
            // };

            render().then(function(){
                var size = box0.getSize();
                expect(size[0]).toEqual(500);
                expect(size[1]).toEqual(100);

                context.done();
            });


        };
    });

    it('handles CollectionView Horizontal Resize', function(done){
        var context = new Setup(done);

        var AltView = RectangleView.extend({
            size: [100, 0]
        });

        var color0 = new Rectangle({
            color: 'green'
        });

        var color1 = new Rectangle({
            color: 'red'
        });

        var color2 = new Rectangle({
            color: colors[5]
        });

        var color3 = new Rectangle({
            color: colors[4]
        });


        var collection = new backbone.Collection([color0, color1]);

        AltView.prototype._render = function(){
            //debugger;
            rich.View.prototype._render.apply(this, arguments);
        };

        var collectionView = new rich.CollectionView({
            collection: collection,
            orientation: 'horizontal',
            childView: AltView,
            spacing: 0,
        });

        var layout = new rich.View({
            constraints: function(){
                return [
                    {
                        item: collectionView,
                        attribute: 'height',
                        relatedBy: '==',
                        constant: 100,
                    }
                ];
            }
        });


        layout.addSubview(collectionView);
        context.root.addSubview(layout);
        collectionView.name = 'collectionView';

        layout.onShow = function(){
            var targetWidth = 100 + collectionView.spacing;
            var targetTranslation;

            var box0 = collectionView.children.findByIndex(0);
            var box1 = collectionView.children.findByIndex(1);

            collectionView.children.each(function(view, index){
                targetTranslation = (targetWidth) * index;
                expect(matrix.getTranslation(view.$el).x).toEqual(targetTranslation);
            });

            context.context.setSize([500, 500]);
            context.root._resizeHandler();


            // collectionView._render = function(){
            //     debugger;
            //     rich.View.prototype._render.apply(collectionView, arguments);
            // };

            render().then(function(){

                collectionView.children.each(function(view, index){
                    targetTranslation = (targetWidth) * index;
                    expect(matrix.getTranslation(view.$el).x).toEqual(targetTranslation);
                });

                context.done();
            });
        };
    });


}); // eof describe
}); // eof define
