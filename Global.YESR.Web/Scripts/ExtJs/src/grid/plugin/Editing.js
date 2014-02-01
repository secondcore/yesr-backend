Ext.define("Ext.grid.plugin.Editing",{alias:"editing.editing",requires:["Ext.grid.column.Column","Ext.util.KeyNav"],mixins:{observable:"Ext.util.Observable"},clicksToEdit:2,triggerEvent:undefined,defaultFieldXType:"textfield",editStyle:"",constructor:function(a){var b=this;Ext.apply(b,a);b.addEvents("beforeedit","edit","validateedit","canceledit");b.mixins.observable.constructor.call(b);b.on("edit",function(c,d){b.fireEvent("afteredit",c,d)})},init:function(a){var b=this;if(a.lockable){a=a.view.normalGrid}b.grid=a;b.view=a.view;b.initEvents();b.mon(a,"reconfigure",b.onReconfigure,b);b.onReconfigure();a.relayEvents(b,["beforeedit","edit","validateedit","canceledit"]);a.isEditable=true;a.editingPlugin=a.view.editingPlugin=b},onReconfigure:function(){this.initFieldAccessors(this.view.getGridColumns())},destroy:function(){var b=this,a=b.grid;Ext.destroy(b.keyNav);b.removeFieldAccessors(a.getView().getGridColumns());b.clearListeners();delete b.grid.editingPlugin;delete b.grid.view.editingPlugin;delete b.grid;delete b.view;delete b.editor;delete b.keyNav},getEditStyle:function(){return this.editStyle},initFieldAccessors:function(a){a=[].concat(a);var d=this,f,e=a.length,b;for(f=0;f<e;f++){b=a[f];Ext.applyIf(b,{getEditor:function(c,g){return d.getColumnField(this,g)},setEditor:function(c){d.setColumnField(this,c)}})}},removeFieldAccessors:function(a){a=[].concat(a);var e,d=a.length,b;for(e=0;e<d;e++){b=a[e];delete b.getEditor;delete b.setEditor}},getColumnField:function(b,a){var c=b.field;if(!c&&b.editor){c=b.editor;delete b.editor}if(!c&&a){c=a}if(c){if(Ext.isString(c)){c={xtype:c}}if(!c.isFormField){c=Ext.ComponentManager.create(c,this.defaultFieldXType)}b.field=c;Ext.apply(c,{name:b.dataIndex});return c}},setColumnField:function(a,b){if(Ext.isObject(b)&&!b.isFormField){b=Ext.ComponentManager.create(b,this.defaultFieldXType)}a.field=b},initEvents:function(){var a=this;a.initEditTriggers();a.initCancelTriggers()},initCancelTriggers:Ext.emptyFn,initEditTriggers:function(){var b=this,a=b.view;if(b.triggerEvent=="cellfocus"){b.mon(a,"cellfocus",b.onCellFocus,b)}else{if(b.triggerEvent=="rowfocus"){b.mon(a,"rowfocus",b.onRowFocus,b)}else{if(a.selModel.isCellModel){a.onCellFocus=Ext.Function.bind(b.beforeViewCellFocus,b)}b.mon(a,b.triggerEvent||("cell"+(b.clicksToEdit===1?"click":"dblclick")),b.onCellClick,b)}}a.on("render",b.addHeaderEvents,b,{single:true})},beforeViewCellFocus:function(a){if(this.view.selModel.keyNavigation||!this.isCellEditable||!this.isCellEditable(a.row,a.columnHeader)){this.view.focusCell.apply(this.view,arguments)}},onRowFocus:function(a,c,b){this.startEdit(c,0)},onCellFocus:function(c,b,a){this.startEdit(a.row,a.column)},onCellClick:function(c,a,h,b,g,d,f){if(!c.expanderSelector||!f.getTarget(c.expanderSelector)){this.startEdit(b,c.getHeaderAtIndex(h))}},addHeaderEvents:function(){var a=this;a.mon(a.grid.headerCt,{scope:a,add:a.onColumnAdd,remove:a.onColumnRemove});a.keyNav=Ext.create("Ext.util.KeyNav",a.view.el,{enter:a.onEnterKey,esc:a.onEscKey,scope:a})},onColumnAdd:function(a,b){if(b.isHeader){this.initFieldAccessors(b)}},onColumnRemove:function(a,b){if(b.isHeader){this.removeFieldAccessors(b)}},onEnterKey:function(g){var d=this,c=d.grid,b=c.getSelectionModel(),a,h,f=c.headerCt.getHeaderAtIndex(0);if(b.getCurrentPosition){h=b.getCurrentPosition();if(h){a=c.store.getAt(h.row);f=c.headerCt.getHeaderAtIndex(h.column)}}else{a=b.getLastSelected()}if(a&&f){d.startEdit(a,f)}},onEscKey:function(a){this.cancelEdit()},beforeEdit:Ext.emptyFn,startEdit:function(a,d){var c=this,b=c.getEditingContext(a,d);if(c.beforeEdit(b)===false||c.fireEvent("beforeedit",c,b)===false||b.cancel||!c.grid.view.isVisible(true)){return false}c.context=b;c.editing=true},getEditingContext:function(b,g){var f=this,c=f.grid,a=c.getView(),e=a.getNode(b),d,h;if(!e){return}g=c.headerCt.getVisibleHeaderClosestToIndex(Ext.isNumber(g)?g:g.getIndex());if(!g){return}h=g.getIndex();if(Ext.isNumber(b)){d=b;b=a.getRecord(e)}else{d=a.indexOf(e)}return{grid:c,record:b,field:g.dataIndex,value:b.get(g.dataIndex),row:a.getNode(d),column:g,rowIdx:d,colIdx:h}},cancelEdit:function(){var a=this;a.editing=false;a.fireEvent("canceledit",a,a.context)},completeEdit:function(){var a=this;if(a.editing&&a.validateEdit()){a.fireEvent("edit",a,a.context)}delete a.context;a.editing=false},validateEdit:function(){var b=this,a=b.context;return b.fireEvent("validateedit",b,a)!==false&&!a.cancel}});