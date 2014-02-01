Ext.define("Ext.selection.CellModel",{extend:"Ext.selection.Model",alias:"selection.cellmodel",requires:["Ext.util.KeyNav"],isCellModel:true,enableKeyNav:true,preventWrap:false,noSelection:{row:-1,column:-1},constructor:function(){this.addEvents("deselect","select");this.callParent(arguments)},bindComponent:function(a){var b=this;b.primaryView=a;b.views=b.views||[];b.views.push(a);b.bindStore(a.getStore(),true);a.on({cellmousedown:b.onMouseDown,refresh:b.onViewRefresh,scope:b});if(b.enableKeyNav){b.initKeyNav(a)}},initKeyNav:function(a){var b=this;if(!a.rendered){a.on("render",Ext.Function.bind(b.initKeyNav,b,[a],0),b,{single:true});return}a.el.set({tabIndex:-1});b.keyNav=new Ext.util.KeyNav(a.el,{up:b.onKeyUp,down:b.onKeyDown,right:b.onKeyRight,left:b.onKeyLeft,tab:b.onKeyTab,scope:b})},getHeaderCt:function(){return this.primaryView.headerCt},onKeyUp:function(b,a){this.keyNavigation=true;this.move("up",b);this.keyNavigation=false},onKeyDown:function(b,a){this.keyNavigation=true;this.move("down",b);this.keyNavigation=false},onKeyLeft:function(b,a){this.keyNavigation=true;this.move("left",b);this.keyNavigation=false},onKeyRight:function(b,a){this.keyNavigation=true;this.move("right",b);this.keyNavigation=false},move:function(a,c){var b=this,d=b.primaryView.walkCells(b.getCurrentPosition(),a,c,b.preventWrap);if(d){return b.setCurrentPosition(d)}return null},getCurrentPosition:function(){return this.selection},setCurrentPosition:function(b){var a=this;a.lastSelection=a.selection;if(a.selection){a.onCellDeselect(a.selection)}if(b){a.nextSelection=new a.Selection(a);a.nextSelection.setPosition(b);a.onCellSelect(a.nextSelection);return a.selection=a.nextSelection}return null},onStoreRemove:function(b,a,c){var d=this,e=d.getCurrentPosition();d.callParent(arguments);if(e){if(e.row==c){if(c<b.getCount()-1){e.setPosition(c,e.column);d.setCurrentPosition(e)}else{delete d.selection}}else{if(c<e.row){e.setPosition(e.row-1,e.column);d.setCurrentPosition(e)}}}},onMouseDown:function(c,a,d,b,g,h,f){this.setCurrentPosition({view:c,row:h,column:d})},onCellSelect:function(a,b){if(a&&a.row!==undefined){this.doSelect(this.view.getStore().getAt(a.row),false,b)}},onCellDeselect:function(a,b){if(a&&a.row!==undefined){this.doDeselect(this.view.getStore().getAt(a.row),b)}},onSelectChange:function(b,e,d,g){var f=this,h,c,a=f.primaryView;if(e){h=f.nextSelection;c="select"}else{h=f.lastSelection||f.noSelection;c="deselect"}if((d||f.fireEvent("before"+c,f,b,h.row,h.column))!==false&&g()!==false){if(e){a.onCellSelect(h);a.onCellFocus(h)}else{a.onCellDeselect(h);delete f.selection}if(!d){f.fireEvent(c,f,b,h.row,h.column)}}},onKeyTab:function(d,b){var c=this,a=c.primaryView.editingPlugin;if(a&&c.wasEditing){c.onEditorTab(a,d)}else{c.move(d.shiftKey?"left":"right",d)}},onEditorTab:function(b,f){var c=this,d=f.shiftKey?"left":"right",a=c.move(d,f);if(a){if(b.startEditByPosition(a)){c.wasEditing=false}else{c.wasEditing=true;if(!a.columnHeader.dataIndex){c.onEditorTab(b,f)}}}},refresh:function(){var b=this.getCurrentPosition(),a;if(b&&(a=this.store.indexOf(this.selected.last()))!==-1){b.row=a}},onViewRefresh:function(){var c=this,f=c.getCurrentPosition(),b=c.primaryView,e=b.headerCt,a,d;if(f){a=f.record;d=f.columnHeader;c.onCellDeselect(f,true);if(!d.isDescendantOf(e)){d=e.queryById(d.id)||e.down('[text="'+d.text+'"]')||e.down('[dataIndex="'+d.dataIndex+'"]')}if(d&&(b.store.indexOfId(a.getId())!==-1)){(c.selection=new c.Selection(c)).setPosition(a,d);c.onCellSelect(c.selection,true)}}},selectByPosition:function(a){this.setCurrentPosition(a)}},function(){var a=this.prototype.Selection=function(b){this.model=b};a.prototype.setPosition=function(f,d){var e=this,b=e.model.primaryView,c;if(arguments.length===1){if(f.view){b=f.view}d=f.column;f=f.row}c=b.store;if(typeof f==="number"){e.row=f;e.record=c.getAt(f)}else{if(f.isModel){e.record=f;e.row=b.indexOf(f)}else{if(f.tagName){e.record=b.getRecord(f);e.row=b.indexOf(e.record)}}}if(typeof d==="number"){e.column=d;e.columnHeader=b.getHeaderAtIndex(d)}else{e.columnHeader=d;e.column=d.getIndex()}return e}});