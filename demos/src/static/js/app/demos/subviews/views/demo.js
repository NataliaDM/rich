define(function (require, exports, module) {

var rich = require('rich');
var utils = require('app/utils');
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var Rectangle = require('app/shared/models/rectangle').Rectangle;

var SubviewDemo = rich.View.extend({

    initialize : function(){
        var rect1 = new Rectangle({
            tx: 0,
            ty: 0,
            size: [200, 200],
            color: utils.colors.blue[3]
        });

        var rect2 = new Rectangle({
            tx: 20,
            ty: 20,
            size: [100, 100],
            color: utils.colors.blue[5]
        });

        var rect3 = new Rectangle({
            tx: 20,
            ty: 20,
            size: [50, 50],
            color: utils.colors.blue[7],
            content: 'click'
        });

        this.rect1View = new RectangleView({model: rect1, zIndex: 3});
        this.rect2View = new RectangleView({model: rect2, zIndex: 4});
        this.rect3View = new RectangleView({model: rect3, zIndex: 5});

        this.rect2View.addSubview(this.rect3View);
        this.rect1View.addSubview(this.rect2View);

        this.addSubview(this.rect1View);

        this.listenTo(this.rect3View, 'click', this.wantsRemoveRect3View);
    },

    wantsRemoveRect3View: function(obj){
        this.rect2View.removeSubview(obj.view);
        this.rect3View = null;
    }
});

exports.SubviewDemo = SubviewDemo;

});
