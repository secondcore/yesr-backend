Ext.define("Ext.chart.series.Line",{extend:"Ext.chart.series.Cartesian",alternateClassName:["Ext.chart.LineSeries","Ext.chart.LineChart"],requires:["Ext.chart.axis.Axis","Ext.chart.Shape","Ext.draw.Draw","Ext.fx.Anim"],type:"line",alias:"series.line",selectionTolerance:20,showMarkers:true,markerConfig:{},style:{},smooth:false,defaultSmoothness:3,fill:false,constructor:function(c){this.callParent(arguments);var e=this,a=e.chart.surface,f=e.chart.shadow,d,b;c.highlightCfg=Ext.Object.merge({"stroke-width":3},c.highlightCfg);Ext.apply(e,c,{shadowAttributes:[{"stroke-width":6,"stroke-opacity":0.05,stroke:"rgb(0, 0, 0)",translate:{x:1,y:1}},{"stroke-width":4,"stroke-opacity":0.1,stroke:"rgb(0, 0, 0)",translate:{x:1,y:1}},{"stroke-width":2,"stroke-opacity":0.15,stroke:"rgb(0, 0, 0)",translate:{x:1,y:1}}]});e.group=a.getGroup(e.seriesId);if(e.showMarkers){e.markerGroup=a.getGroup(e.seriesId+"-markers")}if(f){for(d=0,b=e.shadowAttributes.length;d<b;d++){e.shadowGroups.push(a.getGroup(e.seriesId+"-shadows"+d))}}},shrink:function(b,j,k){var g=b.length,h=Math.floor(g/k),f=1,d=0,a=0,e=[+b[0]],c=[+j[0]];for(;f<g;++f){d+=+b[f]||0;a+=+j[f]||0;if(f%h==0){e.push(d/h);c.push(a/h);d=0;a=0}}return{x:e,y:c}},drawSeries:function(){var am=this,az=am.chart,U=az.axes,au=az.getChartStore(),z=au.data.items,aq,X=au.getCount(),v=am.chart.surface,at={},T=am.group,M=am.showMarkers,aF=am.markerGroup,F=az.shadow,E=am.shadowGroups,aa=am.shadowAttributes,Q=am.smooth,q=E.length,ax=["M"],V=["M"],d=["M"],b=["M"],L=az.markerIndex,al=[].concat(am.axis),ak,aA=[],aj={},ad=[],w={},K=false,S=[],aE=am.markerStyle,ac=am.seriesStyle,u=am.colorArrayStyle,R=u&&u.length||0,N=Ext.isNumber,aB=am.seriesIdx,g=am.getAxesForXAndYFields(),l=g.xAxis,aD=g.yAxis,af,h,ae,ag,C,c,ah,J,I,f,e,t,r,Z,P,O,ay,m,H,G,aG,n,p,D,a,ab,ai,B,aw,A,av,o,aC,ar,ap,W,k,s,an,ao,Y;if(am.fireEvent("beforedraw",am)===false){return}if(!X||am.seriesIsHidden){am.hide();am.items=[];if(am.line){am.line.hide(true);if(am.line.shadows){af=am.line.shadows;for(O=0,q=af.length;O<q;O++){h=af[O];h.hide(true)}}if(am.fillPath){am.fillPath.hide(true)}}am.line=null;am.fillPath=null;return}ar=Ext.apply(aE||{},am.markerConfig,{fill:am.seriesStyle.fill||u[aB%u.length]});W=ar.type;delete ar.type;ap=ac;if(!ap["stroke-width"]){ap["stroke-width"]=0.5}s="opacity" in ap?ap.opacity:1;Y="opacity" in ap?ap.opacity:0.3;an="lineOpacity" in ap?ap.lineOpacity:s;ao="fillOpacity" in ap?ap.fillOpacity:Y;if(L&&aF&&aF.getCount()){for(P=0;P<L;P++){G=aF.getAt(P);aF.remove(G);aF.add(G);aG=aF.getAt(aF.getCount()-2);G.setAttributes({x:0,y:0,translate:{x:aG.attr.translation.x,y:aG.attr.translation.y}},true)}}am.unHighlightItem();am.cleanHighlights();am.setBBox();at=am.bbox;am.clipRect=[at.x,at.y,at.width,at.height];if(m=U.get(l)){H=m.applyData();B=H.from;aw=H.to}if(m=U.get(aD)){H=m.applyData();A=H.from;av=H.to}if(am.xField&&!Ext.isNumber(B)){m=am.getMinMaxXValues();B=m[0];aw=m[1]}if(am.yField&&!Ext.isNumber(A)){m=am.getMinMaxYValues();A=m[0];av=m[1]}if(isNaN(B)){B=0;ab=at.width/((X-1)||1)}else{ab=at.width/((aw-B)||(X-1)||1)}if(isNaN(A)){A=0;ai=at.height/((X-1)||1)}else{ai=at.height/((av-A)||(X-1)||1)}for(P=0,ay=z.length;P<ay;P++){aq=z[P];p=aq.get(am.xField);if(typeof p=="string"||typeof p=="object"&&!Ext.isDate(p)||l&&U.get(l)&&U.get(l).type=="Category"){if(p in aj){p=aj[p]}else{p=aj[p]=P}}D=aq.get(am.yField);if(typeof D=="undefined"||(typeof D=="string"&&!D)){if(Ext.isDefined(Ext.global.console)){Ext.global.console.warn("[Ext.chart.series.Line]  Skipping a store element with an undefined value at ",aq,p,D)}continue}if(typeof D=="string"||typeof D=="object"&&!Ext.isDate(D)||aD&&U.get(aD)&&U.get(aD).type=="Category"){D=P}S.push(P);aA.push(p);ad.push(D)}ay=aA.length;if(ay>at.width){a=am.shrink(aA,ad,at.width);aA=a.x;ad=a.y}am.items=[];k=0;ay=aA.length;for(P=0;P<ay;P++){p=aA[P];D=ad[P];if(D===false){if(V.length==1){V=[]}K=true;am.items.push(false);continue}else{J=(at.x+(p-B)*ab).toFixed(2);I=((at.y+at.height)-(D-A)*ai).toFixed(2);if(K){K=false;V.push("M")}V=V.concat([J,I])}if((typeof r=="undefined")&&(typeof I!="undefined")){r=I;t=J}if(!am.line||az.resizing){ax=ax.concat([J,at.y+at.height/2])}if(az.animate&&az.resizing&&am.line){am.line.setAttributes({path:ax,opacity:an},true);if(am.fillPath){am.fillPath.setAttributes({path:ax,opacity:ao},true)}if(am.line.shadows){af=am.line.shadows;for(O=0,q=af.length;O<q;O++){h=af[O];h.setAttributes({path:ax},true)}}}if(M){G=aF.getAt(k++);if(!G){G=Ext.chart.Shape[W](v,Ext.apply({group:[T,aF],x:0,y:0,translate:{x:+(f||J),y:e||(at.y+at.height/2)},value:'"'+p+", "+D+'"',zIndex:4000},ar));G._to={translate:{x:+J,y:+I}}}else{G.setAttributes({value:'"'+p+", "+D+'"',x:0,y:0,hidden:false},true);G._to={translate:{x:+J,y:+I}}}}am.items.push({series:am,value:[p,D],point:[J,I],sprite:G,storeItem:au.getAt(S[P])});f=J;e=I}if(V.length<=1){return}if(am.smooth){b=Ext.draw.Draw.smooth(V,N(Q)?Q:am.defaultSmoothness)}d=Q?b:V;if(az.markerIndex&&am.previousPath){ag=am.previousPath;if(!Q){Ext.Array.erase(ag,1,2)}}else{ag=V}if(!am.line){am.line=v.add(Ext.apply({type:"path",group:T,path:ax,stroke:ap.stroke||ap.fill},ap||{}));am.line.setAttributes({opacity:an},true);if(F){am.line.setAttributes(Ext.apply({},am.shadowOptions),true)}am.line.setAttributes({fill:"none",zIndex:3000});if(!ap.stroke&&R){am.line.setAttributes({stroke:u[aB%R]},true)}if(F){af=am.line.shadows=[];for(ae=0;ae<q;ae++){ak=aa[ae];ak=Ext.apply({},ak,{path:ax});h=v.add(Ext.apply({},{type:"path",group:E[ae]},ak));af.push(h)}}}if(am.fill){c=d.concat([["L",J,at.y+at.height],["L",t,at.y+at.height],["L",t,r]]);if(!am.fillPath){am.fillPath=v.add({group:T,type:"path",fill:ap.fill||u[aB%R],path:ax})}}Z=M&&aF.getCount();if(az.animate){C=am.fill;o=am.line;ah=am.renderer(o,false,{path:d},P,au);Ext.apply(ah,ap||{},{stroke:ap.stroke||ap.fill});delete ah.fill;o.show(true);if(az.markerIndex&&am.previousPath){am.animation=aC=am.onAnimate(o,{to:ah,from:{path:ag}})}else{am.animation=aC=am.onAnimate(o,{to:ah})}if(F){af=o.shadows;for(O=0;O<q;O++){af[O].show(true);if(az.markerIndex&&am.previousPath){am.onAnimate(af[O],{to:{path:d},from:{path:ag}})}else{am.onAnimate(af[O],{to:{path:d}})}}}if(C){am.fillPath.show(true);am.onAnimate(am.fillPath,{to:Ext.apply({},{path:c,fill:ap.fill||u[aB%R],"stroke-width":0,opacity:ao},ap||{})})}if(M){k=0;for(P=0;P<ay;P++){if(am.items[P]){n=aF.getAt(k++);if(n){ah=am.renderer(n,au.getAt(P),n._to,P,au);am.onAnimate(n,{to:Ext.apply(ah,ar||{})});n.show(true)}}}for(;k<Z;k++){n=aF.getAt(k);n.hide(true)}}}else{ah=am.renderer(am.line,false,{path:d,hidden:false},P,au);Ext.apply(ah,ap||{},{stroke:ap.stroke||ap.fill});delete ah.fill;am.line.setAttributes(ah,true);am.line.setAttributes({opacity:an},true);if(F){af=am.line.shadows;for(O=0;O<q;O++){af[O].setAttributes({path:d,hidden:false},true)}}if(am.fill){am.fillPath.setAttributes({path:c,hidden:false,opacity:ao},true)}if(M){k=0;for(P=0;P<ay;P++){if(am.items[P]){n=aF.getAt(k++);if(n){ah=am.renderer(n,au.getAt(P),n._to,P,au);n.setAttributes(Ext.apply(ar||{},ah||{}),true);if(!n.attr.hidden){n.show(true)}}}}for(;k<Z;k++){n=aF.getAt(k);n.hide(true)}}}if(az.markerIndex){if(am.smooth){Ext.Array.erase(V,1,2)}else{Ext.Array.splice(V,1,0,V[1],V[2])}am.previousPath=V}am.renderLabels();am.renderCallouts();am.fireEvent("draw",am)},onCreateLabel:function(d,j,c,e){var f=this,g=f.labelsGroup,a=f.label,h=f.bbox,b=Ext.apply(a,f.seriesLabelStyle);return f.chart.surface.add(Ext.apply({type:"text","text-anchor":"middle",group:g,x:j.point[0],y:h.y+h.height/2},b||{}))},onPlaceLabel:function(f,j,r,o,n,d){var t=this,k=t.chart,q=k.resizing,s=t.label,p=s.renderer,b=s.field,a=t.bbox,h=r.point[0],g=r.point[1],c=r.sprite.attr.radius,e,m,l;f.setAttributes({text:p(j.get(b)),hidden:true},true);if(n=="rotate"){f.setAttributes({"text-anchor":"start",rotation:{x:h,y:g,degrees:-45}},true);e=f.getBBox();m=e.width;l=e.height;h=h<a.x?a.x:h;h=(h+m>a.x+a.width)?(h-(h+m-a.x-a.width)):h;g=(g-l<a.y)?a.y+l:g}else{if(n=="under"||n=="over"){e=r.sprite.getBBox();e.width=e.width||(c*2);e.height=e.height||(c*2);g=g+(n=="over"?-e.height:e.height);e=f.getBBox();m=e.width/2;l=e.height/2;h=h-m<a.x?a.x+m:h;h=(h+m>a.x+a.width)?(h-(h+m-a.x-a.width)):h;g=g-l<a.y?a.y+l:g;g=(g+l>a.y+a.height)?(g-(g+l-a.y-a.height)):g}}if(t.chart.animate&&!t.chart.resizing){f.show(true);t.onAnimate(f,{to:{x:h,y:g}})}else{f.setAttributes({x:h,y:g},true);if(q&&t.animation){t.animation.on("afteranimate",function(){f.show(true)})}else{f.show(true)}}},highlightItem:function(){var a=this;a.callParent(arguments);if(a.line&&!a.highlighted){if(!("__strokeWidth" in a.line)){a.line.__strokeWidth=parseFloat(a.line.attr["stroke-width"])||0}if(a.line.__anim){a.line.__anim.paused=true}a.line.__anim=Ext.create("Ext.fx.Anim",{target:a.line,to:{"stroke-width":a.line.__strokeWidth+3}});a.highlighted=true}},unHighlightItem:function(){var a=this;a.callParent(arguments);if(a.line&&a.highlighted){a.line.__anim=Ext.create("Ext.fx.Anim",{target:a.line,to:{"stroke-width":a.line.__strokeWidth}});a.highlighted=false}},onPlaceCallout:function(l,q,I,F,E,d,j){if(!E){return}var L=this,r=L.chart,C=r.surface,G=r.resizing,K=L.callouts,s=L.items,u=F==0?false:s[F-1].point,w=(F==s.length-1)?false:s[F+1].point,c=[+I.point[0],+I.point[1]],z,f,M,J,n,o,H=K.offsetFromViz||30,B=K.offsetToSide||10,A=K.offsetBox||3,g,e,h,v,t,D=L.clipRect,b={width:K.styles.width||10,height:K.styles.height||10},m,k;if(!u){u=c}if(!w){w=c}J=(w[1]-u[1])/(w[0]-u[0]);n=(c[1]-u[1])/(c[0]-u[0]);o=(w[1]-c[1])/(w[0]-c[0]);f=Math.sqrt(1+J*J);z=[1/f,J/f];M=[-z[1],z[0]];if(n>0&&o<0&&M[1]<0||n<0&&o>0&&M[1]>0){M[0]*=-1;M[1]*=-1}else{if(Math.abs(n)<Math.abs(o)&&M[0]<0||Math.abs(n)>Math.abs(o)&&M[0]>0){M[0]*=-1;M[1]*=-1}}m=c[0]+M[0]*H;k=c[1]+M[1]*H;g=m+(M[0]>0?0:-(b.width+2*A));e=k-b.height/2-A;h=b.width+2*A;v=b.height+2*A;if(g<D[0]||(g+h)>(D[0]+D[2])){M[0]*=-1}if(e<D[1]||(e+v)>(D[1]+D[3])){M[1]*=-1}m=c[0]+M[0]*H;k=c[1]+M[1]*H;g=m+(M[0]>0?0:-(b.width+2*A));e=k-b.height/2-A;h=b.width+2*A;v=b.height+2*A;if(r.animate){L.onAnimate(l.lines,{to:{path:["M",c[0],c[1],"L",m,k,"Z"]}});if(l.panel){l.panel.setPosition(g,e,true)}}else{l.lines.setAttributes({path:["M",c[0],c[1],"L",m,k,"Z"]},true);if(l.panel){l.panel.setPosition(g,e)}}for(t in l){l[t].show(true)}},isItemInPoint:function(h,f,z,p){var B=this,m=B.items,r=B.selectionTolerance,j=null,w,c,o,u,g,v,b,s,a,k,A,e,d,n,t,q,C=Math.sqrt,l=Math.abs;c=m[p];w=p&&m[p-1];if(p>=g){w=m[g-1]}o=w&&w.point;u=c&&c.point;v=w?o[0]:u[0]-r;b=w?o[1]:u[1];s=c?u[0]:o[0]+r;a=c?u[1]:o[1];e=C((h-v)*(h-v)+(f-b)*(f-b));d=C((h-s)*(h-s)+(f-a)*(f-a));n=Math.min(e,d);if(n<=r){return n==e?w:c}return false},toggleAll:function(a){var e=this,b,d,f,c;if(!a){Ext.chart.series.Cartesian.prototype.hideAll.call(e)}else{Ext.chart.series.Cartesian.prototype.showAll.call(e)}if(e.line){e.line.setAttributes({hidden:!a},true);if(e.line.shadows){for(b=0,c=e.line.shadows,d=c.length;b<d;b++){f=c[b];f.setAttributes({hidden:!a},true)}}}if(e.fillPath){e.fillPath.setAttributes({hidden:!a},true)}},hideAll:function(){this.toggleAll(false)},showAll:function(){this.toggleAll(true)}});