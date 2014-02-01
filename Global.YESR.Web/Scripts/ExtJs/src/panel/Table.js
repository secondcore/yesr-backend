Ext.define("Ext.panel.Table",{extend:"Ext.panel.Panel",alias:"widget.tablepanel",uses:["Ext.selection.RowModel","Ext.grid.PagingScroller","Ext.grid.header.Container","Ext.grid.Lockable"],extraBaseCls:Ext.baseCSSPrefix+"grid",extraBodyCls:Ext.baseCSSPrefix+"grid-body",layout:"fit",hasView:false,viewType:null,selType:"rowmodel",scroll:true,deferRowRender:true,sortableColumns:true,enableLocking:false,scrollerOwner:true,enableColumnMove:true,restrictColumnReorder:false,enableColumnResize:true,enableColumnHide:true,rowLines:true,initComponent:function(){if(!this.viewType){Ext.Error.raise("You must specify a viewType config.")}if(this.headers){Ext.Error.raise("The headers config is not supported. Please specify columns instead.")}var g=this,j=g.scroll,b=false,a=false,f=g.columns||g.colModel,h,c=g.border,d,e;if(g.columnLines){g.addCls(Ext.baseCSSPrefix+"grid-with-col-lines")}if(g.rowLines){g.addCls(Ext.baseCSSPrefix+"grid-with-row-lines")}g.store=Ext.data.StoreManager.lookup(g.store||"ext-empty-store");if(!f){Ext.Error.raise("A column configuration must be specified")}if(f instanceof Ext.grid.header.Container){g.headerCt=f;g.headerCt.border=c;g.columns=g.headerCt.items.items}else{if(Ext.isArray(f)){f={items:f,border:c}}Ext.apply(f,{forceFit:g.forceFit,sortable:g.sortableColumns,enableColumnMove:g.enableColumnMove,enableColumnResize:g.enableColumnResize,enableColumnHide:g.enableColumnHide,border:c,restrictReorder:g.restrictColumnReorder});g.columns=f.items;if(g.enableLocking||Ext.ComponentQuery.query("{locked !== undefined}{processed != true}",g.columns).length){g.self.mixin("lockable",Ext.grid.Lockable);g.injectLockable()}}g.scrollTask=new Ext.util.DelayedTask(g.syncHorizontalScroll,g);g.addEvents("reconfigure","viewready");g.bodyCls=g.bodyCls||"";g.bodyCls+=(" "+g.extraBodyCls);g.cls=g.cls||"";g.cls+=(" "+g.extraBaseCls);delete g.autoScroll;if(!g.hasView){if(!g.headerCt){g.headerCt=new Ext.grid.header.Container(f)}g.columns=g.headerCt.items.items;if(g.store.buffered&&!g.store.remoteSort){for(d=0,e=g.columns.length;d<e;d++){g.columns[d].sortable=false}}if(g.hideHeaders){g.headerCt.height=0;g.headerCt.addCls(Ext.baseCSSPrefix+"grid-header-ct-hidden");g.addCls(Ext.baseCSSPrefix+"grid-header-hidden");if(Ext.isIEQuirks){g.headerCt.style={display:"none"}}}if(j===true||j==="both"){b=a=true}else{if(j==="horizontal"){a=true}else{if(j==="vertical"){b=true}}}g.relayHeaderCtEvents(g.headerCt);g.features=g.features||[];if(!Ext.isArray(g.features)){g.features=[g.features]}g.dockedItems=[].concat(g.dockedItems||[]);g.dockedItems.unshift(g.headerCt);g.viewConfig=g.viewConfig||{};if(g.store&&g.store.buffered){g.viewConfig.preserveScrollOnRefresh=true}else{if(g.invalidateScrollerOnRefresh!==undefined){g.viewConfig.preserveScrollOnRefresh=!g.invalidateScrollerOnRefresh}}h=g.getView();g.items=[h];g.hasView=true;if(b){if(g.store.buffered){g.verticalScroller=new Ext.grid.PagingScroller(Ext.apply({panel:g,store:g.store,view:g.view},g.verticalScroller))}}if(a){if(!g.hideHeaders){h.on({scroll:{fn:g.onHorizontalScroll,element:"el",scope:g}})}}g.mon(h.store,{load:g.onStoreLoad,scope:g});g.mon(h,{viewready:g.onViewReady,refresh:g.onRestoreHorzScroll,scope:g})}this.relayEvents(g.view,["beforeitemmousedown","beforeitemmouseup","beforeitemmouseenter","beforeitemmouseleave","beforeitemclick","beforeitemdblclick","beforeitemcontextmenu","itemmousedown","itemmouseup","itemmouseenter","itemmouseleave","itemclick","itemdblclick","itemcontextmenu","beforecontainermousedown","beforecontainermouseup","beforecontainermouseover","beforecontainermouseout","beforecontainerclick","beforecontainerdblclick","beforecontainercontextmenu","containermouseup","containermouseover","containermouseout","containerclick","containerdblclick","containercontextmenu","selectionchange","beforeselect","select","beforedeselect","deselect"]);g.callParent(arguments);g.addStateEvents(["columnresize","columnmove","columnhide","columnshow","sortchange"]);if(g.headerCt){g.headerCt.on("afterlayout",g.onRestoreHorzScroll,g)}},relayHeaderCtEvents:function(a){this.relayEvents(a,["columnresize","columnmove","columnhide","columnshow","sortchange"])},getState:function(){var a=this,b=a.callParent(),c=a.store.sorters.first();b=a.addPropertyToState(b,"columns",(a.headerCt||a).getColumnsState());if(c){b=a.addPropertyToState(b,"sort",{property:c.property,direction:c.direction,root:c.root})}return b},applyState:function(d){var c=this,e=d.sort,a=c.store,b=d.columns;delete d.columns;c.callParent(arguments);if(b){(c.headerCt||c).applyColumnsState(b)}if(e){if(a.remoteSort){a.sort({property:e.property,direction:e.direction,root:e.root},null,false)}else{a.sort(e.property,e.direction)}}},getStore:function(){return this.store},getView:function(){var a=this,b;if(!a.view){b=a.getSelectionModel();a.view=Ext.widget(Ext.apply({},a.viewConfig,{grid:a,deferInitialRefresh:a.deferRowRender!==false,scroll:a.scroll,xtype:a.viewType,store:a.store,headerCt:a.headerCt,selModel:b,features:a.features,panel:a,emptyText:a.emptyText?'<div class="'+Ext.baseCSSPrefix+'grid-empty">'+a.emptyText+"</div>":""}));a.mon(a.view,{uievent:a.processEvent,scope:a});b.view=a.view;a.headerCt.view=a.view;a.relayEvents(a.view,["cellclick","celldblclick"])}return a.view},setAutoScroll:Ext.emptyFn,processEvent:function(f,b,a,c,d,h){var g=this,i;if(d!==-1){i=g.headerCt.getGridColumns()[d];return i.processEvent.apply(i,arguments)}},determineScrollbars:function(){Ext.log.warn("Obsolete")},invalidateScroller:function(){Ext.log.warn("Obsolete")},scrollByDeltaY:function(b,a){this.getView().scrollBy(0,b,a)},scrollByDeltaX:function(b,a){this.getView().scrollBy(b,0,a)},afterCollapse:function(){var a=this;a.saveScrollPos();a.saveScrollPos();a.callParent(arguments)},afterExpand:function(){var a=this;a.callParent(arguments);a.restoreScrollPos();a.restoreScrollPos()},saveScrollPos:Ext.emptyFn,restoreScrollPos:Ext.emptyFn,onHeaderResize:function(){this.delayScroll()},onHeaderMove:function(e,f,a,b,d){var c=this;if(c.optimizedColumnMove===false){c.view.refresh()}else{c.view.moveColumn(b,d,a)}c.delayScroll()},onHeaderHide:function(a,b){this.delayScroll()},onHeaderShow:function(a,b){this.delayScroll()},delayScroll:function(){var a=this.getScrollTarget().el;if(a){this.scrollTask.delay(10,null,null,[a.dom.scrollLeft])}},onViewReady:function(){this.fireEvent("viewready",this)},onRestoreHorzScroll:function(){var a=this.scrollLeftPos;if(a){this.syncHorizontalScroll(a)}},setScrollTop:function(c){var b=this,a=b.getScrollerOwner();a.virtualScrollTop=c},getScrollerOwner:function(){var a=this;if(!this.scrollerOwner){a=this.up("[scrollerOwner]")}return a},getLhsMarker:function(){var a=this;return a.lhsMarker||(a.lhsMarker=Ext.DomHelper.append(a.el,{cls:Ext.baseCSSPrefix+"grid-resize-marker"},true))},getRhsMarker:function(){var a=this;return a.rhsMarker||(a.rhsMarker=Ext.DomHelper.append(a.el,{cls:Ext.baseCSSPrefix+"grid-resize-marker"},true))},getSelectionModel:function(){if(!this.selModel){this.selModel={}}var b="SINGLE",a;if(this.simpleSelect){b="SIMPLE"}else{if(this.multiSelect){b="MULTI"}}Ext.applyIf(this.selModel,{allowDeselect:this.allowDeselect,mode:b});if(!this.selModel.events){a=this.selModel.selType||this.selType;this.selModel=Ext.create("selection."+a,this.selModel)}if(!this.selModel.hasRelaySetup){this.relayEvents(this.selModel,["selectionchange","beforeselect","beforedeselect","select","deselect"]);this.selModel.hasRelaySetup=true}if(this.disableSelection){this.selModel.locked=true}return this.selModel},getScrollTarget:function(){var a=this.getScrollerOwner(),b=a.query("tableview");return b[1]||b[0]},onHorizontalScroll:function(a,b){this.syncHorizontalScroll(b.scrollLeft)},syncHorizontalScroll:function(c){var b=this,a;if(b.rendered){a=b.getScrollTarget();a.el.dom.scrollLeft=c;b.headerCt.el.dom.scrollLeft=c;b.scrollLeftPos=c}},onStoreLoad:Ext.emptyFn,getEditorParent:function(){return this.body},bindStore:function(a){var b=this;b.store=a;b.getView().bindStore(a)},beforeDestroy:function(){Ext.destroy(this.verticalScroller);this.callParent()},reconfigure:function(a,b){var c=this,d=c.headerCt;if(c.lockable){c.reconfigureLockable(a,b)}else{if(b){delete c.scrollLeftPos;d.suspendLayouts();d.removeAll();d.add(b)}if(a){a=Ext.StoreManager.lookup(a);c.bindStore(a)}else{c.getView().refresh()}if(b){d.resumeLayouts(true)}d.setSortState()}c.fireEvent("reconfigure",c,a,b)}});