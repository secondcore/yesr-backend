Ext.JSON=(new (function(){var me=this,encodingFunction,decodingFunction,useNative=null,useHasOwn=!!{}.hasOwnProperty,isNative=function(){if(useNative===null){useNative=Ext.USE_NATIVE_JSON&&window.JSON&&JSON.toString()=="[object JSON]"}return useNative},pad=function(n){return n<10?"0"+n:n},doDecode=function(json){return eval("("+json+")")},doEncode=function(o,newline){if(o===null||o===undefined){return"null"}else{if(Ext.isDate(o)){return Ext.JSON.encodeDate(o)}else{if(Ext.isString(o)){return encodeString(o)}else{if(typeof o=="number"){return isFinite(o)?String(o):"null"}else{if(Ext.isBoolean(o)){return String(o)}else{if(o.toJSON){return o.toJSON()}else{if(Ext.isArray(o)){return encodeArray(o,newline)}else{if(Ext.isObject(o)){return encodeObject(o,newline)}else{if(typeof o==="function"){return"null"}}}}}}}}}return"undefined"},m={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\","\x0b":"\\u000b"},charToReplace=/[\\\"\x00-\x1f\x7f-\uffff]/g,encodeString=function(s){return'"'+s.replace(charToReplace,function(a){var c=m[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"'},encodeArrayPretty=function(o,newline){var len=o.length,cnewline=newline+"   ",sep=","+cnewline,a=["[",cnewline],i;for(i=0;i<len;i+=1){a.push(doEncode(o[i],cnewline),sep)}a[a.length-1]=newline+"]";return a.join("")},encodeObjectPretty=function(o,newline){var cnewline=newline+"   ",sep=","+cnewline,a=["{",cnewline],i;for(i in o){if(!useHasOwn||o.hasOwnProperty(i)){a.push(doEncode(i)+": "+doEncode(o[i],cnewline),sep)}}a[a.length-1]=newline+"}";return a.join("")},encodeArray=function(o,newline){if(newline){return encodeArrayPretty(o,newline)}var a=["[",""],len=o.length,i;for(i=0;i<len;i+=1){a.push(doEncode(o[i]),",")}a[a.length-1]="]";return a.join("")},encodeObject=function(o,newline){if(newline){return encodeObjectPretty(o,newline)}var a=["{",""],i;for(i in o){if(!useHasOwn||o.hasOwnProperty(i)){a.push(doEncode(i),":",doEncode(o[i]),",")}}a[a.length-1]="}";return a.join("")};me.encodeValue=doEncode;me.encodeDate=function(o){return'"'+o.getFullYear()+"-"+pad(o.getMonth()+1)+"-"+pad(o.getDate())+"T"+pad(o.getHours())+":"+pad(o.getMinutes())+":"+pad(o.getSeconds())+'"'};me.encode=function(o){if(!encodingFunction){encodingFunction=isNative()?JSON.stringify:me.encodeValue}return encodingFunction(o)};me.decode=function(json,safe){if(!decodingFunction){decodingFunction=isNative()?JSON.parse:doDecode}try{return decodingFunction(json)}catch(e){if(safe===true){return null}Ext.Error.raise({sourceClass:"Ext.JSON",sourceMethod:"decode",msg:"You're trying to decode an invalid JSON String: "+json})}}})());Ext.encode=Ext.JSON.encode;Ext.decode=Ext.JSON.decode;