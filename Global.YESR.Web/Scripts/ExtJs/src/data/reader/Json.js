Ext.define("Ext.data.reader.Json",{extend:"Ext.data.reader.Reader",alternateClassName:"Ext.data.JsonReader",alias:"reader.json",root:"",useSimpleAccessors:false,readRecords:function(a){if(a.metaData){this.onMetaChange(a.metaData)}this.jsonData=a;return this.callParent([a])},getResponseData:function(a){var d,b;try{d=Ext.decode(a.responseText);return this.readRecords(d)}catch(c){b=new Ext.data.ResultSet({total:0,count:0,records:[],success:false,message:c.message});this.fireEvent("exception",this,a,b);Ext.Logger.warn("Unable to parse the JSON returned by the server");return b}},buildExtractors:function(){var a=this;a.callParent(arguments);if(a.root){a.getRoot=a.createAccessor(a.root)}else{a.getRoot=function(b){return b}}},extractData:function(a){var e=this.record,d=[],c,b;if(e){c=a.length;if(!c&&Ext.isObject(a)){c=1;a=[a]}for(b=0;b<c;b++){d[b]=a[b][e]}}else{d=a}return this.callParent([d])},createAccessor:(function(){var a=/[\[\.]/;return function(c){if(Ext.isEmpty(c)){return Ext.emptyFn}if(Ext.isFunction(c)){return c}if(this.useSimpleAccessors!==true){var b=String(c).search(a);if(b>=0){return Ext.functionFactory("obj","return obj"+(b>0?".":"")+c)}}return function(d){return d[c]}}}()),createFieldAccessExpression:(function(){var a=/[\[\.]/;return function(h,d,c){var e=this,f=(h.mapping!==null),g=f?h.mapping:h.name,b,i;if(typeof g==="function"){b=d+".mapping("+c+", this)"}else{if(this.useSimpleAccessors===true||((i=String(g).search(a))<0)){if(!f||isNaN(g)){g='"'+g+'"'}b=c+"["+g+"]"}else{b=c+(i>0?".":"")+g}}return b}}())});