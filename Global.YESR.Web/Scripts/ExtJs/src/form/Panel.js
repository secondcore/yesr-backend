Ext.define("Ext.form.Panel",{extend:"Ext.panel.Panel",mixins:{fieldAncestor:"Ext.form.FieldAncestor"},alias:"widget.form",alternateClassName:["Ext.FormPanel","Ext.form.FormPanel"],requires:["Ext.form.Basic","Ext.util.TaskRunner"],layout:"anchor",ariaRole:"form",initComponent:function(){var a=this;if(a.frame){a.border=false}a.initFieldAncestor();a.callParent();a.relayEvents(a.form,["beforeaction","actionfailed","actioncomplete","validitychange","dirtychange"]);if(a.pollForChanges){a.startPolling(a.pollInterval||500)}},initItems:function(){var a=this;a.form=a.createForm();a.callParent()},afterFirstLayout:function(){this.callParent();this.form.initialize()},createForm:function(){return new Ext.form.Basic(this,Ext.applyIf({listeners:{}},this.initialConfig))},getForm:function(){return this.form},loadRecord:function(a){return this.getForm().loadRecord(a)},getRecord:function(){return this.getForm().getRecord()},getValues:function(d,b,c,a){return this.getForm().getValues(d,b,c,a)},beforeDestroy:function(){this.stopPolling();this.form.destroy();this.callParent()},load:function(a){this.form.load(a)},submit:function(a){this.form.submit(a)},startPolling:function(b){this.stopPolling();var a=new Ext.util.TaskRunner(b);a.start({interval:0,run:this.checkChange,scope:this});this.pollTask=a},stopPolling:function(){var a=this.pollTask;if(a){a.stopAll();delete this.pollTask}},checkChange:function(){var a=this.form.getFields().items,b,d=a.length,c;for(b=0;b<d;b++){a[b].checkChange()}}});