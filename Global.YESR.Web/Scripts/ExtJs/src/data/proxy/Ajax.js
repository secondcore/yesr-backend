Ext.define("Ext.data.proxy.Ajax",{requires:["Ext.util.MixedCollection","Ext.Ajax"],extend:"Ext.data.proxy.Server",alias:"proxy.ajax",alternateClassName:["Ext.data.HttpProxy","Ext.data.AjaxProxy"],actionMethods:{create:"POST",read:"GET",update:"POST",destroy:"POST"},doRequest:function(a,e,b){var d=this.getWriter(),c=this.buildRequest(a,e,b);if(a.allowWrite()){c=d.write(c)}Ext.apply(c,{headers:this.headers,timeout:this.timeout,scope:this,callback:this.createRequestCallback(c,a,e,b),method:this.getMethod(c),disableCaching:false});Ext.Ajax.request(c);return c},getMethod:function(a){return this.actionMethods[a.action]},createRequestCallback:function(d,a,e,b){var c=this;return function(g,h,f){c.processResponse(h,a,d,f,e,b)}}},function(){Ext.data.HttpProxy=this});