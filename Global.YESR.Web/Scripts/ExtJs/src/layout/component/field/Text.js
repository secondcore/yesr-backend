Ext.define("Ext.layout.component.field.Text",{extend:"Ext.layout.component.field.Field",alias:"layout.textfield",requires:["Ext.util.TextMetrics"],type:"textfield",canGrowWidth:true,beginLayoutCycle:function(b){var a=this;a.callParent(arguments);if(b.shrinkWrap){b.inputContext.el.setStyle("height","")}},measureContentWidth:function(c){var g=this,b=g.owner,a=g.callParent(arguments),f=c.inputContext,j,i,d,h,e;if(b.grow&&g.canGrowWidth&&!c.state.growHandled){j=b.inputEl;i=Ext.util.Format.htmlEncode(j.dom.value||(b.hasFocus?"":b.emptyText)||"");i+=b.growAppend;d=j.getTextWidth(i)+f.getFrameInfo().width;h=b.growMax;e=Math.min(h,a);h=Math.max(b.growMin,h,e);d=Ext.Number.constrain(d,b.growMin,h);f.setWidth(d);c.state.growHandled=true;f.domBlock(g,"width");a=NaN}return a},publishInnerHeight:function(b,a){b.inputContext.setHeight(a-this.measureLabelErrorHeight(b))},beginLayoutFixed:function(d,a,e){var b=this,c=b.ieInputWidthAdjustment;if(c){b.owner.bodyEl.setStyle("padding-right",c+"px");if(e==="px"){a-=c}}b.callParent(arguments)}});