Ext.define("Ext.layout.component.Draw",{alias:"layout.draw",extend:"Ext.layout.component.Auto",type:"draw",measureContentWidth:function(c){var d=c.target,a=d.surface,b=c.getPaddingInfo(),e=c.surfaceBBox||(c.surfaceBBox=a.items.getBBox());if(!d.viewBox){if(d.autoSize){return e.width+b.width}else{return e.x+e.width+b.width}}else{if(c.heightModel.shrinkWrap){return b.width}else{return e.width/e.height*(c.getProp("contentHeight")-b.height)+b.width}}},measureContentHeight:function(c){var d=c.target,a=d.surface,b=c.getPaddingInfo(),e=c.surfaceBBox||(c.surfaceBBox=a.items.getBBox());if(!c.target.viewBox){if(d.autoSize){return e.height+b.height}else{return e.y+e.height+b.height}}else{if(c.widthModel.shrinkWrap){return b.height}else{return e.height/e.width*(c.getProp("contentWidth")-b.width)+b.height}}},publishInnerWidth:function(b,a){b.setContentWidth(a-b.getFrameInfo().width,true)},publishInnerHeight:function(b,a){b.setContentHeight(a-b.getFrameInfo().height,true)},finishedLayout:function(c){var b=c.props,a=c.getPaddingInfo();this.owner.setSurfaceSize(b.contentWidth-a.width,b.contentHeight-a.height);this.callParent(arguments)}});