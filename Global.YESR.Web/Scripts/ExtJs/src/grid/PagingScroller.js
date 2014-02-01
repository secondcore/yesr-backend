Ext.define("Ext.grid.PagingScroller",{percentageFromEdge:0.35,numFromEdge:2,trailingBufferZone:5,leadingBufferZone:15,scrollToLoadBuffer:200,viewSize:0,rowHeight:21,tableStart:0,tableEnd:0,constructor:function(a){var b=this;b.variableRowHeight=a.variableRowHeight;b.bindView(a.view);Ext.apply(b,a);b.callParent(arguments)},bindView:function(b){var e=this,d={scroll:{fn:e.onViewScroll,element:"el",scope:e},render:e.onViewRender,resize:e.onViewResize,boxready:{fn:e.onViewResize,scope:e,single:true},refresh:e.onViewRefresh,scope:e},a={guaranteedrange:e.onGuaranteedRange,scope:e},c={reconfigure:e.onGridReconfigure,scope:e};if(e.variableRowHeight){d.beforerefresh=e.beforeViewRefresh}if(e.view){e.view.el.un("scroll",e.onViewScroll,e);e.view.un(d);e.store.un(a);if(e.grid){e.grid.un(c)}delete e.view.refreshSize}e.view=b;e.grid=e.view.up("tablepanel");e.store=b.store;if(b.rendered){e.viewSize=e.store.viewSize=Math.ceil(b.getHeight()/e.rowHeight)+e.trailingBufferZone+(e.numFromEdge*2)+e.leadingBufferZone}e.view.refreshSize=Ext.Function.createInterceptor(e.view.refreshSize,e.beforeViewrefreshSize,e);e.position=0;if(e.grid){e.grid.on(c)}else{e.view.on({added:function(){e.grid=e.view.up("tablepanel");e.grid.on(c)},single:true})}e.view.on(e.viewListeners=d);e.store.on(a)},onGridReconfigure:function(a){this.bindView(a.view)},onViewRender:function(){var b=this,a=b.view.el;a.setStyle("position","relative");b.stretcher=a.createChild({style:{position:"absolute",width:"1px",height:0,top:0,left:0}},a.dom.firstChild)},onViewResize:function(b,d,a){var e=this,c;c=Math.ceil(a/e.rowHeight)+e.trailingBufferZone+(e.numFromEdge*2)+e.leadingBufferZone;if(c>e.viewSize){e.viewSize=e.store.viewSize=c;e.handleViewScroll(e.lastScrollDirection||1)}},beforeViewRefresh:function(){var b=this,a=b.view,c,d=b.lastScrollDirection;b.commonRecordIndex=undefined;if(d&&(b.previousStart!==undefined)&&(b.scrollProportion===undefined)){c=a.getNodes();if(d===1){if(b.tableStart<=b.previousEnd){b.commonRecordIndex=c.length-1}}else{if(d===-1){if(b.tableEnd>=b.previousStart){b.commonRecordIndex=0}}}b.scrollOffset=-a.el.getOffsetsTo(c[b.commonRecordIndex])[1];b.commonRecordIndex-=(b.tableStart-b.previousStart)}else{b.scrollOffset=undefined}},onViewRefresh:function(){var d=this,f=d.store,c,e=d.view,i=e.el,j=i.dom,l,h,b,k=i.child("table",true),g,a;d.disabled=true;if(f.getCount()===f.getTotalCount()||(f.isFiltered()&&!f.remoteFilter)){d.stretcher.setHeight(0);d.position=j.scrollTop=0;k.style.position="absolute";return}d.stretcher.setHeight(c=d.getScrollHeight());a=j.scrollTop;d.isScrollRefresh=(a>0);if(d.scrollProportion!==undefined){d.scrollProportion=a/(c-k.offsetHeight);k.style.position="absolute";k.style.top=(d.scrollProportion?(c*d.scrollProportion)-(k.offsetHeight*d.scrollProportion):0)+"px"}else{k.style.position="absolute";k.style.top=(g=(d.tableStart||0)*d.rowHeight)+"px";if(d.scrollOffset){l=e.getNodes();h=-i.getOffsetsTo(l[d.commonRecordIndex])[1];b=h-d.scrollOffset;d.position=(a+=b)}else{if((g>a)||((g+k.offsetHeight)<a+j.clientHeight)){d.lastScrollDirection=-1;d.position=j.scrollTop=g}}}d.disabled=false},beforeViewrefreshSize:function(){if(this.isScrollRefresh){return(this.isScrollRefresh=false)}},onGuaranteedRange:function(b,e,a){var c=this,d=c.store;if(b.length&&c.visibleStart<b[0].index){return}c.previousStart=c.tableStart;c.previousEnd=c.tableEnd;c.tableStart=e;c.tableEnd=a;d.loadRecords(b)},onViewScroll:function(f,c){var d=this,a=d.view,b=d.position;d.position=a.el.dom.scrollTop;if(!d.disabled){d.lastScrollDirection=d.position>b?1:-1;if(b!==d.position){d.handleViewScroll(d.lastScrollDirection)}}},handleViewScroll:function(g){var d=this,i=d.store,f=d.view,e=d.viewSize,j=i.getTotalCount(),c=j-e,b=d.getFirstVisibleRowIndex(),h=d.getLastVisibleRowIndex(),a,k;if(j>=e){d.scrollProportion=undefined;if(g==-1){if(b!==undefined){if(b<(d.tableStart+d.numFromEdge)){a=Math.max(0,h+d.trailingBufferZone-e)}}else{d.scrollProportion=f.el.dom.scrollTop/(f.el.dom.scrollHeight-f.el.dom.clientHeight);a=Math.max(0,j*d.scrollProportion-(e/2)-d.numFromEdge-((d.leadingBufferZone+d.trailingBufferZone)/2))}}else{if(b!==undefined){if(h>(d.tableEnd-d.numFromEdge)){a=Math.max(0,b-d.trailingBufferZone)}}else{d.scrollProportion=f.el.dom.scrollTop/(f.el.dom.scrollHeight-f.el.dom.clientHeight);a=j*d.scrollProportion-(e/2)-d.numFromEdge-((d.leadingBufferZone+d.trailingBufferZone)/2)}}if(a!==undefined){if(a>c){a=c&~1;k=j-1}else{a=a&~1;k=a+e-1}if(i.rangeCached(a,k)){d.cancelLoad();i.guaranteeRange(a,k)}else{d.attemptLoad(a,k)}}}},getFirstVisibleRowIndex:function(){var e=this,b=e.store,a=e.view,h=a.el.dom.scrollTop,f,d,c,g;if(e.variableRowHeight){f=a.getNodes();d=b.getCount();for(c=0;c<d;c++){g=Ext.fly(f[c]).getOffsetsTo(a.el)[1]+f[c].offsetHeight;if(g>a.el.dom.clientHeight){return}if(g>0){return c+e.tableStart}}}else{return Math.floor(h/e.rowHeight)}},getLastVisibleRowIndex:function(){var g=this,c=g.store,a=g.view,b=a.el.dom.clientHeight,h,f,e,d;if(g.variableRowHeight){h=a.getNodes();f=c.getCount();for(e=f-1;e>=0;e--){d=Ext.fly(h[e]).getOffsetsTo(a.el)[1];if(d<0){return}if(d<b){return e+g.tableStart}}}else{return g.getFirstVisibleRowIndex()+Math.ceil(b/g.rowHeight)+1}},getScrollHeight:function(){var e=this,a=e.view,d,g,b=e.store,f=0,c=!e.hasOwnProperty("rowHeight");if(e.variableRowHeight){d=e.view.el.down("table",true);if(c){e.initialTableHeight=d.offsetHeight;e.rowHeight=e.initialTableHeight/e.store.getCount()}else{f=d.offsetHeight-e.initialTableHeight}}else{if(c){g=a.el.down(a.getItemSelector());if(g){e.rowHeight=g.getHeight(false,true)}}}return Math.floor(b.getTotalCount()*e.rowHeight)+f},attemptLoad:function(c,a){var b=this;if(b.scrollToLoadBuffer){if(!b.loadTask){b.loadTask=new Ext.util.DelayedTask(b.doAttemptLoad,b,[])}b.loadTask.delay(b.scrollToLoadBuffer,b.doAttemptLoad,b,[c,a])}else{b.store.guaranteeRange(c,a)}},cancelLoad:function(){if(this.loadTask){this.loadTask.cancel()}},doAttemptLoad:function(b,a){this.store.guaranteeRange(b,a)},destroy:function(){var b=this,a=b.viewListeners.scroll;b.store.un({guaranteedrange:b.onGuaranteedRange,scope:b});b.view.un(b.viewListeners);if(b.view.rendered){b.stretcher.remove();b.view.el.un("scroll",a.fn,a.scope)}}});