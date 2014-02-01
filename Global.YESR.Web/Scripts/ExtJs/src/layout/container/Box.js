Ext.define("Ext.layout.container.Box",{alias:["layout.box"],extend:"Ext.layout.container.Container",alternateClassName:"Ext.layout.BoxLayout",requires:["Ext.layout.container.boxOverflow.None","Ext.layout.container.boxOverflow.Menu","Ext.layout.container.boxOverflow.Scroller","Ext.util.Format","Ext.dd.DragDropManager"],defaultMargins:{top:0,right:0,bottom:0,left:0},padding:0,pack:"start",flex:undefined,stretchMaxPartner:undefined,type:"box",scrollOffset:0,itemCls:Ext.baseCSSPrefix+"box-item",targetCls:Ext.baseCSSPrefix+"box-layout-ct",innerCls:Ext.baseCSSPrefix+"box-inner",availableSpaceOffset:0,reserveOffset:true,manageMargins:true,childEls:["innerCt","targetEl"],renderTpl:["{%var oc,l=values.$comp.layout,oh=l.overflowHandler;","if (oh.getPrefixConfig!==Ext.emptyFn) {","if(oc=oh.getPrefixConfig())dh.generateMarkup(oc, out)","}%}",'<div id="{ownerId}-innerCt" class="{[l.innerCls]} {[oh.getOverflowCls()]}" role="presentation">','<div id="{ownerId}-targetEl" style="position:absolute;',"width:20000px;","left:0px;top:0px;",'height:1px">',"{%this.renderBody(out, values)%}","</div>","</div>","{%if (oh.getSuffixConfig!==Ext.emptyFn) {","if(oc=oh.getSuffixConfig())dh.generateMarkup(oc, out)","}%}",{disableFormats:true,definitions:"var dh=Ext.DomHelper;"}],constructor:function(a){var c=this,b;c.callParent(arguments);c.flexSortFn=Ext.Function.bind(c.flexSort,c);c.initOverflowHandler();b=typeof c.padding;if(b=="string"||b=="number"){c.padding=Ext.util.Format.parseBox(c.padding);c.padding.height=c.padding.top+c.padding.bottom;c.padding.width=c.padding.left+c.padding.right}},getNames:function(){return this.names},getItemSizePolicy:function(d,e){var c=this,f=c.sizePolicy,g=c.align,b=g,a;if(g==="stretch"){a=(e||c.owner.getSizeModel())[c.names.height];if(a.shrinkWrap){b="stretchmax"}}else{if(g!=="stretchmax"){b=""}}if(d.flex){f=f.flex}return f[b]},flexSort:function(d,c){var e=this.getNames().maxWidth,f=Infinity;d=d.target[e]||f;c=c.target[e]||f;if(!isFinite(d)&&!isFinite(c)){return 0}return d-c},isItemBoxParent:function(a){return true},isItemShrinkWrap:function(a){return true},minSizeSortFn:function(d,c){return c.available-d.available},roundFlex:function(a){return Math.ceil(a)},beginCollapse:function(b){var a=this;if(a.direction==="vertical"&&b.collapsedVertical()){b.collapseMemento.capture(["flex"]);delete b.flex}else{if(a.direction==="horizontal"&&b.collapsedHorizontal()){b.collapseMemento.capture(["flex"]);delete b.flex}}},beginExpand:function(a){a.collapseMemento.restore(["flex"])},beginLayout:function(c){var b=this,e=b.owner.stretchMaxPartner,a=b.innerCt.dom.style,d=b.getNames();b.overflowHandler.beginLayout(c);if(typeof e==="string"){e=Ext.getCmp(e)||b.owner.query(e)[0]}c.stretchMaxPartner=e&&c.context.getCmp(e);b.callParent(arguments);c.innerCtContext=c.getEl("innerCt",b);b.scrollParallel=!!(b.owner.autoScroll||b.owner[d.overflowX]);b.scrollPerpendicular=!!(b.owner.autoScroll||b.owner[d.overflowY]);if(b.scrollParallel){b.scrollPos=b.owner.getTargetEl().dom[d.scrollLeft]}a.width="";a.height="";b.cacheFlexes(c)},beginLayoutCycle:function(b,l){var h=this,e=h.align,g=h.getNames(),k=h.pack,j=g.heightModel,d,m,c,a,f;h.overflowHandler.beginLayoutCycle(b,l);h.callParent(arguments);b.parallelSizeModel=b[g.widthModel];b.perpendicularSizeModel=b[j];b.boxOptions={align:e={stretch:e=="stretch",stretchmax:e=="stretchmax",center:e==g.center},pack:k={center:k=="center",end:k=="end"}};if(e.stretch&&b.perpendicularSizeModel.shrinkWrap){e.stretchmax=true;e.stretch=false}if(b.parallelSizeModel.shrinkWrap){k.center=k.end=false}if(e.stretchmax){d=b.childItems;a=d.length;f=h.sizeModels.shrinkWrap;for(c=0;c<a;++c){m=d[c];if(!m[j].configured){m[j]=f}}}},cacheFlexes:function(d){var j=this.getNames(),l=j.widthModel,e=0,g=d.childItems,f=g.length,k=[],a=0,c=j.minWidth,b,m,h;while(f--){m=g[f];if(m[l].calculated){b=m.target;m.flex=h=b.flex;if(h){e+=h;k.push(m);a+=b[c]||0}}}d.flexedItems=k;d.flexedMinSize=a;d.totalFlex=e;Ext.Array.sort(k,this.flexSortFn)},calculate:function(d){var b=this,a=b.getContainerSize(d),g=b.getNames(),c=d.state,f=c.boxPlan||(c.boxPlan={}),e=Ext.getScrollbarSize()[g.width];f.targetSize=a;if(e&&b.scrollPerpendicular&&d.parallelSizeModel.shrinkWrap&&!d.boxOptions.align.stretch&&!d.perpendicularSizeModel.shrinkWrap){c.additionalScrollbarWidth=e;if(!a[g.gotHeight]){b.done=false;return}}else{c.additionalScrollbarWidth=0}if(!d.parallelSizeModel.shrinkWrap&&!a[g.gotWidth]){b.done=false;return}if(!c.parallelDone){c.parallelDone=b.calculateParallel(d,g,f)}if(!c.perpendicularDone){c.perpendicularDone=b.calculatePerpendicular(d,g,f)}if(c.parallelDone&&c.perpendicularDone){if(b.owner.dock&&(Ext.isIE6||Ext.isIE7||Ext.isIEQuirks)&&!b.owner.width&&!b.horizontal){f.isIEVerticalDock=true;f.calculatedWidth=f.maxSize+d.getPaddingInfo().width+d.getFrameInfo().width}b.publishInnerCtSize(d,b.reserveOffset?b.availableSpaceOffset:0);if(b.done&&d.childItems.length>1&&d.boxOptions.align.stretchmax&&!c.stretchMaxDone){b.calculateStretchMax(d,g,f);c.stretchMaxDone=true}}else{b.done=false}},calculateParallel:function(f,j,b){var z=this,k=f.parallelSizeModel.shrinkWrap,v=j.width,a=f.childItems,c=j.left,o=j.right,n=j.setWidth,w=a.length,t=f.flexedItems,p=t.length,s=f.boxOptions.pack,h=z.padding,d=h[c],y=d+h[o]+z.scrollOffset+(z.reserveOffset?z.availableSpaceOffset:0),r,g,e,u,l,q,x,m;for(r=0;r<w;++r){l=a[r];g=l.marginInfo||l.getMarginInfo();y+=g[v];if(!l.flex){y+=l.getProp(v);if(isNaN(y)){return false}}}if(k){b.availableSpace=0;b.tooNarrow=false}else{b.availableSpace=b.targetSize[v]-y;b.tooNarrow=b.availableSpace<f.flexedMinSize;if(b.tooNarrow&&Ext.getScrollbarSize()[j.height]&&z.scrollParallel&&f.state.perpendicularDone){f.state.perpendicularDone=false;for(r=0;r<w;++r){a[r].invalidate()}}}m=y;e=b.availableSpace;u=f.totalFlex;for(r=0;r<p;r++){l=t[r];q=l.flex;x=z.roundFlex((q/u)*e);x=l[n](x);m+=x;e=Math.max(0,e-x);u-=q}if(s.center){d+=e/2;if(d<0){d=0}}else{if(s.end){d+=e}}for(r=0;r<w;++r){l=a[r];g=l.marginInfo;d+=g[c];l.setProp(j.x,d);d+=g[o]+l.props[v]}f.state.contentWidth=m+f.targetContext.getPaddingInfo()[v];if(!f.state.additionalScrollbarWidth){f[j.setContentWidth](f.state.contentWidth)}return true},calculatePerpendicular:function(o,s,c){var C=this,a=o.perpendicularSizeModel.shrinkWrap,d=c.targetSize,b=o.childItems,A=b.length,F=Math.max,D=s.height,k=s.setHeight,n=s.top,B=s.y,r=C.padding,t=r[n],f=d[D]-t-r[s.bottom],y=o.boxOptions.align,m=y.stretch,w=y.stretchmax,l=y.center,x=0,E,z,e,q,p,v,u,h,j,g;if(m||(l&&!a)){if(isNaN(f)){return false}}if(m&&C.scrollParallel&&c.tooNarrow){j=Ext.getScrollbarSize().height;f-=j;c.targetSize[D]-=j}if(m){v=f}else{for(z=0;z<A;z++){u=b[z];q=u.marginInfo||u.getMarginInfo();e=u.getProp(D);if(isNaN(x=F(x,e+q[D],u.target[s.minHeight]||0))){return false}}h=o.stretchMaxPartner;if(h){o.setProp("maxChildHeight",x);g=h.childItems;if(g&&g.length){x=F(x,h.getProp("maxChildHeight"));if(isNaN(x)){return false}}}c.maxSize=x;o[s.setContentHeight](x+C.padding[D]+o.targetContext.getPaddingInfo()[D]);if(w){v=x}else{if(l){v=a?x:F(f,x);v-=o.innerCtContext.getBorderInfo()[D]}}}for(z=0;z<A;z++){u=b[z];q=u.marginInfo||u.getMarginInfo();E=t+q[n];if(m){u[k](v-q[D])}else{if(l){p=v-u.props[D];if(p>0){E=t+Math.round(p/2)}}}u.setProp(B,E)}return true},calculateStretchMax:function(d,j,l){var k=this,g=j.height,m=j.width,f=d.childItems,b=f.length,n=l.maxSize,a=k.onBeforeInvalidateChild,p=k.onAfterInvalidateChild,o,h,e,c;for(e=0;e<b;++e){o=f[e];h=o.props;c=n-o.getMarginInfo()[g];if(c!=h[g]||o[j.heightModel].constrained){o.invalidate({before:a,after:p,layout:k,childWidth:h[m],childHeight:c,childX:h.x,childY:h.y,names:j})}}},completeLayout:function(b){var a=this;a.overflowHandler.completeLayout(b);if(a.scrollParallel){a.owner.getTargetEl().dom[a.getNames().scrollLeft]=a.scrollPos}},finishedLayout:function(a){this.overflowHandler.finishedLayout(a);this.callParent(arguments)},onBeforeInvalidateChild:function(b,a){var c=a.names.heightModel;if(!b[c].constrainedMax){b[c]=Ext.layout.SizeModel.calculated}},onAfterInvalidateChild:function(b,a){var c=a.names;b.setProp("x",a.childX);b.setProp("y",a.childY);if(b[c.heightModel].calculated){b[c.setHeight](a.childHeight)}if(b[c.widthModel].calculated){b[c.setWidth](a.childWidth)}},publishInnerCtSize:function(b,e){var i=this,h=i.getNames(),g=h.height,k=h.width,f=b.boxOptions.align,o=i.owner.dock,l=i.padding,j=b.state.boxPlan,d=j.targetSize,n=d[g],p=b.innerCtContext,a=h.contentWidth,c=(b.parallelSizeModel.shrinkWrap||(j.tooNarrow&&i.scrollParallel)?b.state.contentWidth:d[k])-(e||0),m;if(f.stretch){m=n}else{m=j.maxSize+l[h.top]+l[h.bottom]+p.getBorderInfo()[g];if(!b.perpendicularSizeModel.shrinkWrap&&f.center){m=Math.max(n,m)}}p[h.setWidth](c);p[h.setHeight](m);if(b.state.additionalScrollbarWidth){if(m>j.targetSize[h.height]){b.setProp(a,b.state.contentWidth+b.state.additionalScrollbarWidth);if(Ext.isIE6||Ext.isIE7||Ext.isIEQuirks){b[h.setWidth](b.props[a]+b.getPaddingInfo()[h.width]+b.getBorderInfo()[h.width])}}else{b.setProp(a,b.state.contentWidth)}}if(isNaN(c+m)){i.done=false}if(j.calculatedWidth&&(o=="left"||o=="right")){b.setWidth(j.calculatedWidth,true,true)}},onRemove:function(a){var b=this;b.callParent(arguments);if(b.overflowHandler){b.overflowHandler.onRemove(a)}if(a.layoutMarginCap==b.id){delete a.layoutMarginCap}},initOverflowHandler:function(){var d=this,c=d.overflowHandler,b,a;if(typeof c=="string"){c={type:c}}b="None";if(c&&c.type!==undefined){b=c.type}a=Ext.layout.container.boxOverflow[b];if(a[d.type]){a=a[d.type]}d.overflowHandler=Ext.create("Ext.layout.container.boxOverflow."+b,d,c)},getRenderTarget:function(){return this.targetEl},getElementTarget:function(){return this.innerCt},calculateChildBox:Ext.deprecated(),calculateChildBoxes:Ext.deprecated(),updateChildBoxes:Ext.deprecated(),destroy:function(){Ext.destroy(this.innerCt,this.overflowHandler);this.callParent(arguments)}});