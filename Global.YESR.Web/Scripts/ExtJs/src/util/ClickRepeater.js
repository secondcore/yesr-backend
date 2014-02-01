Ext.define("Ext.util.ClickRepeater",{extend:"Ext.util.Observable",constructor:function(b,a){var c=this;c.el=Ext.get(b);c.el.unselectable();Ext.apply(c,a);c.callParent();c.addEvents("mousedown","click","mouseup");if(!c.disabled){c.disabled=true;c.enable()}if(c.handler){c.on("click",c.handler,c.scope||c)}},interval:20,delay:250,preventDefault:true,stopDefault:false,timer:0,enable:function(){if(this.disabled){this.el.on("mousedown",this.handleMouseDown,this);if(Ext.isIE){this.el.on("dblclick",this.handleDblClick,this)}if(this.preventDefault||this.stopDefault){this.el.on("click",this.eventOptions,this)}}this.disabled=false},disable:function(a){if(a||!this.disabled){clearTimeout(this.timer);if(this.pressedCls){this.el.removeCls(this.pressedCls)}Ext.getDoc().un("mouseup",this.handleMouseUp,this);this.el.removeAllListeners()}this.disabled=true},setDisabled:function(a){this[a?"disable":"enable"]()},eventOptions:function(a){if(this.preventDefault){a.preventDefault()}if(this.stopDefault){a.stopEvent()}},destroy:function(){this.disable(true);Ext.destroy(this.el);this.clearListeners()},handleDblClick:function(a){clearTimeout(this.timer);this.el.blur();this.fireEvent("mousedown",this,a);this.fireEvent("click",this,a)},handleMouseDown:function(a){clearTimeout(this.timer);this.el.blur();if(this.pressedCls){this.el.addCls(this.pressedCls)}this.mousedownTime=new Date();Ext.getDoc().on("mouseup",this.handleMouseUp,this);this.el.on("mouseout",this.handleMouseOut,this);this.fireEvent("mousedown",this,a);this.fireEvent("click",this,a);if(this.accelerate){this.delay=400}a=new Ext.EventObjectImpl(a);this.timer=Ext.defer(this.click,this.delay||this.interval,this,[a])},click:function(a){this.fireEvent("click",this,a);this.timer=Ext.defer(this.click,this.accelerate?this.easeOutExpo(Ext.Date.getElapsed(this.mousedownTime),400,-390,12000):this.interval,this,[a])},easeOutExpo:function(e,a,g,f){return(e==f)?a+g:g*(-Math.pow(2,-10*e/f)+1)+a},handleMouseOut:function(){clearTimeout(this.timer);if(this.pressedCls){this.el.removeCls(this.pressedCls)}this.el.on("mouseover",this.handleMouseReturn,this)},handleMouseReturn:function(){this.el.un("mouseover",this.handleMouseReturn,this);if(this.pressedCls){this.el.addCls(this.pressedCls)}this.click()},handleMouseUp:function(a){clearTimeout(this.timer);this.el.un("mouseover",this.handleMouseReturn,this);this.el.un("mouseout",this.handleMouseOut,this);Ext.getDoc().un("mouseup",this.handleMouseUp,this);if(this.pressedCls){this.el.removeCls(this.pressedCls)}this.fireEvent("mouseup",this,a)}});