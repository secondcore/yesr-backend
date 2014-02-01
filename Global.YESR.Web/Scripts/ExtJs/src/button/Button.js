Ext.define("Ext.button.Button",{alias:"widget.button",extend:"Ext.Component",requires:["Ext.menu.Manager","Ext.util.ClickRepeater","Ext.layout.component.Button","Ext.util.TextMetrics","Ext.util.KeyMap"],alternateClassName:"Ext.Button",isButton:true,componentLayout:"button",hidden:false,disabled:false,pressed:false,enableToggle:false,menuAlign:"tl-bl?",textAlign:"center",type:"button",clickEvent:"click",preventDefault:true,handleMouseEvents:true,tooltipType:"qtip",baseCls:Ext.baseCSSPrefix+"btn",pressedCls:"pressed",overCls:"over",focusCls:"focus",menuActiveCls:"menu-active",hrefTarget:"_blank",border:true,childEls:["btnEl","btnWrap","btnInnerEl","btnIconEl"],renderTpl:['<em id="{id}-btnWrap"<tpl if="splitCls"> class="{splitCls}"</tpl>>','<tpl if="href">','<a id="{id}-btnEl" href="{href}" class="{btnCls}" target="{hrefTarget}"','<tpl if="tabIndex"> tabIndex="{tabIndex}"</tpl>','<tpl if="disabled"> disabled="disabled"</tpl>',' role="link">','<span id="{id}-btnInnerEl" class="{baseCls}-inner">',"{text}","</span>",'<span id="{id}-btnIconEl" class="{baseCls}-icon {iconCls}"<tpl if="iconUrl"> style="background-image:url({iconUrl})"</tpl>></span>',"</a>","<tpl else>",'<button id="{id}-btnEl" type="{type}" class="{btnCls}" hidefocus="true"','<tpl if="tabIndex"> tabIndex="{tabIndex}"</tpl>','<tpl if="disabled"> disabled="disabled"</tpl>',' role="button" autocomplete="off">','<span id="{id}-btnInnerEl" class="{baseCls}-inner" style="{innerSpanStyle}">',"{text}","</span>",'<span id="{id}-btnIconEl" class="{baseCls}-icon {iconCls}"<tpl if="iconUrl"> style="background-image:url({iconUrl})"</tpl>></span>',"</button>","</tpl>","</em>",'<tpl if="closable">','<a id="{id}-closeEl" href="#" class="{baseCls}-close-btn" title="{closeText}"></a>',"</tpl>"],scale:"small",allowedScales:["small","medium","large"],iconAlign:"left",arrowAlign:"right",arrowCls:"arrow",maskOnDisable:false,persistentPadding:undefined,shrinkWrap:3,frame:true,initComponent:function(){var a=this;a.callParent(arguments);a.addEvents("click","toggle","mouseover","mouseout","menushow","menuhide","menutriggerover","menutriggerout");if(a.menu){a.split=true;a.menu=Ext.menu.Manager.get(a.menu);a.menu.ownerButton=a}if(a.url){a.href=a.url}if(a.href&&!a.hasOwnProperty("preventDefault")){a.preventDefault=false}if(Ext.isString(a.toggleGroup)){a.enableToggle=true}},getActionEl:function(){return this.btnEl},getFocusEl:function(){return this.inOnFocus?this.el:this.btnEl},onFocus:function(b){var a=this;a.inOnFocus=true;a.callParent(arguments);a.inOnFocus=false},onBlur:function(c){var b=this,a=b.focusCls,d=b.getEl();if(b.destroying){return}b.beforeBlur(c);if(a&&d){d.removeCls(b.removeClsWithUI(a,true))}if(b.validateOnBlur){b.validate()}b.hasFocus=false;b.fireEvent("blur",b,c);b.postBlur(c)},setComponentCls:function(){var b=this,a=b.getComponentCls();if(!Ext.isEmpty(b.oldCls)){b.removeClsWithUI(b.oldCls);b.removeClsWithUI(b.pressedCls)}b.oldCls=a;b.addClsWithUI(a)},getComponentCls:function(){var b=this,a=[];if(b.iconCls||b.icon){if(b.text){a.push("icon-text-"+b.iconAlign)}else{a.push("icon")}}else{if(b.text){a.push("noicon")}}if(b.pressed){a.push(b.pressedCls)}return a},beforeRender:function(){var a=this;a.callParent();a.oldCls=a.getComponentCls();a.addClsWithUI(a.oldCls);Ext.applyIf(a.renderData,a.getTemplateArgs());if(a.scale){a.setScale(a.scale)}},onRender:function(){var c=this,a,b;c.doc=Ext.getDoc();c.callParent(arguments);if(c.split&&c.arrowTooltip){c.arrowEl.dom.setAttribute(c.getTipAttr(),c.arrowTooltip)}a=c.el;if(c.tooltip){c.setTooltip(c.tooltip,true)}if(c.handleMouseEvents){b={scope:c,mouseover:c.onMouseOver,mouseout:c.onMouseOut,mousedown:c.onMouseDown};if(c.split){b.mousemove=c.onMouseMove}}else{b={scope:c}}if(c.menu){c.mon(c.menu,{scope:c,show:c.onMenuShow,hide:c.onMenuHide});c.keyMap=new Ext.util.KeyMap({target:c.el,key:Ext.EventObject.DOWN,handler:c.onDownKey,scope:c})}if(c.repeat){c.mon(new Ext.util.ClickRepeater(a,Ext.isObject(c.repeat)?c.repeat:{}),"click",c.onRepeatClick,c)}else{b[c.clickEvent]=c.onClick}c.mon(a,b);Ext.ButtonToggleManager.register(c)},getTemplateArgs:function(){var c=this,b=c.getPersistentPadding(),a="";if(Math.max.apply(Math,b)>0){a="margin:"+Ext.Array.map(b,function(d){return -d+"px"}).join(" ")}return{href:c.getHref(),disabled:c.disabled,hrefTarget:c.hrefTarget,type:c.type,btnCls:c.getBtnCls(),splitCls:c.getSplitCls(),iconUrl:c.icon,iconCls:c.iconCls,text:c.text||"&#160;",tabIndex:c.tabIndex,innerSpanStyle:a}},getHref:function(){var a=this,b=Ext.apply({},a.baseParams);b=Ext.apply(b,a.params);return a.href?Ext.urlAppend(a.href,Ext.Object.toQueryString(b)):false},setParams:function(a){this.params=a;this.btnEl.dom.href=this.getHref()},getSplitCls:function(){var a=this;return a.split?(a.baseCls+"-"+a.arrowCls)+" "+(a.baseCls+"-"+a.arrowCls+"-"+a.arrowAlign):""},getBtnCls:function(){return this.textAlign?this.baseCls+"-"+this.textAlign:""},setIconCls:function(b){var d=this,a=d.btnIconEl,c=d.iconCls;d.iconCls=b;if(a){a.removeCls(c);a.addCls(b||"");d.setComponentCls();if(d.didIconStateChange(c,b)){d.updateLayout()}}return d},setTooltip:function(c,a){var b=this;if(b.rendered){if(!a){b.clearTip()}if(Ext.isObject(c)){Ext.tip.QuickTipManager.register(Ext.apply({target:b.btnEl.id},c));b.tooltip=c}else{b.btnEl.dom.setAttribute(b.getTipAttr(),c)}}else{b.tooltip=c}return b},setTextAlign:function(c){var b=this,a=b.btnEl;if(a){a.removeCls(b.baseCls+"-"+b.textAlign);a.addCls(b.baseCls+"-"+c)}b.textAlign=c;return b},getTipAttr:function(){return this.tooltipType=="qtip"?"data-qtip":"title"},getRefItems:function(a){var c=this.menu,b;if(c){b=c.getRefItems(a);b.unshift(c)}return b||[]},clearTip:function(){if(Ext.isObject(this.tooltip)){Ext.tip.QuickTipManager.unregister(this.btnEl)}},beforeDestroy:function(){var a=this;if(a.rendered){a.clearTip()}if(a.menu&&a.destroyMenu!==false){Ext.destroy(a.menu)}Ext.destroy(a.btnInnerEl,a.repeater);a.callParent()},onDestroy:function(){var a=this;if(a.rendered){a.doc.un("mouseover",a.monitorMouseOver,a);a.doc.un("mouseup",a.onMouseUp,a);delete a.doc;Ext.ButtonToggleManager.unregister(a);Ext.destroy(a.keyMap);delete a.keyMap}a.callParent()},setHandler:function(b,a){this.handler=b;this.scope=a;return this},setText:function(b){var a=this;a.text=b;if(a.rendered){a.btnInnerEl.update(b||"&#160;");a.setComponentCls();if(Ext.isStrict&&Ext.isIE8){a.el.repaint()}a.updateLayout()}return a},setIcon:function(b){var c=this,a=c.btnIconEl,d=c.icon;c.icon=b;if(a){a.setStyle("background-image",b?"url("+b+")":"");c.setComponentCls();if(c.didIconStateChange(d,b)){c.updateLayout()}}return c},didIconStateChange:function(a,c){var b=Ext.isEmpty(c);return Ext.isEmpty(a)?!b:b},getText:function(){return this.text},toggle:function(c,a){var b=this;c=c===undefined?!b.pressed:!!c;if(c!==b.pressed){if(b.rendered){b[c?"addClsWithUI":"removeClsWithUI"](b.pressedCls)}b.pressed=c;if(!a){b.fireEvent("toggle",b,c);Ext.callback(b.toggleHandler,b.scope||b,[b,c])}}return b},maybeShowMenu:function(){var a=this;if(a.menu&&!a.hasVisibleMenu()&&!a.ignoreNextClick){a.showMenu()}},showMenu:function(){var a=this;if(a.rendered&&a.menu){if(a.tooltip&&a.getTipAttr()!="title"){Ext.tip.QuickTipManager.getQuickTip().cancelShow(a.btnEl)}if(a.menu.isVisible()){a.menu.hide()}a.menu.showBy(a.el,a.menuAlign,((!Ext.isStrict&&Ext.isIE)||Ext.isIE6)?[-2,-2]:undefined)}return a},hideMenu:function(){if(this.hasVisibleMenu()){this.menu.hide()}return this},hasVisibleMenu:function(){var a=this.menu;return a&&a.rendered&&a.isVisible()},onRepeatClick:function(a,b){this.onClick(b)},onClick:function(b){var a=this;if(a.preventDefault||(a.disabled&&a.getHref())&&b){b.preventDefault()}if(b.button!==0){return}if(!a.disabled){a.doToggle();a.maybeShowMenu();a.fireHandler(b)}},fireHandler:function(c){var b=this,a=b.handler;if(b.fireEvent("click",b,c)!==false){if(a){a.call(b.scope||b,b,c)}b.blur()}},doToggle:function(){var a=this;if(a.enableToggle&&(a.allowDepress!==false||!a.pressed)){a.toggle()}},onMouseOver:function(b){var a=this;if(!a.disabled&&!b.within(a.el,true,true)){a.onMouseEnter(b)}},onMouseOut:function(b){var a=this;if(!b.within(a.el,true,true)){if(a.overMenuTrigger){a.onMenuTriggerOut(b)}a.onMouseLeave(b)}},onMouseMove:function(g){var d=this,c=d.el,f=d.overMenuTrigger,b,a;if(d.split){if(d.arrowAlign==="right"){b=g.getX()-c.getX();a=c.getWidth()}else{b=g.getY()-c.getY();a=c.getHeight()}if(b>(a-d.getTriggerSize())){if(!f){d.onMenuTriggerOver(g)}}else{if(f){d.onMenuTriggerOut(g)}}}},getTriggerSize:function(){var e=this,c=e.triggerSize,b,a,d;if(c===d){b=e.arrowAlign;a=b.charAt(0);c=e.triggerSize=e.el.getFrameWidth(a)+e.btnWrap.getFrameWidth(a)+e.frameSize[b]}return c},onMouseEnter:function(b){var a=this;a.addClsWithUI(a.overCls);a.fireEvent("mouseover",a,b)},onMouseLeave:function(b){var a=this;a.removeClsWithUI(a.overCls);a.fireEvent("mouseout",a,b)},onMenuTriggerOver:function(b){var a=this;a.overMenuTrigger=true;a.fireEvent("menutriggerover",a,a.menu,b)},onMenuTriggerOut:function(b){var a=this;delete a.overMenuTrigger;a.fireEvent("menutriggerout",a,a.menu,b)},enable:function(a){var b=this;b.callParent(arguments);if(b.btnEl){b.btnEl.dom.disabled=false}b.removeClsWithUI("disabled");return b},disable:function(a){var b=this;b.callParent(arguments);if(b.btnEl){b.btnEl.dom.disabled=true}b.addClsWithUI("disabled");b.removeClsWithUI(b.overCls);if(b.btnInnerEl&&(Ext.isIE6||Ext.isIE7)){b.btnInnerEl.repaint()}return b},setScale:function(c){var a=this,b=a.ui.replace("-"+a.scale,"");if(!Ext.Array.contains(a.allowedScales,c)){throw ("#setScale: scale must be an allowed scale ("+a.allowedScales.join(", ")+")")}a.scale=c;a.setUI(b)},setUI:function(b){var a=this;if(a.scale&&!b.match(a.scale)){b=b+"-"+a.scale}a.callParent([b])},onMouseDown:function(b){var a=this;if(!a.disabled&&b.button===0){a.addClsWithUI(a.pressedCls);a.doc.on("mouseup",a.onMouseUp,a)}},onMouseUp:function(b){var a=this;if(b.button===0){if(!a.pressed){a.removeClsWithUI(a.pressedCls)}a.doc.un("mouseup",a.onMouseUp,a)}},onMenuShow:function(b){var a=this;a.ignoreNextClick=0;a.addClsWithUI(a.menuActiveCls);a.fireEvent("menushow",a,a.menu)},onMenuHide:function(b){var a=this;a.removeClsWithUI(a.menuActiveCls);a.ignoreNextClick=Ext.defer(a.restoreClick,250,a);a.fireEvent("menuhide",a,a.menu)},restoreClick:function(){this.ignoreNextClick=0},onDownKey:function(){var a=this;if(!a.disabled){if(a.menu){a.showMenu()}}},getPersistentPadding:function(){var d=this,e=d.persistentPadding,b,a,c,f;if(!e){e=d.self.prototype.persistentPadding=[0,0,0,0];if(!Ext.isIE){b=new Ext.button.Button({text:"test",style:"position:absolute;top:-999px;"});b.el=Ext.DomHelper.append(Ext.getBody(),b.getRenderTree(),true);b.applyChildEls(b.el);c=b.btnEl;f=b.btnInnerEl;c.setSize(null,null);a=f.getOffsetsTo(c);e[0]=a[1];e[1]=c.getWidth()-f.getWidth()-a[0];e[2]=c.getHeight()-f.getHeight()-a[1];e[3]=a[0];b.destroy();b.el.remove()}}return e}},function(){var a={},b=function(d,h){if(h){var f=a[d.toggleGroup],e=f.length,c;for(c=0;c<e;c++){if(f[c]!==d){f[c].toggle(false)}}}};Ext.ButtonToggleManager={register:function(c){if(!c.toggleGroup){return}var d=a[c.toggleGroup];if(!d){d=a[c.toggleGroup]=[]}d.push(c);c.on("toggle",b)},unregister:function(c){if(!c.toggleGroup){return}var d=a[c.toggleGroup];if(d){Ext.Array.remove(d,c);c.un("toggle",b)}},getPressed:function(f){var e=a[f],d=0,c;if(e){for(c=e.length;d<c;d++){if(e[d].pressed===true){return e[d]}}}return null}}});