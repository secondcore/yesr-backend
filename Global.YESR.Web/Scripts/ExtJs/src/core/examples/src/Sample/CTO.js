Ext.define("Sample.CTO",{extend:"Sample.Developer",statics:{averageIQ:140},constructor:function(a){this.callParent(arguments);this.isSuperGeek=true},hireNewDeveloperLike:function(a){return a.clone()},clone:function(){var b=this.statics(),a=new b(this.config);alert(Ext.getClassName(this.callParent()));return a}});