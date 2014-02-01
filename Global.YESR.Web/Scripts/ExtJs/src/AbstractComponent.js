Ext.define("Ext.AbstractComponent",{requires:["Ext.ComponentQuery","Ext.ComponentManager","Ext.util.ProtoElement"],mixins:{observable:"Ext.util.Observable",animate:"Ext.util.Animate",elementCt:"Ext.util.ElementContainer",renderable:"Ext.util.Renderable",state:"Ext.state.Stateful"},uses:["Ext.PluginManager","Ext.Element","Ext.DomHelper","Ext.XTemplate","Ext.ComponentQuery","Ext.ComponentLoader","Ext.EventManager","Ext.layout.Context","Ext.layout.Layout","Ext.layout.component.Auto","Ext.LoadMask","Ext.ZIndexManager"],statics:{AUTO_ID:1000,pendingLayouts:null,layoutSuspendCount:0,cancelLayout:function(a){var b=this.runningLayoutContext||this.pendingLayouts;if(b){b.cancelComponent(a)}},flushLayouts:function(){var b=this,a=b.pendingLayouts;if(a&&a.invalidQueue.length){b.pendingLayouts=null;b.runningLayoutContext=a;Ext.override(a,{runComplete:function(){b.runningLayoutContext=null;return this.callParent()}});a.run()}},resumeLayouts:function(a){if(this.layoutSuspendCount&&!--this.layoutSuspendCount){if(a){this.flushLayouts()}}},suspendLayouts:function(){++this.layoutSuspendCount},updateLayout:function(b,e){var c=this,a=c.runningLayoutContext,d;if(a){a.queueInvalidate(b)}else{d=c.pendingLayouts||(c.pendingLayouts=new Ext.layout.Context());d.queueInvalidate(b);if(!e&&!c.layoutSuspendCount&&!b.isLayoutSuspended()){c.flushLayouts()}}}},isComponent:true,getAutoId:function(){this.autoGenId=true;return ++Ext.AbstractComponent.AUTO_ID},deferLayouts:false,autoGenId:false,renderTpl:"{%this.renderContent(out,values)%}",frameSize:{left:0,top:0,right:0,bottom:0,width:0,height:0},tplWriteMode:"overwrite",baseCls:Ext.baseCSSPrefix+"component",disabledCls:Ext.baseCSSPrefix+"item-disabled",ui:"default",uiCls:[],hidden:false,disabled:false,draggable:false,floating:false,hideMode:"display",styleHtmlContent:false,styleHtmlCls:Ext.baseCSSPrefix+"html",autoShow:false,autoRender:false,allowDomMove:true,rendered:false,componentLayoutCounter:0,shrinkWrap:2,weight:0,maskOnDisable:true,_isLayoutRoot:false,constructor:function(c){var e=this,d,a,b;if(c){Ext.apply(e,c);b=e.xhooks;if(b){delete e.xhooks;Ext.override(e,b)}}else{c={}}e.initialConfig=c;e.mixins.elementCt.constructor.call(e);e.addEvents("beforeactivate","activate","beforedeactivate","deactivate","added","disable","enable","beforeshow","show","beforehide","hide","removed","beforerender","render","afterrender","boxready","beforedestroy","destroy","resize","move","focus","blur");e.getId();e.setupProtoEl();if(e.cls){e.initialCls=e.cls;e.protoEl.addCls(e.cls)}if(e.style){e.initialStyle=e.style;e.protoEl.setStyle(e.style)}e.mons=[];e.renderData=e.renderData||{};e.renderSelectors=e.renderSelectors||{};if(e.plugins){e.plugins=[].concat(e.plugins);e.constructPlugins()}if(!e.hasListeners){e.hasListeners=new e.HasListeners()}e.initComponent();Ext.ComponentManager.register(e);e.mixins.observable.constructor.call(e);e.mixins.state.constructor.call(e,c);this.addStateEvents("resize");if(e.plugins){e.plugins=[].concat(e.plugins);for(d=0,a=e.plugins.length;d<a;d++){e.plugins[d]=e.initPlugin(e.plugins[d])}}e.loader=e.getLoader();if(e.renderTo){e.render(e.renderTo)}if(e.autoShow){e.show()}if(Ext.isDefined(e.disabledClass)){if(Ext.isDefined(Ext.global.console)){Ext.global.console.warn("Ext.Component: disabledClass has been deprecated. Please use disabledCls.")}e.disabledCls=e.disabledClass;delete e.disabledClass}},initComponent:function(){this.constructPlugins();this.setSize(this.width,this.height)},getState:function(){var b=this,c=null,a=b.getSizeModel();if(a.width.configured){c=b.addPropertyToState(c,"width")}if(a.height.configured){c=b.addPropertyToState(c,"height")}return c},addPropertyToState:function(e,d,c){var b=this,a=arguments.length;if(a==3||b.hasOwnProperty(d)){if(a<3){c=b[d]}if(c!==b.initialConfig[d]){(e||(e={}))[d]=c}}return e},show:Ext.emptyFn,animate:function(b){var j=this,e,f,d,o,n,l,k,i,m,g,c,a;b=b||{};n=b.to||{};if(Ext.fx.Manager.hasFxBlock(j.id)){return j}e=Ext.isDefined(n.width);if(e){o=Ext.Number.constrain(n.width,j.minWidth,j.maxWidth)}f=Ext.isDefined(n.height);if(f){d=Ext.Number.constrain(n.height,j.minHeight,j.maxHeight)}if(!b.dynamic&&(e||f)){i=(b.from?b.from.width:undefined)||j.getWidth();m=i;g=(b.from?b.from.height:undefined)||j.getHeight();c=g;a=false;if(f&&d>g){c=d;a=true}if(e&&o>i){m=o;a=true}if(a){l=!Ext.isNumber(j.width);k=!Ext.isNumber(j.height);j.setSize(m,c);j.el.setSize(i,g);if(l){delete j.width}if(k){delete j.height}}if(e){n.width=o}if(f){n.height=d}}return j.mixins.animate.animate.apply(j,arguments)},onHide:function(){this.updateLayout({isRoot:false})},onShow:function(){this.updateLayout({isRoot:false})},constructPlugin:function(a){if(a.ptype&&typeof a.init!="function"){a.cmp=this;a=Ext.PluginManager.create(a)}else{if(typeof a=="string"){a=Ext.PluginManager.create({ptype:a,cmp:this})}}return a},constructPlugins:function(){var d=this,b=d.plugins,c,a;if(b){for(c=0,a=b.length;c<a;c++){b[c]=d.constructPlugin(b[c])}}},initPlugin:function(a){a.init(this);return a},updateAria:Ext.emptyFn,registerFloatingItem:function(b){var a=this;if(!a.floatingItems){a.floatingItems=new Ext.ZIndexManager(a)}a.floatingItems.register(b)},unregisterFloatingItem:function(b){var a=this;if(a.floatingItems){a.floatingItems.unregister(b)}},layoutSuspendCount:0,suspendLayouts:function(){var a=this;if(!a.rendered){return}if(++a.layoutSuspendCount==1){a.suspendLayout=true}},resumeLayouts:function(b){var a=this;if(!a.rendered){return}if(!--a.layoutSuspendCount){a.suspendLayout=false;if(b&&!a.isLayoutSuspended()){a.updateLayout(b)}}},setupProtoEl:function(){var b=this,a=[b.baseCls,b.getComponentLayout().targetCls];if(Ext.isDefined(b.cmpCls)){if(Ext.isDefined(Ext.global.console)){Ext.global.console.warn("Ext.Component: cmpCls has been deprecated. Please use componentCls.")}b.componentCls=b.cmpCls;delete b.cmpCls}if(b.componentCls){a.push(b.componentCls)}else{b.componentCls=b.baseCls}b.protoEl=new Ext.util.ProtoElement({cls:a.join(" ")})},setUI:function(f){var e=this,b=Ext.Array.clone(e.uiCls),g=[],d=[],a,c;for(c=0;c<b.length;c++){a=b[c];d=d.concat(e.removeClsWithUI(a,true));g.push(a)}if(d.length){e.removeCls(d)}e.removeUIFromElement();e.ui=f;e.addUIToElement();d=[];for(c=0;c<g.length;c++){a=g[c];d=d.concat(e.addClsWithUI(a,true))}if(d.length){e.addCls(d)}if(e.rendered){e.updateLayout()}},addClsWithUI:function(c,g){var f=this,e=[],d,b=0,a;if(typeof c==="string"){c=(c.indexOf(" ")<0)?[c]:Ext.String.splitWords(c)}d=c.length;f.uiCls=Ext.Array.clone(f.uiCls);for(;b<d;b++){a=c[b];if(a&&!f.hasUICls(a)){f.uiCls.push(a);e=e.concat(f.addUIClsToElement(a))}}if(g!==true){f.addCls(e)}return e},removeClsWithUI:function(c,g){var f=this,e=[],b=0,d,a;if(typeof c==="string"){c=(c.indexOf(" ")<0)?[c]:Ext.String.splitWords(c)}d=c.length;for(b=0;b<d;b++){a=c[b];if(a&&f.hasUICls(a)){f.uiCls=Ext.Array.remove(f.uiCls,a);e=e.concat(f.removeUIClsFromElement(a))}}if(g!==true){f.removeCls(e)}return e},hasUICls:function(a){var b=this,c=b.uiCls||[];return Ext.Array.contains(c,a)},frameElementsArray:["tl","tc","tr","ml","mc","mr","bl","bc","br"],addUIClsToElement:function(l){var j=this,b=j.baseCls+"-"+j.ui+"-"+l,m=[Ext.baseCSSPrefix+l,j.baseCls+"-"+l,b],k=j.frameElementCls,g,f,e,a,d,h;if(j.frame&&!Ext.supports.CSS3BorderRadius){g=j.frameElementsArray;f=g.length;e=0;for(;e<f;e++){d=g[e];a=j["frame"+d.toUpperCase()];h=b+"-"+d;if(a&&a.dom){a.addCls(h)}else{if(Ext.Array.indexOf(k[d],h)==-1){k[d].push(h)}}}}j.frameElementCls=k;return m},removeUIClsFromElement:function(l){var j=this,b=j.baseCls+"-"+j.ui+"-"+l,m=[Ext.baseCSSPrefix+l,j.baseCls+"-"+l,b],k=j.frameElementCls,g,f,e,a,d,h;if(j.frame&&!Ext.supports.CSS3BorderRadius){g=j.frameElementsArray;f=g.length;e=0;for(;e<f;e++){d=g[e];a=j["frame"+d.toUpperCase()];h=b+"-"+d;if(a&&a.dom){a.addCls(h)}else{Ext.Array.remove(k[d],h)}}}j.frameElementCls=k;return m},addUIToElement:function(){var h=this,j=h.baseCls+"-"+h.ui,k=h.frameElementCls,f,e,d,a,b,g;h.addCls(j);if(h.frame&&!Ext.supports.CSS3BorderRadius){f=h.frameElementsArray;e=f.length;d=0;for(;d<e;d++){b=f[d];a=h["frame"+b.toUpperCase()];g=j+"-"+b;if(a){a.addCls(g)}else{if(!Ext.Array.contains(k[b],g)){k[b].push(g)}}}}},removeUIFromElement:function(){var h=this,j=h.baseCls+"-"+h.ui,k=h.frameElementCls,f,e,d,a,b,g;h.removeCls(j);if(h.frame&&!Ext.supports.CSS3BorderRadius){f=h.frameElementsArray;e=f.length;d=0;for(;d<e;d++){b=f[d];a=h["frame"+b.toUpperCase()];g=j+"-"+b;if(a){a.removeCls(g)}else{Ext.Array.remove(k[b],g)}}}},getTpl:function(a){return Ext.XTemplate.getTpl(this,a)},initStyles:function(i){var d=this,b=Ext.Element,f=d.padding,c=d.margin,g=d.x,e=d.y,a,h;if(f!==undefined){i.setStyle("padding",b.unitizeBox((f===true)?5:f))}if(c!==undefined){i.setStyle("margin",b.unitizeBox((c===true)?5:c))}if(d.border!==undefined){d.setBorder(d.border,i)}if(d.cls&&d.cls!=d.initialCls){i.addCls(d.cls);delete d.cls;delete d.initialCls}if(d.style&&d.style!=d.initialStyle){i.setStyle(d.style);delete d.style;delete d.initialStyle}if(g!==undefined){i.setStyle("left",g+"px")}if(e!==undefined){i.setStyle("top",e+"px")}if(!d.getFrameInfo()&&Ext.isBorderBox){a=d.width;h=d.height;if(a!==undefined){i.setStyle("width",(typeof a==="number")?a+"px":a)}if(h!==undefined){i.setStyle("height",(typeof h==="number")?h+"px":h)}}},initEvents:function(){var c=this,e=c.afterRenderEvents,b,d,a=function(f){c.mon(b,f)};if(e){for(d in e){if(e.hasOwnProperty(d)){b=c[d];if(b&&b.on){Ext.each(e[d],a)}}}}c.addFocusListener()},addFocusListener:function(){var c=this,b=c.getFocusEl(),a;if(b){if(b.isComponent){return b.addFocusListener()}a=b.needsTabIndex();if(!c.focusListenerAdded&&(!a||Ext.FocusManager.enabled)){if(a){b.dom.tabIndex=-1}b.on({focus:c.onFocus,blur:c.onBlur,scope:c});c.focusListenerAdded=true}}},getFocusEl:Ext.emptyFn,isFocusable:function(d){var b=this,a;if((b.focusable!==false)&&(a=b.getFocusEl())&&b.rendered&&!b.destroying&&!b.isDestroyed&&!b.disabled&&b.isVisible(true)){if(a.isComponent){return a.isFocusable()}return a&&a.dom&&a.isVisible()}},preFocus:Ext.emptyFn,onFocus:function(d){var c=this,b=c.focusCls,a=c.getFocusEl();if(!c.disabled){c.preFocus(d);if(b&&a){a.addCls(c.addClsWithUI(b,true));try{if(a.dom.select){a.dom.select()}}catch(d){}}if(!c.hasFocus){c.hasFocus=true;c.fireEvent("focus",c,d)}}},beforeBlur:Ext.emptyFn,onBlur:function(d){var c=this,b=c.focusCls,a=c.getFocusEl();if(c.destroying){return}c.beforeBlur(d);if(b&&a){a.removeCls(c.removeClsWithUI(b,true))}if(c.validateOnBlur){c.validate()}c.hasFocus=false;c.fireEvent("blur",c,d);c.postBlur(d)},postBlur:Ext.emptyFn,is:function(a){return Ext.ComponentQuery.is(this,a)},up:function(b){var a=this.getBubbleTarget();if(b){for(;a;a=a.getBubbleTarget()){if(Ext.ComponentQuery.is(a,b)){return a}}}return a},nextSibling:function(b){var f=this.ownerCt,d,e,a,g;if(f){d=f.items;a=d.indexOf(this)+1;if(a){if(b){for(e=d.getCount();a<e;a++){if((g=d.getAt(a)).is(b)){return g}}}else{if(a<d.getCount()){return d.getAt(a)}}}}return null},previousSibling:function(b){var e=this.ownerCt,d,a,f;if(e){d=e.items;a=d.indexOf(this);if(a!=-1){if(b){for(--a;a>=0;a--){if((f=d.getAt(a)).is(b)){return f}}}else{if(a){return d.getAt(--a)}}}}return null},previousNode:function(b,d){var g=this,a,f,e,c;if(d&&g.is(b)){return g}if(g.ownerCt){for(f=g.ownerCt.items.items,e=Ext.Array.indexOf(f,g)-1;e>-1;e--){c=f[e];if(c.query){a=c.query(b);a=a[a.length-1];if(a){return a}if(c.is(b)){return c}}}return g.ownerCt.previousNode(b,true)}},nextNode:function(c,e){var h=this,b,g,a,f,d;if(e&&h.is(c)){return h}if(h.ownerCt){for(g=h.ownerCt.items,f=g.indexOf(h)+1,g=g.items,a=g.length;f<a;f++){d=g[f];if(d.is(c)){return d}if(d.down){b=d.down(c);if(b){return b}}}return h.ownerCt.nextNode(c)}},getId:function(){return this.id||(this.id="ext-comp-"+(this.getAutoId()))},getItemId:function(){return this.itemId||this.id},getEl:function(){return this.el},getTargetEl:function(){return this.frameBody||this.el},getOverflowStyle:function(){var b=this,a=null;if(typeof b.autoScroll=="boolean"){a={overflow:b.autoScroll?"auto":""}}else{if(b.overflowX!==undefined||b.overflowY!==undefined){a={"overflow-x":(b.overflowX||""),"overflow-y":(b.overflowY||"")}}}if(a&&(Ext.isIE6||Ext.isIE7)){a.position="relative"}return a},isXType:function(b,a){if(a){return this.xtype===b}else{return this.xtypesMap[b]}},getXTypes:function(){var c=this.self,d,b,a;if(!c.xtypes){d=[];b=this;while(b){a=b.xtypes;if(a!==undefined){d.unshift.apply(d,a)}b=b.superclass}c.xtypeChain=d;c.xtypes=d.join("/")}return c.xtypes},update:function(b,c,a){var d=this;if(d.tpl&&!Ext.isString(b)){d.data=b;if(d.rendered){d.tpl[d.tplWriteMode](d.getTargetEl(),b||{})}}else{d.html=Ext.isObject(b)?Ext.DomHelper.markup(b):b;if(d.rendered){d.getTargetEl().update(d.html,c,a)}}if(d.rendered){d.updateLayout()}},setVisible:function(a){return this[a?"show":"hide"]()},isVisible:function(a){var c=this,e=c,d=c.rendered&&!c.hidden,b=c.ownerCt;c.hiddenAncestor=false;if(c.destroyed){return false}if(a&&d&&b){while(b){if(b.hidden||(b.collapsed&&!(b.getDockedItems&&Ext.Array.contains(b.getDockedItems(),e)))){c.hiddenAncestor=b;d=false;break}e=b;b=b.ownerCt}}return d},onBoxReady:function(){var a=this;if(a.disableOnBoxReady){a.onDisable()}else{if(a.enableOnBoxReady){a.onEnable()}}if(a.resizable){a.initResizable(a.resizable)}if(a.draggable){a.initDraggable()}},enable:function(a){var b=this;delete b.disableOnBoxReady;b.removeCls(b.disabledCls);if(b.rendered){b.onEnable()}else{b.enableOnBoxReady=true}b.disabled=false;delete b.resetDisable;if(a!==true){b.fireEvent("enable",b)}return b},disable:function(a){var b=this;delete b.enableOnBoxReady;b.addCls(b.disabledCls);if(b.rendered){b.onDisable()}else{b.disableOnBoxReady=true}b.disabled=true;if(a!==true){delete b.resetDisable;b.fireEvent("disable",b)}return b},onEnable:function(){if(this.maskOnDisable){this.el.dom.disabled=false;this.unmask()}},onDisable:function(){if(this.maskOnDisable){this.el.dom.disabled=true;this.mask()}},mask:function(){var b=this.lastBox,c=this.getMaskTarget(),a=[];if(b){a[2]=b.height}c.mask.apply(c,a)},unmask:function(){this.getMaskTarget().unmask()},getMaskTarget:function(){return this.el},isDisabled:function(){return this.disabled},setDisabled:function(a){return this[a?"disable":"enable"]()},isHidden:function(){return this.hidden},addCls:function(a){var c=this,b=c.rendered?c.el:c.protoEl;b.addCls.apply(b,arguments);return c},addClass:function(){return this.addCls.apply(this,arguments)},hasCls:function(a){var c=this,b=c.rendered?c.el:c.protoEl;return b.hasCls.apply(b,arguments)},removeCls:function(a){var c=this,b=c.rendered?c.el:c.protoEl;b.removeCls.apply(b,arguments);return c},removeClass:function(){if(Ext.isDefined(Ext.global.console)){Ext.global.console.warn("Ext.Component: removeClass has been deprecated. Please use removeCls.")}return this.removeCls.apply(this,arguments)},addOverCls:function(){var a=this;if(!a.disabled){a.el.addCls(a.overCls)}},removeOverCls:function(){this.el.removeCls(this.overCls)},addListener:function(b,f,e,a){var g=this,d,c;if(Ext.isString(b)&&(Ext.isObject(f)||a&&a.element)){if(a.element){d=f;f={};f[b]=d;b=a.element;if(e){f.scope=e}for(c in a){if(a.hasOwnProperty(c)){if(g.eventOptionsRe.test(c)){f[c]=a[c]}}}}if(g[b]&&g[b].on){g.mon(g[b],f)}else{g.afterRenderEvents=g.afterRenderEvents||{};if(!g.afterRenderEvents[b]){g.afterRenderEvents[b]=[]}g.afterRenderEvents[b].push(f)}}return g.mixins.observable.addListener.apply(g,arguments)},removeManagedListenerItem:function(b,a,h,d,f,e){var g=this,c=a.options?a.options.element:null;if(c){c=g[c];if(c&&c.un){if(b||(a.item===h&&a.ename===d&&(!f||a.fn===f)&&(!e||a.scope===e))){c.un(a.ename,a.fn,a.scope);if(!b){Ext.Array.remove(g.managedListeners,a)}}}}else{return g.mixins.observable.removeManagedListenerItem.apply(g,arguments)}},getBubbleTarget:function(){return this.ownerCt},isFloating:function(){return this.floating},isDraggable:function(){return !!this.draggable},isDroppable:function(){return !!this.droppable},onAdded:function(a,c){var b=this;b.ownerCt=a;if(b.hasListeners.added){b.fireEvent("added",b,a,c)}},onRemoved:function(b){var a=this;if(a.hasListeners.removed){a.fireEvent("removed",a,a.ownerCt)}delete a.ownerCt;delete a.ownerLayout},beforeDestroy:Ext.emptyFn,onResize:Ext.emptyFn,setSize:function(b,a){var c=this;if(b&&typeof b=="object"){a=b.height;b=b.width}if(typeof b=="number"){c.width=Ext.Number.constrain(b,c.minWidth,c.maxWidth)}else{if(b===null){delete c.width}}if(typeof a=="number"){c.height=Ext.Number.constrain(a,c.minHeight,c.maxHeight)}else{if(a===null){delete c.height}}if(c.rendered&&c.isVisible()){c.updateLayout({isRoot:false})}return c},isLayoutRoot:function(){var a=this,b=a.ownerLayout;if(!b||a._isLayoutRoot||a.floating){return true}return b.isItemLayoutRoot(a)},isLayoutSuspended:function(){var a=this,b;while(a){if(a.layoutSuspendCount||a.suspendLayout){return true}b=a.ownerLayout;if(!b){break}a=b.owner}return false},updateLayout:function(b){var c=this,d,a=b&&b.isRoot;if(!c.rendered||c.layoutSuspendCount||c.suspendLayout){return}if(c.hidden){Ext.AbstractComponent.cancelLayout(c)}else{if(typeof a!="boolean"){a=c.isLayoutRoot()}}if(a||!c.ownerLayout||!c.ownerLayout.onContentChange(c)){if(!c.isLayoutSuspended()){d=(b&&b.hasOwnProperty("defer"))?b.defer:c.deferLayouts;Ext.AbstractComponent.updateLayout(c,d)}}},getSizeModel:function(e){var h=this,a=Ext.layout.SizeModel,j=h.componentLayout.ownerContext,b,k,c,i,f,g,d;if(j){d=j.widthModel;c=j.heightModel}if(!d||!c){b=(typeof h.width=="number");k=(typeof h.height=="number");if(h.floating||!(i=h.ownerLayout)){if(b){d=a.configured}if(k){c=a.configured}f=Ext.layout.Layout.prototype.autoSizePolicy;g=h.floating?3:h.shrinkWrap}else{f=i.getItemSizePolicy(h,e);g=i.isItemShrinkWrap(h)}g=(g===true)?3:(g||0);if(g!==3){if(!e){e=h.ownerCt&&h.ownerCt.getSizeModel()}if(e){g|=(e.width.shrinkWrap?1:0)|(e.height.shrinkWrap?2:0)}}if(!d){if(!f.setsWidth){if(b){d=a.configured}else{d=(g&1)?a.shrinkWrap:a.natural}}else{if(f.readsWidth){if(b){d=a.calculatedFromConfigured}else{d=(g&1)?a.calculatedFromShrinkWrap:a.calculatedFromNatural}}else{d=a.calculated}}}if(!c){if(!f.setsHeight){if(k){c=a.configured}else{c=(g&2)?a.shrinkWrap:a.natural}}else{if(f.readsHeight){if(k){c=a.calculatedFromConfigured}else{c=(g&2)?a.calculatedFromShrinkWrap:a.calculatedFromNatural}}else{c=a.calculated}}}}return{width:d,height:c}},isDescendant:function(a){if(a.isContainer){for(var b=this.ownerCt;b;b=b.ownerCt){if(b===a){return true}}}return false},doComponentLayout:function(){this.updateLayout();return this},forceComponentLayout:function(){this.updateLayout()},setComponentLayout:function(b){var a=this.componentLayout;if(a&&a.isLayout&&a!=b){a.setOwner(null)}this.componentLayout=b;b.setOwner(this)},getComponentLayout:function(){var a=this;if(!a.componentLayout||!a.componentLayout.isLayout){a.setComponentLayout(Ext.layout.Layout.create(a.componentLayout,"autocomponent"))}return a.componentLayout},afterComponentLayout:function(c,a,b,e){var d=this;if(++d.componentLayoutCounter===1){d.afterFirstLayout(c,a)}if(d.hasListeners.resize&&(c!==b||a!==e)){d.fireEvent("resize",d,c,a,b,e)}},beforeComponentLayout:function(b,a){return true},setPosition:function(a,e,b){var c=this,d=c.beforeSetPosition.apply(c,arguments);if(d&&c.rendered){d=c.convertPosition(d);if(b){c.stopAnimation();c.animate(Ext.apply({duration:1000,listeners:{afteranimate:Ext.Function.bind(c.afterSetPosition,c,[d.left,d.top])},to:d},b))}else{if(d.left!==undefined&&d.top!==undefined){c.el.setLeftTop(d.left,d.top)}else{if(d.left!==undefined){c.el.setLeft(d.left)}else{if(d.top!==undefined){c.el.setTop(d.top)}}}c.afterSetPosition(d.left,d.top)}}return c},beforeSetPosition:function(a,e,b){var d,c;if(!a||Ext.isNumber(a)){d={x:a,y:e,anim:b}}else{if(Ext.isNumber(c=a[0])){d={x:c,y:a[1],anim:e}}else{d={x:a.x,y:a.y,anim:e}}}d.hasX=Ext.isNumber(d.x);d.hasY=Ext.isNumber(d.y);this.x=d.x;this.y=d.y;return(d.hasX||d.hasY)?d:null},afterSetPosition:function(a,c){var b=this;b.onPosition(a,c);if(b.hasListeners.move){b.fireEvent("move",b,a,c)}},convertPosition:function(d,b){var a={},c=Ext.Element;if(d.hasX){a.left=b?c.addUnits(d.x):d.x}if(d.hasY){a.top=b?c.addUnits(d.y):d.y}return a},onPosition:Ext.emptyFn,setWidth:function(a){return this.setSize(a)},setHeight:function(a){return this.setSize(undefined,a)},getSize:function(){return this.el.getSize()},getWidth:function(){return this.el.getWidth()},getHeight:function(){return this.el.getHeight()},getLoader:function(){var c=this,b=c.autoLoad?(Ext.isObject(c.autoLoad)?c.autoLoad:{url:c.autoLoad}):null,a=c.loader||b;if(a){if(!a.isLoader){c.loader=new Ext.ComponentLoader(Ext.apply({target:c,autoLoad:b},a))}else{a.setTarget(c)}return c.loader}return null},setDocked:function(b,c){var a=this;a.dock=b;if(c&&a.ownerCt&&a.rendered){a.ownerCt.updateLayout()}return a},setBorder:function(b,d){var c=this,a=!!d;if(c.rendered||a){if(!a){d=c.el}if(!b){b=0}else{b=Ext.Element.unitizeBox((b===true)?1:b)}d.setStyle("border-width",b);if(!a){c.updateLayout()}}c.border=b},onDestroy:function(){var a=this;if(a.monitorResize&&Ext.EventManager.resizeEvent){Ext.EventManager.resizeEvent.removeListener(a.setSize,a)}Ext.destroy(a.componentLayout,a.loadMask,a.floatingItems)},destroy:function(){var d=this,b=d.renderSelectors,a,c;if(!d.isDestroyed){if(!d.hasListeners.beforedestroy||d.fireEvent("beforedestroy",d)!==false){d.destroying=true;d.beforeDestroy();if(d.floating){delete d.floatParent;if(d.zIndexManager){d.zIndexManager.unregister(d)}}else{if(d.ownerCt&&d.ownerCt.remove){d.ownerCt.remove(d,false)}}d.onDestroy();Ext.destroy(d.plugins);if(d.hasListeners.destroy){d.fireEvent("destroy",d)}Ext.ComponentManager.unregister(d);d.mixins.state.destroy.call(d);d.clearListeners();if(d.rendered){Ext.AbstractComponent.cancelLayout(d);if(!d.preserveElOnDestroy){d.el.remove()}d.mixins.elementCt.destroy.call(d);if(b){for(a in b){if(b.hasOwnProperty(a)){c=d[a];if(c){delete d[a];c.remove()}}}}delete d.el;delete d.frameBody;delete d.rendered}d.destroying=false;d.isDestroyed=true}}},getPlugin:function(b){var c=0,a=this.plugins,d=a.length;for(;c<d;c++){if(a[c].pluginId===b){return a[c]}}},isDescendantOf:function(a){return !!this.findParentBy(function(b){return b===a})}},function(){var a=this;a.createAlias({on:"addListener",prev:"previousSibling",next:"nextSibling"});Ext.resumeLayouts=function(b){a.resumeLayouts(b)};Ext.suspendLayouts=function(){a.suspendLayouts()};Ext.batchLayouts=function(c,b){a.suspendLayouts();c.call(b);a.resumeLayouts(true)}});