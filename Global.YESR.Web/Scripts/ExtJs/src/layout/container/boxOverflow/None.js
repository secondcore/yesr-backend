Ext.define("Ext.layout.container.boxOverflow.None",{alternateClassName:"Ext.layout.boxOverflow.None",constructor:function(b,a){this.layout=b;Ext.apply(this,a)},handleOverflow:Ext.emptyFn,clearOverflow:Ext.emptyFn,beginLayout:Ext.emptyFn,beginLayoutCycle:Ext.emptyFn,finishedLayout:Ext.emptyFn,completeLayout:function(b){var a=this,c=b.state.boxPlan,d;if(c&&c.tooNarrow){d=a.handleOverflow(b);if(d){if(d.reservedSpace){a.layout.publishInnerCtSize(b,d.reservedSpace)}}}else{a.clearOverflow()}},onRemove:Ext.emptyFn,getItem:function(a){return this.layout.owner.getComponent(a)},getOwnerType:function(a){var b="";if(a.is("toolbar")){b="toolbar"}else{if(a.is("tabbar")){b="tabbar"}else{b=a.getXType()}}return b},getPrefixConfig:Ext.emptyFn,getSuffixConfig:Ext.emptyFn,getOverflowCls:function(){return""}});