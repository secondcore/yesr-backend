Ext.define("Ext.util.Point",{extend:"Ext.util.Region",statics:{fromEvent:function(a){a=(a.changedTouches&&a.changedTouches.length>0)?a.changedTouches[0]:a;return new this(a.pageX,a.pageY)}},constructor:function(a,b){this.callParent([b,a,b,a])},toString:function(){return"Point["+this.x+","+this.y+"]"},equals:function(a){return(this.x==a.x&&this.y==a.y)},isWithin:function(b,a){if(!Ext.isObject(a)){a={x:a,y:a}}return(this.x<=b.x+a.x&&this.x>=b.x-a.x&&this.y<=b.y+a.y&&this.y>=b.y-a.y)},roundedEquals:function(a){return(Math.round(this.x)==Math.round(a.x)&&Math.round(this.y)==Math.round(a.y))}},function(){this.prototype.translate=Ext.util.Region.prototype.translateBy});