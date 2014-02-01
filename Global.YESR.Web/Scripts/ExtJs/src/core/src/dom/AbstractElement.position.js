(function(){var a=Ext.dom.AbstractElement;a.override({getX:function(b){return this.getXY(b)[0]},getY:function(b){return this.getXY(b)[1]},getXY:function(){var b=window.webkitConvertPointFromNodeToPage(this.dom,new WebKitPoint(0,0));return[b.x,b.y]},getOffsetsTo:function(b){var d=this.getXY(),c=Ext.fly(b,"_internal").getXY();return[d[0]-c[0],d[1]-c[1]]},setX:function(b){return this.setXY([b,this.getY()])},setY:function(b){return this.setXY([this.getX(),b])},setLeft:function(b){this.setStyle("left",a.addUnits(b));return this},setTop:function(b){this.setStyle("top",a.addUnits(b));return this},setRight:function(b){this.setStyle("right",a.addUnits(b));return this},setBottom:function(b){this.setStyle("bottom",a.addUnits(b));return this},setXY:function(f){var c=this,e,b,d;if(arguments.length>1){f=[f,arguments[1]]}e=c.translatePoints(f);b=c.dom.style;for(d in e){if(!e.hasOwnProperty(d)){continue}if(!isNaN(e[d])){b[d]=e[d]+"px"}}return c},getLeft:function(b){return parseInt(this.getStyle("left"),10)||0},getRight:function(b){return parseInt(this.getStyle("right"),10)||0},getTop:function(b){return parseInt(this.getStyle("top"),10)||0},getBottom:function(b){return parseInt(this.getStyle("bottom"),10)||0},translatePoints:function(b,h){h=isNaN(b[1])?h:b[1];b=isNaN(b[0])?b:b[0];var e=this,f=e.isStyle("position","relative"),g=e.getXY(),c=parseInt(e.getStyle("left"),10),d=parseInt(e.getStyle("top"),10);c=!isNaN(c)?c:(f?0:e.dom.offsetLeft);d=!isNaN(d)?d:(f?0:e.dom.offsetTop);return{left:(b-g[0]+c),top:(h-g[1]+d)}},setBox:function(e){var d=this,c=e.width,b=e.height,g=e.top,f=e.left;if(f!==undefined){d.setLeft(f)}if(g!==undefined){d.setTop(g)}if(c!==undefined){d.setWidth(c)}if(b!==undefined){d.setHeight(b)}return this},getBox:function(h,k){var i=this,f=i.dom,d=f.offsetWidth,m=f.offsetHeight,o,g,e,c,n,j;if(!k){o=i.getXY()}else{if(h){o=[0,0]}else{o=[parseInt(i.getStyle("left"),10)||0,parseInt(i.getStyle("top"),10)||0]}}if(!h){g={x:o[0],y:o[1],0:o[0],1:o[1],width:d,height:m}}else{e=i.getBorderWidth.call(i,"l")+i.getPadding.call(i,"l");c=i.getBorderWidth.call(i,"r")+i.getPadding.call(i,"r");n=i.getBorderWidth.call(i,"t")+i.getPadding.call(i,"t");j=i.getBorderWidth.call(i,"b")+i.getPadding.call(i,"b");g={x:o[0]+e,y:o[1]+n,0:o[0]+e,1:o[1]+n,width:d-(e+c),height:m-(n+j)}}g.left=g.x;g.top=g.y;g.right=g.x+g.width;g.bottom=g.y+g.height;return g},getPageBox:function(f){var i=this,d=i.dom,k=d.offsetWidth,g=d.offsetHeight,n=i.getXY(),m=n[1],c=n[0]+k,j=n[1]+g,e=n[0];if(!d){return new Ext.util.Region()}if(f){return new Ext.util.Region(m,c,j,e)}else{return{left:e,top:m,width:k,height:g,right:c,bottom:j}}}})}());