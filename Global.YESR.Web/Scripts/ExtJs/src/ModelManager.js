Ext.define("Ext.ModelManager",{extend:"Ext.AbstractManager",alternateClassName:"Ext.ModelMgr",requires:["Ext.data.association.Association"],singleton:true,typeName:"mtype",associationStack:[],registerType:function(c,b){var d=b.prototype,a;if(d&&d.isModel){a=b}else{if(!b.extend){b.extend="Ext.data.Model"}a=Ext.define(c,b)}this.types[c]=a;return a},onModelDefined:function(c){var a=this.associationStack,f=a.length,e=[],b,d,g;for(d=0;d<f;d++){b=a[d];if(b.associatedModel==c.modelName){e.push(b)}}for(d=0,f=e.length;d<f;d++){g=e[d];this.types[g.ownerModel].prototype.associations.add(Ext.data.association.Association.create(g));Ext.Array.remove(a,g)}},registerDeferredAssociation:function(a){this.associationStack.push(a)},getModel:function(b){var a=b;if(typeof a=="string"){a=this.types[a]}return a},create:function(b,a,d){var c=typeof a=="function"?a:this.types[a||b.name];return new c(b,d)}},function(){Ext.regModel=function(){if(Ext.isDefined(Ext.global.console)){Ext.global.console.warn('Ext.regModel has been deprecated. Models can now be created by extending Ext.data.Model: Ext.define("MyModel", {extend: "Ext.data.Model", fields: []});.')}return this.ModelManager.registerType.apply(this.ModelManager,arguments)}});