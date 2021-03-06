Ext.define("Ext.chart.axis.Axis",{extend:"Ext.chart.axis.Abstract",alternateClassName:"Ext.chart.Axis",requires:["Ext.draw.Draw"],forceMinMax:false,dashSize:3,position:"bottom",skipFirst:false,length:0,width:0,adjustEnd:true,majorTickSteps:false,applyData:Ext.emptyFn,getRange:function(){var B=this,o=B.chart,h=o.getChartStore(),D=h.data.items,n=o.series.items,C=B.position,p,a=Ext.chart.series,u=[],t=Infinity,x=-Infinity,c=B.position==="left"||B.position==="right",y,m,d,w,v,l=D.length,f,A={},s={},z=true,q,g,e,b,r;q=B.fields;for(w=0,m=q.length;w<m;w++){s[q[w]]=true}for(y=0,m=n.length;y<m;y++){if(n[y].seriesIsHidden){continue}if(!n[y].getAxesForXAndYFields){continue}p=n[y].getAxesForXAndYFields();if(p.xAxis&&p.xAxis!==C&&p.yAxis&&p.yAxis!==C){continue}if(a.Bar&&n[y] instanceof a.Bar&&!n[y].column){q=c?Ext.Array.from(n[y].xField):Ext.Array.from(n[y].yField)}else{q=c?Ext.Array.from(n[y].yField):Ext.Array.from(n[y].xField)}if(B.fields.length){for(w=0,d=q.length;w<d;w++){if(s[q[w]]){break}}if(w==d){continue}}if(f=n[y].stacked){if(a.Bar&&n[y] instanceof a.Bar){if(n[y].column!=c){f=false;z=false}}else{if(!c){f=false;z=false}}}if(f){g={};for(w=0;w<q.length;w++){if(z&&n[y].__excludes&&n[y].__excludes[w]){continue}if(!s[q[w]]){Ext.Logger.warn("Field `"+q[w]+"` is not included in the "+C+" axis config.")}s[q[w]]=g[q[w]]=true}u.push({fields:g,value:0})}else{if(!q||q.length==0){q=B.fields}for(w=0;w<q.length;w++){if(z&&n[y].__excludes&&n[y].__excludes[w]){continue}s[q[w]]=A[q[w]]=true}}}for(y=0;y<l;y++){e=D[y];for(v=0;v<u.length;v++){u[v].value=0}for(b in s){r=e.get(b);if(isNaN(r)){continue}if(r===undefined){r=0}if(A[b]){if(t>r){t=r}if(x<r){x=r}}for(v=0;v<u.length;v++){if(u[v].fields[b]){u[v].value+=r;if(t>0){t=0}if(x<u[v].value){x=u[v].value}}}}}if(!isFinite(x)){x=B.prevMax||0}if(!isFinite(t)){t=B.prevMin||0}if(t!=x&&(x!=Math.floor(x))){x=Math.floor(x)+1}if(!isNaN(B.minimum)){t=B.minimum}if(!isNaN(B.maximum)){x=B.maximum}return{min:t,max:x}},calcEnds:function(){var h=this,b=h.fields,c=h.getRange(),g=c.min,a=c.max,e,f,d;d=Ext.draw.Draw.snapEnds(g,a,h.majorTickSteps!==false?(h.majorTickSteps+1):h.steps,(h.majorTickSteps===false));e=d.from;f=d.to;if(h.forceMinMax){if(!isNaN(a)){d.to=a}if(!isNaN(g)){d.from=g}}if(!isNaN(h.maximum)){d.to=h.maximum}if(!isNaN(h.minimum)){d.from=h.minimum}d.step=(d.to-d.from)/(f-e)*d.step;if(h.adjustMaximumByMajorUnit){d.to=Math.ceil(d.to/d.step)*d.step;d.steps=(d.to-d.from)/d.step}if(h.adjustMinimumByMajorUnit){d.from=Math.floor(d.from/d.step)*d.step;d.steps=(d.to-d.from)/d.step}h.prevMin=g==a?0:g;h.prevMax=a;return d},drawAxis:function(t){var E=this,u,s,h=E.x,g=E.y,C=E.chart.maxGutter[0],B=E.chart.maxGutter[1],e=E.dashSize,A=E.minorTickSteps||0,z=E.minorTickSteps||0,b=E.length,F=E.position,f=[],m=false,c=E.applyData(),d=c.step,v=c.steps,r=c.from,a=c.to,w,q,p,o,n,l,k,D;if(E.hidden||isNaN(d)||(r>a)){return}E.from=c.from;E.to=c.to;if(F=="left"||F=="right"){q=Math.floor(h)+0.5;o=["M",q,g,"l",0,-b];w=b-(B*2)}else{p=Math.floor(g)+0.5;o=["M",h,p,"l",b,0];w=b-(C*2)}D=v&&w/v;l=Math.max(A+1,0);k=Math.max(z+1,0);if(E.type=="Numeric"||E.type=="Time"){m=true;E.labels=[c.from]}if(F=="right"||F=="left"){p=g-B;q=h-((F=="left")*e*2);while(p>=g-B-w){o.push("M",q,Math.floor(p)+0.5,"l",e*2+1,0);if(p!=g-B){for(u=1;u<k;u++){o.push("M",q+e,Math.floor(p+D*u/k)+0.5,"l",e+1,0)}}f.push([Math.floor(h),Math.floor(p)]);p-=D;if(m){E.labels.push(E.labels[E.labels.length-1]+d)}if(D===0){break}}if(Math.round(p+D-(g-B-w))){o.push("M",q,Math.floor(g-b+B)+0.5,"l",e*2+1,0);for(u=1;u<k;u++){o.push("M",q+e,Math.floor(g-b+B+D*u/k)+0.5,"l",e+1,0)}f.push([Math.floor(h),Math.floor(p)]);if(m){E.labels.push(E.labels[E.labels.length-1]+d)}}}else{q=h+C;p=g-((F=="top")*e*2);while(q<=h+C+w){o.push("M",Math.floor(q)+0.5,p,"l",0,e*2+1);if(q!=h+C){for(u=1;u<l;u++){o.push("M",Math.floor(q-D*u/l)+0.5,p,"l",0,e+1)}}f.push([Math.floor(q),Math.floor(g)]);q+=D;if(m){E.labels.push(E.labels[E.labels.length-1]+d)}if(D===0){break}}if(Math.round(q-D-(h+C+w))){o.push("M",Math.floor(h+b-C)+0.5,p,"l",0,e*2+1);for(u=1;u<l;u++){o.push("M",Math.floor(h+b-C-D*u/l)+0.5,p,"l",0,e+1)}f.push([Math.floor(q),Math.floor(g)]);if(m){E.labels.push(E.labels[E.labels.length-1]+d)}}}if(m){E.labels[f.length-1]=+(E.labels[f.length-1]).toFixed(10)}if(!E.axis){E.axis=E.chart.surface.add(Ext.apply({type:"path",path:o},E.axisStyle))}E.axis.setAttributes({path:o},true);E.inflections=f;if(!t&&E.grid){E.drawGrid()}E.axisBBox=E.axis.getBBox();E.drawLabel()},drawGrid:function(){var t=this,n=t.chart.surface,b=t.grid,d=b.odd,e=b.even,g=t.inflections,j=g.length-((d||e)?0:1),u=t.position,c=t.chart.maxGutter,m=t.width-2,r=false,o,p,q=1,l=[],f,a,h,k=[],s=[];if((c[1]!==0&&(u=="left"||u=="right"))||(c[0]!==0&&(u=="top"||u=="bottom"))){q=0;j++}for(;q<j;q++){o=g[q];p=g[q-1];if(d||e){l=(q%2)?k:s;f=((q%2)?d:e)||{};a=(f.lineWidth||f["stroke-width"]||0)/2;h=2*a;if(u=="left"){l.push("M",p[0]+1+a,p[1]+0.5-a,"L",p[0]+1+m-a,p[1]+0.5-a,"L",o[0]+1+m-a,o[1]+0.5+a,"L",o[0]+1+a,o[1]+0.5+a,"Z")}else{if(u=="right"){l.push("M",p[0]-a,p[1]+0.5-a,"L",p[0]-m+a,p[1]+0.5-a,"L",o[0]-m+a,o[1]+0.5+a,"L",o[0]-a,o[1]+0.5+a,"Z")}else{if(u=="top"){l.push("M",p[0]+0.5+a,p[1]+1+a,"L",p[0]+0.5+a,p[1]+1+m-a,"L",o[0]+0.5-a,o[1]+1+m-a,"L",o[0]+0.5-a,o[1]+1+a,"Z")}else{l.push("M",p[0]+0.5+a,p[1]-a,"L",p[0]+0.5+a,p[1]-m+a,"L",o[0]+0.5-a,o[1]-m+a,"L",o[0]+0.5-a,o[1]-a,"Z")}}}}else{if(u=="left"){l=l.concat(["M",o[0]+0.5,o[1]+0.5,"l",m,0])}else{if(u=="right"){l=l.concat(["M",o[0]-0.5,o[1]+0.5,"l",-m,0])}else{if(u=="top"){l=l.concat(["M",o[0]+0.5,o[1]+0.5,"l",0,m])}else{l=l.concat(["M",o[0]+0.5,o[1]-0.5,"l",0,-m])}}}}}if(d||e){if(k.length){if(!t.gridOdd&&k.length){t.gridOdd=n.add({type:"path",path:k})}t.gridOdd.setAttributes(Ext.apply({path:k,hidden:false},d||{}),true)}if(s.length){if(!t.gridEven){t.gridEven=n.add({type:"path",path:s})}t.gridEven.setAttributes(Ext.apply({path:s,hidden:false},e||{}),true)}}else{if(l.length){if(!t.gridLines){t.gridLines=t.chart.surface.add({type:"path",path:l,"stroke-width":t.lineWidth||1,stroke:t.gridColor||"#ccc"})}t.gridLines.setAttributes({hidden:false,path:l},true)}else{if(t.gridLines){t.gridLines.hide(true)}}}},getOrCreateLabel:function(c,f){var d=this,b=d.labelGroup,e=b.getAt(c),a=d.chart.surface;if(e){if(f!=e.attr.text){e.setAttributes(Ext.apply({text:f},d.label),true);e._bbox=e.getBBox()}}else{e=a.add(Ext.apply({group:b,type:"text",x:0,y:0,text:f},d.label));a.renderItem(e);e._bbox=e.getBBox()}if(d.label.rotation){e.setAttributes({rotation:{degrees:0}},true);e._ubbox=e.getBBox();e.setAttributes(d.label,true)}else{e._ubbox=e._bbox}return e},rect2pointArray:function(k){var b=this.chart.surface,f=b.getBBox(k,true),l=[f.x,f.y],d=l.slice(),j=[f.x+f.width,f.y],a=j.slice(),i=[f.x+f.width,f.y+f.height],e=i.slice(),h=[f.x,f.y+f.height],c=h.slice(),g=k.matrix;l[0]=g.x.apply(g,d);l[1]=g.y.apply(g,d);j[0]=g.x.apply(g,a);j[1]=g.y.apply(g,a);i[0]=g.x.apply(g,e);i[1]=g.y.apply(g,e);h[0]=g.x.apply(g,c);h[1]=g.y.apply(g,c);return[l,j,i,h]},intersect:function(c,a){var d=this.rect2pointArray(c),b=this.rect2pointArray(a);return !!Ext.draw.Draw.intersect(d,b).length},drawHorizontalLabels:function(){var J=this,e=J.label,D=Math.floor,B=Math.max,C=J.chart.axes,h=J.chart.insetPadding,K=J.position,m=J.inflections,r=m.length,I=J.labels,u=J.labelGroup,v=0,j,F=J.chart.maxGutter[1],f,c,z,g,q,b,E=0,H=J.adjustEnd,a=C.findIndex("position","left")!=-1,p=C.findIndex("position","right")!=-1,G,w,l,t,k,o,s,n,A,d;o=r-1;z=m[0];d=J.getOrCreateLabel(0,J.label.renderer(I[0]));j=Math.floor(Math.abs(Math.sin(e.rotate&&(e.rotate.degrees*Math.PI/180)||0)));for(A=0;A<r;A++){z=m[A];t=J.label.renderer(I[A]);G=J.getOrCreateLabel(A,t);c=G._bbox;v=B(v,c.height+J.dashSize+J.label.padding);s=D(z[0]-(j?c.height:c.width)/2);if(H&&J.chart.maxGutter[0]==0){if(A==0&&!a){s=z[0]}else{if(A==o&&!p){s=Math.min(s,z[0]-c.width+h)}}}if(K=="top"){n=z[1]-(J.dashSize*2)-J.label.padding-(c.height/2)}else{n=z[1]+(J.dashSize*2)+J.label.padding+(c.height/2)}G.setAttributes({hidden:false,x:s,y:n},true);if(A!=0&&(J.intersect(G,q)||J.intersect(G,d))){if(A===o&&b!==0){q.hide(true)}else{G.hide(true);continue}}q=G;b=A}return v},drawVerticalLabels:function(){var G=this,h=G.inflections,H=G.position,l=h.length,q=G.chart,e=q.insetPadding,F=G.labels,z=0,u=Math.max,w=Math.floor,c=Math.ceil,v=G.chart.axes,C=G.chart.maxGutter[1],d,b,s,m,a,B=0,p=v.findIndex("position","top")!=-1,A=v.findIndex("position","bottom")!=-1,E=G.adjustEnd,D,r,g,o,f,k,n,j,t;k=l;for(t=0;t<k;t++){s=h[t];o=G.label.renderer(F[t]);D=G.getOrCreateLabel(t,o);b=D._bbox;z=u(z,b.width+G.dashSize+G.label.padding);j=s[1];if(E&&C<b.height/2){if(t==k-1&&!p){j=Math.max(j,G.y-G.length+c(b.height/2)-e)}else{if(t==0&&!A){j=G.y+C-w(b.height/2)}}}if(H=="left"){n=s[0]-b.width-G.dashSize-G.label.padding-2}else{n=s[0]+G.dashSize+G.label.padding+2}D.setAttributes(Ext.apply({hidden:false,x:n,y:j},G.label),true);if(t!=0&&G.intersect(D,m)){if(t===k-1&&a!==0){m.hide(true)}else{D.hide(true);continue}}m=D;a=t}return z},drawLabel:function(){var g=this,a=g.position,b=g.labelGroup,h=g.inflections,f=0,e=0,d,c;if(a=="left"||a=="right"){f=g.drawVerticalLabels()}else{e=g.drawHorizontalLabels()}d=b.getCount();c=h.length;for(;c<d;c++){b.getAt(c).hide(true)}g.bbox={};Ext.apply(g.bbox,g.axisBBox);g.bbox.height=e;g.bbox.width=f;if(Ext.isString(g.title)){g.drawTitle(f,e)}},elipsis:function(d,g,c,e,b){var f,a;if(c<e){d.hide(true);return false}while(g.length>4){g=g.substr(0,g.length-4)+"...";d.setAttributes({text:g},true);f=d.getBBox();if(f.width<c){if(typeof b=="number"){d.setAttributes({x:Math.floor(b-(f.width/2))},true)}break}}return true},setTitle:function(a){this.title=a;this.drawLabel()},drawTitle:function(k,l){var g=this,f=g.position,b=g.chart.surface,c=g.displaySprite,j=g.title,e=(f=="left"||f=="right"),i=g.x,h=g.y,a,m,d;if(c){c.setAttributes({text:j},true)}else{a={type:"text",x:0,y:0,text:j};c=g.displaySprite=b.add(Ext.apply(a,g.axisTitleStyle,g.labelTitle));b.renderItem(c)}m=c.getBBox();d=g.dashSize+g.label.padding;if(e){h-=((g.length/2)-(m.height/2));if(f=="left"){i-=(k+d+(m.width/2))}else{i+=(k+d+m.width-(m.width/2))}g.bbox.width+=m.width+10}else{i+=(g.length/2)-(m.width*0.5);if(f=="top"){h-=(l+d+(m.height*0.3))}else{h+=(l+d+(m.height*0.8))}g.bbox.height+=m.height+10}c.setAttributes({translate:{x:i,y:h}},true)}});