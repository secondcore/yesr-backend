Ext.Loader=new function(){var j=this,b=Ext.ClassManager,u=Ext.Class,e=Ext.Function.flexSetter,n=Ext.Function.alias,a=Ext.Function.pass,d=Ext.Function.defer,g=Ext.Array.erase,i=typeof window=="undefined",o=i&&(typeof require=="function"),k=i&&typeof system!="undefined"&&system.program.search(/jsdb/)!==-1,r=(typeof phantom!="undefined"&&phantom.fs),m=["extend","mixins","requires"],w={},l=[],c=/\/\.\//g,f=/\./g;Ext.apply(j,{isInHistory:w,history:l,config:{enabled:false,scriptChainDelay:false,disableCaching:true,disableCachingParam:"_dc",garbageCollect:false,paths:{Ext:"."},preserveScripts:true,scriptCharset:undefined},setConfig:function(z,A){if(Ext.isObject(z)&&arguments.length===1){Ext.merge(j.config,z)}else{j.config[z]=(Ext.isObject(A))?Ext.merge(j.config[z],A):A}return j},getConfig:function(z){if(z){return j.config[z]}return j.config},setPath:e(function(z,A){j.config.paths[z]=A;return j}),getPath:function(z){var B="",C=j.config.paths,A=j.getPrefix(z);if(A.length>0){if(A===z){return C[A]}B=C[A];z=z.substring(A.length+1)}if(B.length>0){B+="/"}return B.replace(c,"/")+z.replace(f,"/")+".js"},getPrefix:function(A){var C=j.config.paths,B,z="";if(C.hasOwnProperty(A)){return A}for(B in C){if(C.hasOwnProperty(B)&&B+"."===A.substring(0,B.length+1)){if(B.length>z.length){z=B}}}return z},isAClassNameWithAKnownPrefix:function(z){var A=j.getPrefix(z);return A!==""&&A!==z},require:function(B,A,z,C){if(A){A.call(z)}},syncRequire:function(){},exclude:function(z){return{require:function(C,B,A){return j.require(C,B,A,z)},syncRequire:function(C,B,A){return j.syncRequire(C,B,A,z)}}},onReady:function(C,B,D,z){var A;if(D!==false&&Ext.onDocumentReady){A=C;C=function(){Ext.onDocumentReady(A,B,z)}}C.call(B)}});var q=[],s={},v={},t={},p={},x=[],y=[],h={};Ext.apply(j,{documentHead:typeof document!="undefined"&&(document.head||document.getElementsByTagName("head")[0]),isLoading:false,queue:q,isClassFileLoaded:s,isFileLoaded:v,readyListeners:x,optionalRequires:y,requiresMap:h,numPendingFiles:0,numLoadedFiles:0,hasFileLoadError:false,classNameToFilePathMap:t,scriptsLoading:0,syncModeEnabled:false,scriptElements:p,refreshQueue:function(){var D=q.length,A,C,z,B;if(!D&&!j.scriptsLoading){return j.triggerReady()}for(A=0;A<D;A++){C=q[A];if(C){B=C.requires;if(B.length>j.numLoadedFiles){continue}for(z=0;z<B.length;){if(b.isCreated(B[z])){g(B,z,1)}else{z++}}if(C.requires.length===0){g(q,A,1);C.callback.call(C.scope);j.refreshQueue();break}}}return j},injectScriptElement:function(z,G,D,I,B){var H=document.createElement("script"),E=false,A=j.config,F=function(){if(!E){E=true;H.onload=H.onreadystatechange=H.onerror=null;if(typeof A.scriptChainDelay=="number"){d(G,A.scriptChainDelay,I)}else{G.call(I)}j.cleanupScriptElement(H,A.preserveScripts===false,A.garbageCollect)}},C=function(J){d(D,1,I);j.cleanupScriptElement(H,A.preserveScripts===false,A.garbageCollect)};H.type="text/javascript";H.onerror=C;B=B||A.scriptCharset;if(B){H.charset=B}if("addEventListener" in H){H.onload=F}else{if("readyState" in H){H.onreadystatechange=function(){if(this.readyState=="loaded"||this.readyState=="complete"){F()}}}else{H.onload=F}}H.src=z;(j.documentHead||document.getElementsByTagName("head")[0]).appendChild(H);return H},removeScriptElement:function(z){if(p[z]){j.cleanupScriptElement(p[z],true,!!j.getConfig("garbageCollect"));delete p[z]}return j},cleanupScriptElement:function(B,A,C){var D;B.onload=B.onreadystatechange=B.onerror=null;if(A){Ext.removeNode(B);if(C){for(D in B){try{B[D]=null;delete B[D]}catch(z){}}}}return j},loadScript:function(I){var C=j.getConfig(),B=typeof I=="string",A=B?I:I.url,E=!B&&I.onError,F=!B&&I.onLoad,H=!B&&I.scope,G=function(){j.numPendingFiles--;j.scriptsLoading--;if(E){E.call(H,"Failed loading '"+A+"', please verify that the file exists")}if(j.numPendingFiles+j.scriptsLoading===0){j.refreshQueue()}},D=function(){j.numPendingFiles--;j.scriptsLoading--;if(F){F.call(H)}if(j.numPendingFiles+j.scriptsLoading===0){j.refreshQueue()}},z;j.isLoading=true;j.numPendingFiles++;j.scriptsLoading++;z=C.disableCaching?(A+"?"+C.disableCachingParam+"="+Ext.Date.now()):A;p[A]=j.injectScriptElement(z,D,G)},loadScriptFile:function(A,G,E,J,z){if(v[A]){return j}var C=j.getConfig(),K=A+(C.disableCaching?("?"+C.disableCachingParam+"="+Ext.Date.now()):""),B=false,I,D,H;J=J||j;j.isLoading=true;if(!z){H=function(){E.call(J,"Failed loading '"+A+"', please verify that the file exists",z)};p[A]=j.injectScriptElement(K,G,H,J)}else{if(typeof XMLHttpRequest!="undefined"){I=new XMLHttpRequest()}else{I=new ActiveXObject("Microsoft.XMLHTTP")}try{I.open("GET",K,false);I.send(null)}catch(F){B=true}D=(I.status===1223)?204:(I.status===0&&(self.location||{}).protocol=="file:")?200:I.status;B=B||(D===0);if(B&&!r){E.call(j,"Failed loading synchronously via XHR: '"+A+"'; It's likely that the file is either being loaded from a different domain or from the local file system whereby cross origin requests are not allowed due to security reasons. Use asynchronous loading with Ext.require instead.",z)}else{if((D>=200&&D<300)||(D===304)||r){Ext.globalEval(I.responseText+"\n//@ sourceURL="+A);G.call(J)}else{E.call(j,"Failed loading synchronously via XHR: '"+A+"'; please verify that the file exists. XHR status code: "+D,z)}}I=null}},syncRequire:function(){var z=j.syncModeEnabled;if(!z){j.syncModeEnabled=true}j.require.apply(j,arguments);if(!z){j.syncModeEnabled=false}j.refreshQueue()},require:function(R,I,C,E){var K={},B={},H=[],T=[],Q=[],A=[],G,S,M,L,z,F,P,O,N,J,D;if(E){E=(typeof E==="string")?[E]:E;for(O=0,J=E.length;O<J;O++){z=E[O];if(typeof z=="string"&&z.length>0){H=b.getNamesByExpression(z);for(N=0,D=H.length;N<D;N++){K[H[N]]=true}}}}R=(typeof R==="string")?[R]:(R?R:[]);if(I){if(I.length>0){G=function(){var V=[],U,W;for(U=0,W=A.length;U<W;U++){V.push(b.get(A[U]))}return I.apply(this,V)}}else{G=I}}else{G=Ext.emptyFn}C=C||Ext.global;for(O=0,J=R.length;O<J;O++){L=R[O];if(typeof L=="string"&&L.length>0){T=b.getNamesByExpression(L);D=T.length;for(N=0;N<D;N++){P=T[N];if(K[P]!==true){A.push(P);if(!b.isCreated(P)&&!B[P]){B[P]=true;Q.push(P)}}}}}if(Q.length>0){if(!j.config.enabled){throw new Error("Ext.Loader is not enabled, so dependencies cannot be resolved dynamically. Missing required class"+((Q.length>1)?"es":"")+": "+Q.join(", "))}}else{G.call(C);return j}S=j.syncModeEnabled;if(!S){q.push({requires:Q.slice(),callback:G,scope:C})}J=Q.length;for(O=0;O<J;O++){F=Q[O];M=j.getPath(F);if(S&&s.hasOwnProperty(F)){j.numPendingFiles--;j.removeScriptElement(M);delete s[F]}if(!s.hasOwnProperty(F)){s[F]=false;t[F]=M;j.numPendingFiles++;j.loadScriptFile(M,a(j.onFileLoaded,[F,M],j),a(j.onFileLoadError,[F,M],j),j,S)}}if(S){G.call(C);if(J===1){return b.get(F)}}return j},onFileLoaded:function(F,A){j.numLoadedFiles++;s[F]=true;v[A]=true;j.numPendingFiles--;if(j.numPendingFiles===0){j.refreshQueue()}if(!j.syncModeEnabled&&j.numPendingFiles===0&&j.isLoading&&!j.hasFileLoadError){var H=[],z=[],G,C,E,B,D;for(C=0,E=q.length;C<E;C++){G=q[C].requires;for(B=0,D=G.length;B<D;B++){if(s[G[B]]){H.push(G[B])}}}if(H.length<1){return}H=Ext.Array.filter(Ext.Array.unique(H),function(I){return !h.hasOwnProperty(I)},j);for(C=0,E=H.length;C<E;C++){z.push(t[H[C]])}throw new Error("The following classes are not declared even if their files have been loaded: '"+H.join("', '")+"'. Please check the source code of their corresponding files for possible typos: '"+z.join("', '"))}},onFileLoadError:function(B,A,z,C){j.numPendingFiles--;j.hasFileLoadError=true;throw new Error("[Ext.Loader] "+z)},addUsedClasses:function(B){var z,A,C;if(B){B=(typeof B=="string")?[B]:B;for(A=0,C=B.length;A<C;A++){z=B[A];if(typeof z=="string"&&!Ext.Array.contains(y,z)){y.push(z)}}}return j},triggerReady:function(){var A,z,B=y;if(j.isLoading){j.isLoading=false;if(B.length!==0){B=B.slice();y.length=0;j.require(B,j.triggerReady,j);return j}}while(x.length&&!j.isLoading){A=x.shift();A.fn.call(A.scope)}return j},onReady:function(C,B,D,z){var A;if(D!==false&&Ext.onDocumentReady){A=C;C=function(){Ext.onDocumentReady(A,B,z)}}if(!j.isLoading){C.call(B)}else{x.push({fn:C,scope:B})}},historyPush:function(z){if(z&&s.hasOwnProperty(z)&&!w[z]){w[z]=true;l.push(z)}return j}});Ext.disableCacheBuster=function(A,B){var z=new Date();z.setTime(z.getTime()+(A?10*365:-1)*24*60*60*1000);z=z.toGMTString();document.cookie="ext-cache=1; expires="+z+"; path="+(B||"/")};if(i){if(o){Ext.apply(j,{syncModeEnabled:true,setPath:e(function(z,A){A=require("fs").realpathSync(A);j.config.paths[z]=A;return j}),loadScriptFile:function(A,C,D,B,z){require(A);C.call(B)}})}else{if(k){Ext.apply(j,{syncModeEnabled:true,loadScriptFile:function(A,C,D,B,z){load(A);C.call(B)}})}}}Ext.require=n(j,"require");Ext.syncRequire=n(j,"syncRequire");Ext.exclude=n(j,"exclude");Ext.onReady=function(B,A,z){j.onReady(B,A,true,z)};u.registerPreprocessor("loader",function(z,R,A,O){var Q=this,I=[],K,C=b.getName(z),N,M,G,D,L,J,P,B,H;for(N=0,G=m.length;N<G;N++){J=m[N];if(R.hasOwnProperty(J)){P=R[J];if(typeof P=="string"){I.push(P)}else{if(P instanceof Array){for(M=0,D=P.length;M<D;M++){L=P[M];if(typeof L=="string"){I.push(L)}}}else{if(typeof P!="function"){for(M in P){if(P.hasOwnProperty(M)){L=P[M];if(typeof L=="string"){I.push(L)}}}}}}}}if(I.length===0){return}var F=[],E;if(C){h[C]=I;B=j.requiredByMap||(j.requiredByMap={});for(N=0,G=I.length;N<G;N++){K=I[N];(B[K]||(B[K]=[])).push(C)}E=function(S){F.push(S);if(h[S]){if(Ext.Array.contains(h[S],C)){throw new Error("Deadlock detected while loading dependencies! '"+C+"' and '"+F[1]+"' mutually require each other. Path: "+F.join(" -> ")+" -> "+F[0])}for(N=0,G=h[S].length;N<G;N++){E(h[S][N])}}};E(C)}j.require(I,function(){for(N=0,G=m.length;N<G;N++){J=m[N];if(R.hasOwnProperty(J)){P=R[J];if(typeof P=="string"){R[J]=b.get(P)}else{if(P instanceof Array){for(M=0,D=P.length;M<D;M++){L=P[M];if(typeof L=="string"){R[J][M]=b.get(L)}}}else{if(typeof P!="function"){for(var S in P){if(P.hasOwnProperty(S)){L=P[S];if(typeof L=="string"){R[J][S]=b.get(L)}}}}}}}}O.call(Q,z,R,A)});return false},true,"after","className");b.registerPostprocessor("uses",function(B,A,C){var z=C.uses;if(z){j.addUsedClasses(z)}});b.onCreated(j.historyPush)};