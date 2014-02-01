Ext.define("Ext.menu.KeyNav",{extend:"Ext.util.KeyNav",requires:["Ext.FocusManager"],constructor:function(b){var a=this;a.menu=b;a.callParent([b.el,{down:a.down,enter:a.enter,esc:a.escape,left:a.left,right:a.right,space:a.enter,tab:a.tab,up:a.up}])},down:function(b){var a=this,c=a.menu.focusedItem;if(c&&b.getKey()==Ext.EventObject.DOWN&&a.isWhitelisted(c)){return true}a.focusNextItem(1)},enter:function(b){var c=this.menu,a=c.focusedItem;if(c.activeItem){c.onClick(b)}else{if(a&&a.isFormField){return true}}},escape:function(a){Ext.menu.Manager.hideAll()},focusNextItem:function(f){var g=this.menu,b=g.items,d=g.focusedItem,c=d?b.indexOf(d):-1,a=c+f,e;while(a!=c){if(a<0){a=b.length-1}else{if(a>=b.length){a=0}}e=b.getAt(a);if(g.canActivateItem(e)){g.setActiveItem(e);break}a+=f}},isWhitelisted:function(a){return Ext.FocusManager.isWhitelisted(a)},left:function(b){var c=this.menu,d=c.focusedItem,a=c.activeItem;if(d&&this.isWhitelisted(d)){return true}c.hide();if(c.parentMenu){c.parentMenu.focus()}},right:function(c){var d=this.menu,f=d.focusedItem,a=d.activeItem,b;if(f&&this.isWhitelisted(f)){return true}if(a){b=d.activeItem.menu;if(b){a.expandMenu(0);Ext.defer(function(){b.setActiveItem(b.items.getAt(0))},25)}}},tab:function(b){var a=this;if(b.shiftKey){a.up(b)}else{a.down(b)}},up:function(b){var a=this,c=a.menu.focusedItem;if(c&&b.getKey()==Ext.EventObject.UP&&a.isWhitelisted(c)){return true}a.focusNextItem(-1)}});