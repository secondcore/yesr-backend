Ext.define("Ext.data.proxy.Proxy",{alias:"proxy.proxy",alternateClassName:["Ext.data.DataProxy","Ext.data.Proxy"],uses:["Ext.data.Batch","Ext.data.Operation","Ext.data.Model"],mixins:{observable:"Ext.util.Observable"},batchOrder:"create,update,destroy",batchActions:true,defaultReaderType:"json",defaultWriterType:"json",isProxy:true,constructor:function(a){a=a||{};if(a.model===undefined){delete a.model}Ext.apply(this,a);this.mixins.observable.constructor.call(this);if(this.model!==undefined&&!(this.model instanceof Ext.data.Model)){this.setModel(this.model)}},setModel:function(b,c){this.model=Ext.ModelManager.getModel(b);var a=this.reader,d=this.writer;this.setReader(a);this.setWriter(d);if(c&&this.store){this.store.setModel(this.model)}},getModel:function(){return this.model},setReader:function(a){var b=this;if(a===undefined||typeof a=="string"){a={type:a}}if(a.isReader){a.setModel(b.model)}else{Ext.applyIf(a,{proxy:b,model:b.model,type:b.defaultReaderType});a=Ext.createByAlias("reader."+a.type,a)}if(a.onMetaChange){a.onMetaChange=Ext.Function.createSequence(a.onMetaChange,this.onMetaChange,this)}b.reader=a;return b.reader},getReader:function(){return this.reader},onMetaChange:function(a){this.fireEvent("metachange",this,a)},setWriter:function(a){if(a===undefined||typeof a=="string"){a={type:a}}if(!a.isWriter){Ext.applyIf(a,{model:this.model,type:this.defaultWriterType});a=Ext.createByAlias("writer."+a.type,a)}this.writer=a;return this.writer},getWriter:function(){return this.writer},create:Ext.emptyFn,read:Ext.emptyFn,update:Ext.emptyFn,destroy:Ext.emptyFn,batch:function(n,k){var j=this,i=j.batchActions,g,c,f,d,e,l,b,m,h;if(n.operations===undefined){n={operations:n,listeners:k}}if(n.batch){if(Ext.isDefined(n.batch.runOperation)){g=Ext.applyIf(n.batch,{proxy:j,listeners:{}})}}else{n.batch={proxy:j,listeners:n.listeners||{}}}if(!g){g=new Ext.data.Batch(n.batch)}g.on("complete",Ext.bind(j.onBatchComplete,j,[n],0));f=j.batchOrder.split(",");d=f.length;for(l=0;l<d;l++){e=f[l];c=n.operations[e];if(c){if(i){g.add(new Ext.data.Operation({action:e,records:c}))}else{m=c.length;for(b=0;b<m;b++){h=c[b];g.add(new Ext.data.Operation({action:e,records:[h]}))}}}}g.start();return g},onBatchComplete:function(a,b){var c=a.scope||this;if(b.hasException){if(Ext.isFunction(a.failure)){Ext.callback(a.failure,c,[b,a])}}else{if(Ext.isFunction(a.success)){Ext.callback(a.success,c,[b,a])}}if(Ext.isFunction(a.callback)){Ext.callback(a.callback,c,[b,a])}}},function(){Ext.data.DataProxy=this});