Ext.define("Ext.view.DragZone",{extend:"Ext.dd.DragZone",containerScroll:false,constructor:function(a){var b=this;Ext.apply(b,a);if(!b.ddGroup){b.ddGroup="view-dd-zone-"+b.view.id}b.callParent([b.view.el.dom.parentNode]);b.ddel=Ext.get(document.createElement("div"));b.ddel.addCls(Ext.baseCSSPrefix+"grid-dd-wrap")},init:function(c,a,b){this.initTarget(c,a,b);this.view.mon(this.view,{itemmousedown:this.onItemMouseDown,scope:this})},onItemMouseDown:function(b,a,d,c,f){if(!this.isPreventDrag(f,a,d,c)){this.handleMouseDown(f);if(b.getSelectionModel().selectionMode=="MULTI"&&!f.ctrlKey&&b.getSelectionModel().isSelected(a)){return false}}},isPreventDrag:function(a){return false},getDragData:function(c){var a=this.view,b=c.getTarget(a.getItemSelector());if(b){return{copy:a.copy||(a.allowCopy&&c.ctrlKey),event:new Ext.EventObjectImpl(c),view:a,ddel:this.ddel,item:b,records:a.getSelectionModel().getSelection(),fromPosition:Ext.fly(b).getXY()}}},onInitDrag:function(b,i){var f=this,g=f.dragData,d=g.view,a=d.getSelectionModel(),c=d.getRecord(g.item),h=g.event;if(!a.isSelected(c)||h.hasModifier()){a.selectWithEvent(c,h,true)}g.records=a.getSelection();f.ddel.update(f.getDragText());f.proxy.update(f.ddel.dom);f.onStartDrag(b,i);return true},getDragText:function(){var a=this.dragData.records.length;return Ext.String.format(this.dragText,a,a==1?"":"s")},getRepairXY:function(b,a){return a?a.fromPosition:false}});