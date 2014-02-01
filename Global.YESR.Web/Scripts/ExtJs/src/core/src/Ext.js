var Ext=Ext||{};Ext._startTime=new Date().getTime();(function(){var g=this,a=Object.prototype,h=a.toString,b=true,f={toString:1},e=function(){},d=function(){var i=d.caller.caller;return i.$owner.prototype[i.$name].apply(this,arguments)},c;Ext.global=g;for(c in f){b=null}if(b){b=["hasOwnProperty","valueOf","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","constructor"]}Ext.enumerables=b;Ext.apply=function(o,n,q){if(q){Ext.apply(o,q)}if(o&&n&&typeof n==="object"){var p,m,l;for(p in n){o[p]=n[p]}if(b){for(m=b.length;m--;){l=b[m];if(n.hasOwnProperty(l)){o[l]=n[l]}}}}return o};Ext.buildSettings=Ext.apply({baseCSSPrefix:"x-",scopeResetCSS:false},Ext.buildSettings||{});Ext.apply(Ext,{name:Ext.sandboxName||"Ext",emptyFn:e,emptyString:new String(),baseCSSPrefix:Ext.buildSettings.baseCSSPrefix,applyIf:function(j,i){var k;if(j){for(k in i){if(j[k]===undefined){j[k]=i[k]}}}return j},iterate:function(i,k,j){if(Ext.isEmpty(i)){return}if(j===undefined){j=i}if(Ext.isIterable(i)){Ext.Array.each.call(Ext.Array,i,k,j)}else{Ext.Object.each.call(Ext.Object,i,k,j)}}});Ext.apply(Ext,{extend:(function(){var i=a.constructor,j=function(l){for(var k in l){if(!l.hasOwnProperty(k)){continue}this[k]=l[k]}};return function(k,p,n){if(Ext.isObject(p)){n=p;p=k;k=n.constructor!==i?n.constructor:function(){p.apply(this,arguments)}}if(!p){Ext.Error.raise({sourceClass:"Ext",sourceMethod:"extend",msg:"Attempting to extend from a class which has not been loaded on the page."})}var m=function(){},l,o=p.prototype;m.prototype=o;l=k.prototype=new m();l.constructor=k;k.superclass=o;if(o.constructor===i){o.constructor=p}k.override=function(q){Ext.override(k,q)};l.override=j;l.proto=l;k.override(n);k.extend=function(q){return Ext.extend(k,q)};return k}}()),override:function(l,m){if(l.$isClass){l.override(m)}else{if(typeof l=="function"){Ext.apply(l.prototype,m)}else{var i=l.self,j,k;if(i&&i.$isClass){for(j in m){if(m.hasOwnProperty(j)){k=m[j];if(typeof k=="function"){if(i.$className){k.displayName=i.$className+"#"+j}k.$name=j;k.$owner=i;k.$previous=l.hasOwnProperty(j)?l[j]:d}l[j]=k}}}else{Ext.apply(l,m)}}}return l}});Ext.apply(Ext,{valueFrom:function(k,i,j){return Ext.isEmpty(k,j)?i:k},typeOf:function(j){var i,k;if(j===null){return"null"}i=typeof j;if(i==="undefined"||i==="string"||i==="number"||i==="boolean"){return i}k=h.call(j);switch(k){case"[object Array]":return"array";case"[object Date]":return"date";case"[object Boolean]":return"boolean";case"[object Number]":return"number";case"[object RegExp]":return"regexp"}if(i==="function"){return"function"}if(i==="object"){if(j.nodeType!==undefined){if(j.nodeType===3){return(/\S/).test(j.nodeValue)?"textnode":"whitespace"}else{return"element"}}return"object"}Ext.Error.raise({sourceClass:"Ext",sourceMethod:"typeOf",msg:'Failed to determine the type of the specified value "'+j+'". This is most likely a bug.'})},isEmpty:function(i,j){return(i===null)||(i===undefined)||(!j?i==="":false)||(Ext.isArray(i)&&i.length===0)},isArray:("isArray" in Array)?Array.isArray:function(i){return h.call(i)==="[object Array]"},isDate:function(i){return h.call(i)==="[object Date]"},isObject:(h.call(null)==="[object Object]")?function(i){return i!==null&&i!==undefined&&h.call(i)==="[object Object]"&&i.ownerDocument===undefined}:function(i){return h.call(i)==="[object Object]"},isSimpleObject:function(i){return i instanceof Object&&i.constructor===Object},isPrimitive:function(j){var i=typeof j;return i==="string"||i==="number"||i==="boolean"},isFunction:(typeof document!=="undefined"&&typeof document.getElementsByTagName("body")==="function")?function(i){return h.call(i)==="[object Function]"}:function(i){return typeof i==="function"},isNumber:function(i){return typeof i==="number"&&isFinite(i)},isNumeric:function(i){return !isNaN(parseFloat(i))&&isFinite(i)},isString:function(i){return typeof i==="string"},isBoolean:function(i){return typeof i==="boolean"},isElement:function(i){return i?i.nodeType===1:false},isTextNode:function(i){return i?i.nodeName==="#text":false},isDefined:function(i){return typeof i!=="undefined"},isIterable:function(j){var i=typeof j,k=false;if(j&&i!="string"){if(i=="function"){if(Ext.isSafari){k=j instanceof NodeList||j instanceof HTMLCollection}}else{k=true}}return k?j.length!==undefined:false}});Ext.apply(Ext,{clone:function(q){var p,o,m,l,r,n;if(q===null||q===undefined){return q}if(q.nodeType&&q.cloneNode){return q.cloneNode(true)}p=h.call(q);if(p==="[object Date]"){return new Date(q.getTime())}if(p==="[object Array]"){o=q.length;r=[];while(o--){r[o]=Ext.clone(q[o])}}else{if(p==="[object Object]"&&q.constructor===Object){r={};for(n in q){r[n]=Ext.clone(q[n])}if(b){for(m=b.length;m--;){l=b[m];r[l]=q[l]}}}}return r||q},getUniqueGlobalNamespace:function(){var k=this.uniqueGlobalNamespace,j;if(k===undefined){j=0;do{k="ExtBox"+(++j)}while(Ext.global[k]!==undefined);Ext.global[k]=Ext;this.uniqueGlobalNamespace=k}return k},functionFactoryCache:{},cacheableFunctionFactory:function(){var n=this,k=Array.prototype.slice.call(arguments),j=n.functionFactoryCache,i,l,m;if(Ext.isSandboxed){m=k.length;if(m>0){m--;k[m]="var Ext=window."+Ext.name+";"+k[m]}}i=k.join("");l=j[i];if(!l){l=Function.prototype.constructor.apply(Function.prototype,k);j[i]=l}return l},functionFactory:function(){var k=this,i=Array.prototype.slice.call(arguments),j;if(Ext.isSandboxed){j=i.length;if(j>0){j--;i[j]="var Ext=window."+Ext.name+";"+i[j]}}return Function.prototype.constructor.apply(Function.prototype,i)},Logger:{verbose:e,log:e,info:e,warn:e,error:function(i){throw new Error(i)},deprecate:e}});Ext.type=Ext.typeOf}());Ext.globalEval=Ext.global.execScript?function(a){execScript(a)}:function($$code){(function(){eval($$code)}())};