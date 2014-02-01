Ext.define("Ext.LoadMask",{extend:"Ext.Component",alias:"widget.loadmask",mixins:{floating:"Ext.util.Floating",bindable:"Ext.util.Bindable"},uses:["Ext.data.StoreManager"],msg:"Loading...",msgCls:Ext.baseCSSPrefix+"mask-loading",maskCls:Ext.baseCSSPrefix+"mask",useMsg:true,useTargetEl:false,baseCls:Ext.baseCSSPrefix+"mask-msg",childEls:["msgEl"],renderTpl:'<div id="{id}-msgEl" style="position:relative" class="{[values.$comp.msgCls]}"></div>',floating:{shadow:"frame"},focusOnToFront:false,bringParentToFront:false,constructor:function(a,b){var c=this;if(!a.isComponent){if(Ext.isDefined(Ext.global.console)){Ext.global.console.warn("Ext.LoadMask: LoadMask for elements has been deprecated, use Ext.dom.Element.mask & Ext.dom.Element.unmask")}a=Ext.get(a);this.isElement=true}c.ownerCt=a;if(!this.isElement){c.bindComponent(a)}c.callParent([b]);if(c.store){c.bindStore(c.store,true)}},bindComponent:function(a){var c=this,b={scope:this,resize:c.sizeMask,added:c.onComponentAdded,removed:c.onComponentRemoved},d=Ext.container.Container.hierarchyEventSource;if(a.floating){b.move=c.sizeMask;if(a.zIndexManager.front!==a){c.restack=true;c.activeOwner=a}}else{if(a.ownerCt){c.onComponentAdded(a.ownerCt)}else{c.preventBringToFront=true}}c.mon(a,b);c.mon(d,{show:c.onContainerShow,hide:c.onContainerHide,expand:c.onContainerExpand,collapse:c.onContainerCollapse,scope:c})},onComponentAdded:function(a){var b=this;delete b.activeOwner;b.floatParent=a;if(!a.floating){a=a.up("[floating]")}if(a){b.activeOwner=a;b.mon(a,"move",b.sizeMask,b)}a=b.floatParent.ownerCt;if(b.rendered&&b.isVisible()&&a){b.floatOwner=a;b.mon(a,"afterlayout",b.sizeMask,b,{single:true})}},onComponentRemoved:function(a){var c=this,d=c.activeOwner,b=c.floatOwner;if(d){c.mun(d,"move",c.sizeMask,c)}if(b){c.mun(b,"afterlayout",c.sizeMask,c)}delete c.activeOwner;delete c.floatOwner},afterRender:function(){this.callParent(arguments);this.container=this.floatParent.getContentTarget()},onContainerShow:function(a){if(this.isActiveContainer(a)){this.onComponentShow()}},onContainerHide:function(a){if(this.isActiveContainer(a)){this.onComponentHide()}},onContainerExpand:function(a){if(this.isActiveContainer(a)){this.onComponentShow()}},onContainerCollapse:function(a){if(this.isActiveContainer(a)){this.onComponentHide()}},isActiveContainer:function(a){return this.isDescendantOf(a)},onComponentHide:function(){var a=this;if(a.rendered&&a.isVisible()){a.hide();a.showNext=true}},onComponentShow:function(){if(this.showNext){this.show()}delete this.showNext},sizeMask:function(){var a=this,b;if(a.rendered&&a.isVisible()){a.center();b=a.getMaskTarget();a.getMaskEl().show().setSize(b.getSize()).alignTo(b,"tl-tl")}},bindStore:function(a,b){var c=this;c.mixins.bindable.bindStore.apply(c,arguments);a=c.store;if(a&&a.isLoading()){c.onBeforeLoad()}},getStoreListeners:function(){return{beforeload:this.onBeforeLoad,load:this.onLoad,exception:this.onLoad,cachemiss:this.onBeforeLoad,cachefilled:this.onLoad}},onDisable:function(){this.callParent(arguments);if(this.loading){this.onLoad()}},getOwner:function(){return this.ownerCt||this.floatParent},getMaskTarget:function(){var a=this.getOwner();return this.useTargetEl?a.getTargetEl():a.getEl()},onBeforeLoad:function(){var c=this,a=c.getOwner(),b;if(!c.disabled){c.loading=true;if(a.componentLayoutCounter){c.maybeShow()}else{b=a.afterComponentLayout;a.afterComponentLayout=function(){a.afterComponentLayout=b;b.apply(a,arguments);c.maybeShow()}}}},maybeShow:function(){var b=this,a=b.getOwner();if(!a.isVisible(true)){b.showNext=true}else{if(b.loading&&a.rendered){b.show()}}},getMaskEl:function(){var a=this;return a.maskEl||(a.maskEl=a.el.insertSibling({cls:a.maskCls,style:{zIndex:a.el.getStyle("zIndex")-2}},"before"))},onShow:function(){var b=this,a=b.msgEl;b.callParent(arguments);b.loading=true;if(b.useMsg){a.show().update(b.msg)}else{a.parent().hide()}},hide:function(){if(this.isElement){this.ownerCt.unmask();this.fireEvent("hide",this);return}delete this.showNext;return this.callParent(arguments)},onHide:function(){this.callParent();this.getMaskEl().hide()},show:function(){if(this.isElement){this.ownerCt.mask(this.useMsg?this.msg:"",this.msgCls);this.fireEvent("show",this);return}return this.callParent(arguments)},afterShow:function(){this.callParent(arguments);this.sizeMask()},setZIndex:function(a){var b=this;if(b.restack){a=parseInt(b.activeOwner.el.getStyle("zIndex"),10)+1}b.getMaskEl().setStyle("zIndex",a-1);return b.mixins.floating.setZIndex.apply(b,arguments)},onLoad:function(){this.loading=false;this.hide()},onDestroy:function(){var a=this;if(a.isElement){a.ownerCt.unmask()}Ext.destroy(a.maskEl);a.callParent()}});