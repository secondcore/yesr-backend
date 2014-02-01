Ext.define("Ext.draw.engine.SvgExporter",{singleton:true,statics:(function(){var d,e,c,h,i=function(j){d=j;e=d.length;c=d.width;h=d.height},f={path:function(m){var j=m.attr,q=j.path,l="",n,o,k;if(Ext.isArray(q[0])){k=q.length;for(o=0;o<k;o++){l+=q[o].join(" ")}}else{if(Ext.isArray(q)){l=q.join(" ")}else{l=q.replace(/,/g," ")}}n=b({d:l,fill:j.fill||"none",stroke:j.stroke,"fill-opacity":j.opacity,"stroke-width":j["stroke-width"],"stroke-opacity":j["stroke-opacity"],"z-index":j.zIndex,transform:m.matrix.toSvg()});return"<path "+n+"/>"},text:function(q){var n=q.attr,j=/(-?\d*\.?\d*){1}(em|ex|px|in|cm|mm|pt|pc|%)\s('*.*'*)/,m=j.exec(n.font),s=(m&&m[1])||"12",l=(m&&m[3])||"Arial",r=n.text,p=(Ext.isFF3_0||Ext.isFF3_5)?2:4,k="",o;q.getBBox();k+='<tspan x="'+(n.x||"")+'" dy="';k+=(s/p)+'">';k+=Ext.htmlEncode(r)+"</tspan>";o=b({x:n.x,y:n.y,"font-size":s,"font-family":l,"font-weight":n["font-weight"],"text-anchor":n["text-anchor"],fill:n.fill||"#000","fill-opacity":n.opacity,transform:q.matrix.toSvg()});return"<text "+o+">"+k+"</text>"},rect:function(k){var j=k.attr,l=b({x:j.x,y:j.y,rx:j.rx,ry:j.ry,width:j.width,height:j.height,fill:j.fill||"none","fill-opacity":j.opacity,stroke:j.stroke,"stroke-opacity":j["stroke-opacity"],"stroke-width":j["stroke-width"],transform:k.matrix&&k.matrix.toSvg()});return"<rect "+l+"/>"},circle:function(k){var j=k.attr,l=b({cx:j.x,cy:j.y,r:j.radius,fill:j.translation.fill||j.fill||"none","fill-opacity":j.opacity,stroke:j.stroke,"stroke-opacity":j["stroke-opacity"],"stroke-width":j["stroke-width"],transform:k.matrix.toSvg()});return"<circle "+l+" />"},image:function(k){var j=k.attr,l=b({x:j.x-(j.width/2>>0),y:j.y-(j.height/2>>0),width:j.width,height:j.height,"xlink:href":j.src,transform:k.matrix.toSvg()});return"<image "+l+" />"}},a=function(){var j='<?xml version="1.0" standalone="yes"?>';j+='<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';return j},g=function(){var t='<svg width="'+c+'px" height="'+h+'px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">',m="",E,C,s,n,D,G,w,u,q,v,y,l,H,r,B,z,F,A,p,o;s=d.items.items;C=s.length;D=function(K){var R=K.childNodes,O=R.length,N=0,L,M,k="",I,Q,J,P;for(;N<O;N++){I=R[N];Q=I.attributes;J=I.tagName;k+="<"+J;for(M=0,L=Q.length;M<L;M++){P=Q.item(M);k+=" "+P.name+'="'+P.value+'"'}k+=">";if(I.childNodes.length>0){k+=D(I)}k+="</"+J+">"}return k};if(d.getDefs){m=D(d.getDefs())}else{u=d.gradientsColl;if(u){q=u.keys;v=u.items;y=0;l=q.length}for(;y<l;y++){H=q[y];r=v[y];n=d.gradientsColl.getByKey(H);m+='<linearGradient id="'+H+'" x1="0" y1="0" x2="1" y2="1">';var x=n.colors.replace(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,"rgb($1|$2|$3)");x=x.replace(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,([\d\.]+)\)/g,"rgba($1|$2|$3|$4)");G=x.split(",");for(B=0,F=G.length;B<F;B++){w=G[B].split(" ");x=Ext.draw.Color.fromString(w[1].replace(/\|/g,","));m+='<stop offset="'+w[0]+'" stop-color="'+x.toString()+'" stop-opacity="1"></stop>'}m+="</linearGradient>"}}t+="<defs>"+m+"</defs>";t+=f.rect({attr:{width:"100%",height:"100%",fill:"#fff",stroke:"none",opacity:"0"}});A=new Array(C);for(B=0;B<C;B++){A[B]=B}A.sort(function(k,j){p=s[k].attr.zIndex||0;o=s[j].attr.zIndex||0;if(p==o){return k-j}return p-o});for(B=0;B<C;B++){E=s[A[B]];if(!E.attr.hidden){t+=f[E.type](E)}}t+="</svg>";return t},b=function(l){var k="",j;for(j in l){if(l.hasOwnProperty(j)&&l[j]!=null){k+=j+'="'+l[j]+'" '}}return k};return{generate:function(k,j){i(j);return a()+g()}}}())});