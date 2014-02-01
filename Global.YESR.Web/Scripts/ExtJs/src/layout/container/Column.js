Ext.define("Ext.layout.container.Column",{extend:"Ext.layout.container.Container",alias:["layout.column"],alternateClassName:"Ext.layout.ColumnLayout",type:"column",itemCls:Ext.baseCSSPrefix+"column",targetCls:Ext.baseCSSPrefix+"column-layout-ct",columnWidthSizePolicy:{setsWidth:1,setsHeight:0},childEls:["innerCt"],manageOverflow:2,renderTpl:['<div id="{ownerId}-innerCt" class="',Ext.baseCSSPrefix,'column-inner">',"{%this.renderBody(out,values)%}",'<div class="',Ext.baseCSSPrefix,'clear"></div>',"</div>","{%this.renderPadder(out,values)%}"],getItemSizePolicy:function(a){if(a.columnWidth){return this.columnWidthSizePolicy}return this.autoSizePolicy},beginLayout:function(){this.callParent(arguments);this.innerCt.dom.style.width=""},calculate:function(c){var a=this,d=a.getContainerSize(c),b=c.state;if(b.calculatedColumns||(b.calculatedColumns=a.calculateColumns(c))){if(a.calculateHeights(c)){a.calculateOverflow(c,d);return}}a.done=false},calculateColumns:function(d){var l=this,a=l.getContainerSize(d),n=d.getEl("innerCt",l),k=d.childItems,h=k.length,b=0,f,m,e,c,g,j;if(!d.heightModel.shrinkWrap&&!d.targetContext.hasProp("height")){return false}if(!a.gotWidth){d.targetContext.block(l,"width");f=true}else{m=a.width;n.setWidth(m)}for(e=0;e<h;++e){c=k[e];g=c.getMarginInfo().width;if(!c.widthModel.calculated){j=c.getProp("width");if(typeof j!="number"){c.block(l,"width");f=true}b+=j+g}}if(!f){m=(m<b)?0:m-b;for(e=0;e<h;++e){c=k[e];if(c.widthModel.calculated){g=c.marginInfo.width;j=c.target.columnWidth;j=Math.floor(j*m)-g;j=c.setWidth(j);b+=j+g}}d.setContentWidth(b)}return !f},calculateHeights:function(g){var f=this,b=g.childItems,a=b.length,c,d,e;c=false;for(d=0;d<a;++d){e=b[d];if(!e.hasDomProp("height")){e.domBlock(f,"height");c=true}}if(!c){g.setContentHeight(f.innerCt.getHeight()+g.targetContext.getPaddingInfo().height)}return !c},finishedLayout:function(a){var b=a.bodyContext;if(b&&(Ext.isIE6||Ext.isIE7||Ext.isIEQuirks)){b.el.repaint()}this.callParent(arguments)},getRenderTarget:function(){return this.innerCt}});