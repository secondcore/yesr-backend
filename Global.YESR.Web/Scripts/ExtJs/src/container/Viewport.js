Ext.define("Ext.container.Viewport",{extend:"Ext.container.Container",alias:"widget.viewport",requires:["Ext.EventManager"],alternateClassName:"Ext.Viewport",isViewport:true,ariaRole:"application",preserveElOnDestroy:true,initComponent:function(){var c=this,a=document.body.parentNode,b;Ext.getScrollbarSize();c.width=c.height=undefined;c.callParent(arguments);Ext.fly(a).addCls(Ext.baseCSSPrefix+"viewport");if(c.autoScroll){delete c.autoScroll;Ext.fly(a).setStyle("overflow","auto")}c.el=b=Ext.getBody();b.setHeight=Ext.emptyFn;b.setWidth=Ext.emptyFn;b.setSize=Ext.emptyFn;b.dom.scroll="no";c.allowDomMove=false;c.renderTo=c.el},onRender:function(){var a=this;a.callParent(arguments);a.width=Ext.Element.getViewportWidth();a.height=Ext.Element.getViewportHeight()},afterFirstLayout:function(){var a=this;a.callParent(arguments);setTimeout(function(){Ext.EventManager.onWindowResize(a.fireResize,a)},1)},fireResize:function(b,a){if(b!=this.width||a!=this.height){this.setSize(b,a)}}});