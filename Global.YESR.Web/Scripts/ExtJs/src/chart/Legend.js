Ext.define("Ext.chart.Legend",{requires:["Ext.chart.LegendItem"],visible:true,update:true,position:"bottom",x:0,y:0,labelColor:"#000",labelFont:"12px Helvetica, sans-serif",boxStroke:"#000",boxStrokeWidth:1,boxFill:"#FFF",itemSpacing:10,padding:5,width:0,height:0,boxZIndex:100,constructor:function(a){var b=this;if(a){Ext.apply(b,a)}b.items=[];b.isVertical=("left|right|float".indexOf(b.position)!==-1);b.origX=b.x;b.origY=b.y},create:function(){var e=this,a=e.chart.series.items,c,d,b;e.createBox();if(e.rebuild!==false){e.createItems()}if(!e.created&&e.isDisplayed()){e.created=true;for(c=0,d=a.length;c<d;c++){b=a[c];b.on("titlechange",function(){e.create();e.updatePosition()})}}},isDisplayed:function(){return this.visible&&this.chart.series.findIndex("showInLegend",true)!==-1},createItems:function(){var G=this,r=G.chart,b=r.series.items,n,p,z=r.surface,t=G.items,q=G.padding,J=G.itemSpacing,l=2,D=0,w=0,g=0,F=0,d=G.isVertical,f=Math,e=f.floor,I=f.max,k=0,B=0,C=t?t.length:0,o,m,h,E,a,s,v,u,c,H,A;if(C){for(;B<C;B++){t[B].destroy()}}t.length=[];for(B=0,n=b.length;B<n;B++){p=b[B];if(p.showInLegend){u=[].concat(p.yField);for(A=0,H=u.length;A<H;A++){c=u[A];E=new Ext.chart.LegendItem({legend:this,series:p,surface:r.surface,yFieldIndex:A});a=E.getBBox();v=a.width;s=a.height;if(B+A===0){h=d?q+s/2:q}else{h=J/(d?2:1)}E.x=e(d?q:g+h);E.y=e(d?F+h:q+s/2);g+=v+h;F+=s+h;D=I(D,v);w=I(w,s);t.push(E)}}}G.width=e((d?D:g)+q*2);if(d&&t.length===1){l=1}G.height=e((d?F-l*h:w)+(q*2));G.itemHeight=w},getBBox:function(){var a=this;return{x:Math.round(a.x)-a.boxStrokeWidth/2,y:Math.round(a.y)-a.boxStrokeWidth/2,width:a.width,height:a.height}},createBox:function(){var b=this,a,c;if(b.boxSprite){b.boxSprite.destroy()}c=b.getBBox();if(isNaN(c.width)||isNaN(c.height)){b.boxSprite=false;return}a=b.boxSprite=b.chart.surface.add(Ext.apply({type:"rect",stroke:b.boxStroke,"stroke-width":b.boxStrokeWidth,fill:b.boxFill,zIndex:b.boxZIndex},c));a.redraw()},updatePosition:function(){var t=this,o=t.items,q,h,k,g,m=t.width||0,c=t.height||0,l=t.padding,n=t.chart,j=n.chartBBox,r=n.insetPadding,s=j.width-(r*2),d=j.height-(r*2),f=j.x+r,e=j.y+r,p=n.surface,b=Math.floor,a;if(t.isDisplayed()){switch(t.position){case"left":k=r;g=b(e+d/2-c/2);break;case"right":k=b(p.width-m)-r;g=b(e+d/2-c/2);break;case"top":k=b(f+s/2-m/2);g=r;break;case"bottom":k=b(f+s/2-m/2);g=b(p.height-c)-r;break;default:k=b(t.origX)+r;g=b(t.origY)+r}t.x=k;t.y=g;for(q=0,h=o.length;q<h;q++){o[q].updatePosition()}a=t.getBBox();if(isNaN(a.width)||isNaN(a.height)){if(t.boxSprite){t.boxSprite.hide(true)}}else{if(!t.boxSprite){t.createBox()}t.boxSprite.setAttributes(a,true);t.boxSprite.show(true)}}},toggle:function(b){var e=this,d=0,c=e.items,a=c.length;if(e.boxSprite){if(b){e.boxSprite.show(true)}else{e.boxSprite.hide(true)}}for(;d<a;++d){if(b){c[d].show(true)}else{c[d].hide(true)}}e.visible=b}});