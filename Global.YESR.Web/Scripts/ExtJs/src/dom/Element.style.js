(function(){var o=Ext.dom.Element,l=document.defaultView,m=/table-row|table-.*-group/,a="_internal",q="hidden",n="height",f="width",e="isClipped",h="overflow",j="overflow-x",i="overflow-y",r="originalClip",b=/#document|body/i,s,d,p,g,t;if(!l||!l.getComputedStyle){o.prototype.getStyle=function(y,x){var K=this,F=K.dom,I=typeof y!="string",k=K.styleHooks,v=y,w=v,E=1,A=x,J,B,u,z,D,G,C;if(I){u={};v=w[0];C=0;if(!(E=w.length)){return u}}if(!F||F.documentElement){return u||""}B=F.style;if(x){G=B}else{G=F.currentStyle;if(!G){A=true;G=B}}do{z=k[v];if(!z){k[v]=z={name:o.normalize(v)}}if(z.get){D=z.get(F,K,A,G)}else{J=z.name;if(z.canThrow){try{D=G[J]}catch(H){D=""}}else{D=G?G[J]:""}}if(!I){return D}u[v]=D;v=w[++C]}while(C<E);return u}}o.override({getHeight:function(w,u){var v=this,y=v.dom,x=v.isStyle("display","none"),k,z;if(x){return 0}k=Math.max(y.offsetHeight,y.clientHeight)||0;if(Ext.supports.Direct2DBug){z=v.adjustDirect2DDimension(n);if(u){k+=z}else{if(z>0&&z<0.5){k++}}}if(w){k-=v.getBorderWidth("tb")+v.getPadding("tb")}return(k<0)?0:k},getWidth:function(k,y){var w=this,z=w.dom,x=w.isStyle("display","none"),v,u,A;if(x){return 0}if(Ext.supports.BoundingClientRect){v=z.getBoundingClientRect();u=v.right-v.left;u=y?u:Math.ceil(u)}else{u=z.offsetWidth}u=Math.max(u,z.clientWidth)||0;if(Ext.supports.Direct2DBug){A=w.adjustDirect2DDimension(f);if(y){u+=A}else{if(A>0&&A<0.5){u++}}}if(k){u-=w.getBorderWidth("lr")+w.getPadding("lr")}return(u<0)?0:u},setWidth:function(u,k){var v=this;u=v.adjustWidth(u);if(!k||!v.anim){v.dom.style.width=v.addUnits(u)}else{if(!Ext.isObject(k)){k={}}v.animate(Ext.applyIf({to:{width:u}},k))}return v},setHeight:function(k,u){var v=this;k=v.adjustHeight(k);if(!u||!v.anim){v.dom.style.height=v.addUnits(k)}else{if(!Ext.isObject(u)){u={}}v.animate(Ext.applyIf({to:{height:k}},u))}return v},applyStyles:function(k){Ext.DomHelper.applyStyles(this.dom,k);return this},setSize:function(v,k,u){var w=this;if(Ext.isObject(v)){u=k;k=v.height;v=v.width}v=w.adjustWidth(v);k=w.adjustHeight(k);if(!u||!w.anim){w.dom.style.width=w.addUnits(v);w.dom.style.height=w.addUnits(k)}else{if(u===true){u={}}w.animate(Ext.applyIf({to:{width:v,height:k}},u))}return w},getViewSize:function(){var v=this,w=v.dom,u=b.test(w.nodeName),k;if(u){k={width:o.getViewWidth(),height:o.getViewHeight()}}else{k={width:w.clientWidth,height:w.clientHeight}}return k},getSize:function(k){return{width:this.getWidth(k),height:this.getHeight(k)}},adjustWidth:function(k){var u=this,v=(typeof k=="number");if(v&&u.autoBoxAdjust&&!u.isBorderBox()){k-=(u.getBorderWidth("lr")+u.getPadding("lr"))}return(v&&k<0)?0:k},adjustHeight:function(k){var u=this,v=(typeof k=="number");if(v&&u.autoBoxAdjust&&!u.isBorderBox()){k-=(u.getBorderWidth("tb")+u.getPadding("tb"))}return(v&&k<0)?0:k},getColor:function(u,w,B){var y=this.getStyle(u),x=B||B===""?B:"#",A,k,z=0;if(!y||(/transparent|inherit/.test(y))){return w}if(/^r/.test(y)){y=y.slice(4,y.length-1).split(",");k=y.length;for(;z<k;z++){A=parseInt(y[z],10);x+=(A<16?"0":"")+A.toString(16)}}else{y=y.replace("#","");x+=y.length==3?y.replace(/^(\w)(\w)(\w)$/,"$1$1$2$2$3$3"):y}return(x.length>5?x.toLowerCase():w)},setOpacity:function(u,k){var v=this;if(!v.dom){return v}if(!k||!v.anim){v.setStyle("opacity",u)}else{if(typeof k!="object"){k={duration:350,easing:"ease-in"}}v.animate(Ext.applyIf({to:{opacity:u}},k))}return v},clearOpacity:function(){return this.setOpacity("")},adjustDirect2DDimension:function(v){var A=this,u=A.dom,y=A.getStyle("display"),x=u.style.display,B=u.style.position,z=v===f?0:1,k=u.currentStyle,w;if(y==="inline"){u.style.display="inline-block"}u.style.position=y.match(m)?"absolute":"static";w=(parseFloat(k[v])||parseFloat(k.msTransformOrigin.split(" ")[z])*2)%1;u.style.position=B;if(y==="inline"){u.style.display=x}return w},clip:function(){var u=this,v=(u.$cache||u.getCache()).data,k;if(!v[e]){v[e]=true;k=u.getStyle([h,j,i]);v[r]={o:k[h],x:k[j],y:k[i]};u.setStyle(h,q);u.setStyle(j,q);u.setStyle(i,q)}return u},unclip:function(){var u=this,v=(u.$cache||u.getCache()).data,k;if(v[e]){v[e]=false;k=v[r];if(k.o){u.setStyle(h,k.o)}if(k.x){u.setStyle(j,k.x)}if(k.y){u.setStyle(i,k.y)}}return u},boxWrap:function(k){k=k||Ext.baseCSSPrefix+"box";var u=Ext.get(this.insertHtml("beforeBegin","<div class='"+k+"'>"+Ext.String.format(o.boxMarkup,k)+"</div>"));Ext.DomQuery.selectNode("."+k+"-mc",u.dom).appendChild(this.dom);return u},getComputedHeight:function(){var u=this,k=Math.max(u.dom.offsetHeight,u.dom.clientHeight);if(!k){k=parseFloat(u.getStyle(n))||0;if(!u.isBorderBox()){k+=u.getFrameWidth("tb")}}return k},getComputedWidth:function(){var u=this,k=Math.max(u.dom.offsetWidth,u.dom.clientWidth);if(!k){k=parseFloat(u.getStyle(f))||0;if(!u.isBorderBox()){k+=u.getFrameWidth("lr")}}return k},getFrameWidth:function(u,k){return(k&&this.isBorderBox())?0:(this.getPadding(u)+this.getBorderWidth(u))},addClsOnOver:function(v,y,u){var w=this,x=w.dom,k=Ext.isFunction(y);w.hover(function(){if(k&&y.call(u||w,w)===false){return}Ext.fly(x,a).addCls(v)},function(){Ext.fly(x,a).removeCls(v)});return w},addClsOnFocus:function(v,y,u){var w=this,x=w.dom,k=Ext.isFunction(y);w.on("focus",function(){if(k&&y.call(u||w,w)===false){return false}Ext.fly(x,a).addCls(v)});w.on("blur",function(){Ext.fly(x,a).removeCls(v)});return w},addClsOnClick:function(v,y,u){var w=this,x=w.dom,k=Ext.isFunction(y);w.on("mousedown",function(){if(k&&y.call(u||w,w)===false){return false}Ext.fly(x,a).addCls(v);var A=Ext.getDoc(),z=function(){Ext.fly(x,a).removeCls(v);A.removeListener("mouseup",z)};A.on("mouseup",z)});return w},getStyleSize:function(){var y=this,z=this.dom,u=b.test(z.nodeName),x,k,v;if(u){return{width:o.getViewWidth(),height:o.getViewHeight()}}x=y.getStyle([n,f],true);if(x.width&&x.width!="auto"){k=parseFloat(x.width);if(y.isBorderBox()){k-=y.getFrameWidth("lr")}}if(x.height&&x.height!="auto"){v=parseFloat(x.height);if(y.isBorderBox()){v-=y.getFrameWidth("tb")}}return{width:k||y.getWidth(true),height:v||y.getHeight(true)}},selectable:function(){var k=this;k.dom.unselectable="off";k.on("selectstart",function(u){u.stopPropagation();return true});k.applyStyles("-moz-user-select: text; -khtml-user-select: text;");k.removeCls(Ext.baseCSSPrefix+"unselectable");return k},unselectable:function(){var k=this;k.dom.unselectable="on";k.swallowEvent("selectstart",true);k.applyStyles("-moz-user-select:-moz-none;-khtml-user-select:none;");k.addCls(Ext.baseCSSPrefix+"unselectable");return k}});o.prototype.styleHooks=s=Ext.dom.AbstractElement.prototype.styleHooks;if(Ext.isIE6){s.fontSize=s["font-size"]={name:"fontSize",canThrow:true}}if(Ext.isIEQuirks||Ext.isIE&&Ext.ieVersion<=8){function c(w,u,v,k){if(k[this.styleName]=="none"){return"0px"}return k[this.name]}d=["Top","Right","Bottom","Left"];p=d.length;while(p--){g=d[p];t="border"+g+"Width";s["border-"+g.toLowerCase()+"-width"]=s[t]={name:t,styleName:"border"+g+"Style",get:c}}}}());Ext.onReady(function(){var c=/alpha\(opacity=(.*)\)/i,b=/^\s+|\s+$/g,a=Ext.dom.Element.prototype.styleHooks;a.opacity={name:"opacity",afterSet:function(f,e,d){if(d.isLayer){d.onOpacitySet(e)}}};if(!Ext.supports.Opacity&&Ext.isIE){Ext.apply(a.opacity,{get:function(g){var f=g.style.filter,e,d;if(f.match){e=f.match(c);if(e){d=parseFloat(e[1]);if(!isNaN(d)){return d?d/100:0}}}return 1},set:function(g,e){var d=g.style,f=d.filter.replace(c,"").replace(b,"");d.zoom=1;if(typeof(e)=="number"&&e>=0&&e<1){e*=100;d.filter=f+(f.length?" ":"")+"alpha(opacity="+e+")"}else{d.filter=f}}})}});