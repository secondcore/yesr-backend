Ext.define("Ext.chart.series.Series",{mixins:{observable:"Ext.util.Observable",labels:"Ext.chart.Label",highlights:"Ext.chart.Highlight",tips:"Ext.chart.Tip",callouts:"Ext.chart.Callout"},type:null,title:null,showInLegend:true,renderer:function(e,a,c,d,b){return c},shadowAttributes:null,triggerAfterDraw:false,constructor:function(a){var b=this;if(a){Ext.apply(b,a)}b.shadowGroups=[];b.mixins.labels.constructor.call(b,a);b.mixins.highlights.constructor.call(b,a);b.mixins.tips.constructor.call(b,a);b.mixins.callouts.constructor.call(b,a);b.addEvents({scope:b,itemmouseover:true,itemmouseout:true,itemmousedown:true,itemmouseup:true,mouseleave:true,afterdraw:true,titlechange:true});b.mixins.observable.constructor.call(b,a);b.on({scope:b,itemmouseover:b.onItemMouseOver,itemmouseout:b.onItemMouseOut,mouseleave:b.onMouseLeave});if(b.style){Ext.apply(b.seriesStyle,b.style)}},eachRecord:function(c,b){var a=this.chart;(a.substore||a.store).each(c,b)},getRecordCount:function(){var b=this.chart,a=b.substore||b.store;return a?a.getCount():0},isExcluded:function(a){var b=this.__excludes;return !!(b&&b[a])},setBBox:function(a){var e=this,c=e.chart,b=c.chartBBox,f=a?0:c.maxGutter[0],d=a?0:c.maxGutter[1],g,h;g={x:b.x,y:b.y,width:b.width,height:b.height};e.clipBox=g;h={x:(g.x+f)-(c.zoom.x*c.zoom.width),y:(g.y+d)-(c.zoom.y*c.zoom.height),width:(g.width-(f*2))*c.zoom.width,height:(g.height-(d*2))*c.zoom.height};e.bbox=h},onAnimate:function(b,a){var c=this;b.stopAnimation();if(c.triggerAfterDraw){return b.animate(Ext.applyIf(a,c.chart.animate))}else{c.triggerAfterDraw=true;return b.animate(Ext.apply(Ext.applyIf(a,c.chart.animate),{listeners:{afteranimate:function(){c.triggerAfterDraw=false;c.fireEvent("afterrender")}}}))}},getGutters:function(){return[0,0]},onItemMouseOver:function(b){var a=this;if(b.series===a){if(a.highlight){a.highlightItem(b)}if(a.tooltip){a.showTip(b)}}},onItemMouseOut:function(b){var a=this;if(b.series===a){a.unHighlightItem();if(a.tooltip){a.hideTip(b)}}},onMouseLeave:function(){var a=this;a.unHighlightItem();if(a.tooltip){a.hideTip()}},getItemForPoint:function(a,h){if(!this.items||!this.items.length||this.seriesIsHidden){return null}var f=this,b=f.items,g=f.bbox,e,c,d;if(!Ext.draw.Draw.withinBox(a,h,g)){return null}for(c=0,d=b.length;c<d;c++){if(b[c]&&this.isItemInPoint(a,h,b[c],c)){return b[c]}}return null},isItemInPoint:function(a,d,c,b){return false},hideAll:function(){var g=this,f=g.items,k,e,d,c,a,h,b;g.seriesIsHidden=true;g._prevShowMarkers=g.showMarkers;g.showMarkers=false;g.hideLabels(0);for(d=0,e=f.length;d<e;d++){k=f[d];h=k.sprite;if(h){h.setAttributes({hidden:true},true)}if(h&&h.shadows){b=h.shadows;for(c=0,a=b.length;c<a;++c){b[c].setAttributes({hidden:true},true)}}}},showAll:function(){var a=this,b=a.chart.animate;a.chart.animate=false;a.seriesIsHidden=false;a.showMarkers=a._prevShowMarkers;a.drawSeries();a.chart.animate=b},hide:function(){if(this.items){var g=this,b=g.items,d,c,a,f,e;if(b&&b.length){for(d=0,f=b.length;d<f;++d){if(b[d].sprite){b[d].sprite.hide(true);e=b[d].shadows||b[d].sprite.shadows;if(e){for(c=0,a=e.length;c<a;++c){e[c].hide(true)}}}}g.hideLabels()}}},getLegendColor:function(a){var b=this,d,c;if(b.seriesStyle){d=b.seriesStyle.fill;c=b.seriesStyle.stroke;if(d&&d!="none"){return d}if(c){return c}}return(b.colorArrayStyle)?b.colorArrayStyle[b.seriesIdx%b.colorArrayStyle.length]:"#000"},visibleInLegend:function(a){var b=this.__excludes;if(b){return !b[a]}return !this.seriesIsHidden},setTitle:function(a,d){var c=this,b=c.title;if(Ext.isString(a)){d=a;a=0}if(Ext.isArray(b)){b[a]=d}else{c.title=d}c.fireEvent("titlechange",d,a)}});