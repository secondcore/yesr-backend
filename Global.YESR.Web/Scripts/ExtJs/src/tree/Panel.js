Ext.define("Ext.tree.Panel",{extend:"Ext.panel.Table",alias:"widget.treepanel",alternateClassName:["Ext.tree.TreePanel","Ext.TreePanel"],requires:["Ext.tree.View","Ext.selection.TreeModel","Ext.tree.Column","Ext.data.TreeStore"],viewType:"treeview",selType:"treemodel",treeCls:Ext.baseCSSPrefix+"tree-panel",deferRowRender:false,rowLines:false,lines:true,useArrows:false,singleExpand:false,ddConfig:{enableDrag:true,enableDrop:true},rootVisible:true,displayField:"text",root:null,normalCfgCopy:["displayField","root","singleExpand","useArrows","lines","rootVisible","scroll"],lockedCfgCopy:["displayField","root","singleExpand","useArrows","lines","rootVisible"],isTree:true,constructor:function(a){a=a||{};if(a.animate===undefined){a.animate=Ext.isDefined(this.animate)?this.animate:Ext.enableFx}this.enableAnimations=a.animate;delete a.animate;this.callParent([a])},initComponent:function(){var c=this,b=[c.treeCls],a;if(c.useArrows){b.push(Ext.baseCSSPrefix+"tree-arrows");c.lines=false}if(c.lines){b.push(Ext.baseCSSPrefix+"tree-lines")}else{if(!c.useArrows){b.push(Ext.baseCSSPrefix+"tree-no-lines")}}if(Ext.isString(c.store)){c.store=Ext.StoreMgr.lookup(c.store)}else{if(!c.store||Ext.isObject(c.store)&&!c.store.isStore){c.store=new Ext.data.TreeStore(Ext.apply({},c.store||{},{root:c.root,fields:c.fields,model:c.model,folderSort:c.folderSort}))}else{if(c.root){c.store=Ext.data.StoreManager.lookup(c.store);c.store.setRootNode(c.root);if(c.folderSort!==undefined){c.store.folderSort=c.folderSort;c.store.sort()}}}}c.viewConfig=Ext.apply({},c.viewConfig);c.viewConfig=Ext.applyIf(c.viewConfig,{rootVisible:c.rootVisible,animate:c.enableAnimations,singleExpand:c.singleExpand,node:c.store.getRootNode(),hideHeaders:c.hideHeaders});c.mon(c.store,{scope:c,rootchange:c.onRootChange,clear:c.onClear});c.relayEvents(c.store,["beforeload","load"]);c.store.on({append:c.createRelayer("itemappend"),remove:c.createRelayer("itemremove"),move:c.createRelayer("itemmove",[0,4]),insert:c.createRelayer("iteminsert"),beforeappend:c.createRelayer("beforeitemappend"),beforeremove:c.createRelayer("beforeitemremove"),beforemove:c.createRelayer("beforeitemmove"),beforeinsert:c.createRelayer("beforeiteminsert"),expand:c.createRelayer("itemexpand",[0,1]),collapse:c.createRelayer("itemcollapse",[0,1]),beforeexpand:c.createRelayer("beforeitemexpand",[0,1]),beforecollapse:c.createRelayer("beforeitemcollapse",[0,1])});if(!c.columns){if(c.initialConfig.hideHeaders===undefined){c.hideHeaders=true}c.addCls(Ext.baseCSSPrefix+"autowidth-table");c.columns=[{xtype:"treecolumn",text:"Name",width:Ext.isIE6?null:10000,dataIndex:c.displayField}]}if(c.cls){b.push(c.cls)}c.cls=b.join(" ");c.callParent();a=c.getView();c.relayEvents(a,["checkchange","afteritemexpand","afteritemcollapse"]);if(!a.rootVisible&&!c.getRootNode()){c.setRootNode({expanded:true})}},onClear:function(){this.view.onClear()},setRootNode:function(){return this.store.setRootNode.apply(this.store,arguments)},getRootNode:function(){return this.store.getRootNode()},onRootChange:function(a){this.view.setRootNode(a)},getChecked:function(){return this.getView().getChecked()},isItemChecked:function(a){return a.get("checked")},expandAll:function(e,d){var b=this.getRootNode(),c=this.enableAnimations,a=this.getView();if(b){if(!c){a.beginBulkUpdate()}b.expand(true,e,d);if(!c){a.endBulkUpdate()}}},collapseAll:function(e,d){var b=this.getRootNode(),c=this.enableAnimations,a=this.getView();if(b){if(!c){a.beginBulkUpdate()}if(a.rootVisible){b.collapse(true,e,d)}else{b.collapseChildren(true,e,d)}if(!c){a.endBulkUpdate()}}},expandPath:function(k,f,a,g,j){var d=this,c=d.getRootNode(),b=1,e=d.getView(),i,h;f=f||d.getRootNode().idProperty;a=a||"/";if(Ext.isEmpty(k)){Ext.callback(g,j||d,[false,null]);return}i=k.split(a);if(c.get(f)!=i[1]){Ext.callback(g,j||d,[false,c]);return}h=function(){if(++b===i.length){Ext.callback(g,j||d,[true,c]);return}var l=c.findChild(f,i[b]);if(!l){Ext.callback(g,j||d,[false,c]);return}c=l;c.expand(false,h)};c.expand(false,h)},selectPath:function(g,f,e,h,a){var d=this,c,b;f=f||d.getRootNode().idProperty;e=e||"/";c=g.split(e);b=c.pop();d.expandPath(c.join(e),f,e,function(k,j){var i=false;if(k&&j){j=j.findChild(f,b);if(j){d.getSelectionModel().select(j);Ext.callback(h,a||d,[true,j]);i=true}}else{if(j===d.getRootNode()){i=true}}Ext.callback(h,a||d,[i,j])},d)}});