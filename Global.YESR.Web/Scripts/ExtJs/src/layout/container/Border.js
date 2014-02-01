Ext.define("Ext.layout.container.Border",{alias:"layout.border",extend:"Ext.layout.container.Container",requires:["Ext.resizer.BorderSplitter","Ext.Component","Ext.fx.Anim"],alternateClassName:"Ext.layout.BorderLayout",targetCls:Ext.baseCSSPrefix+"border-layout-ct",itemCls:[Ext.baseCSSPrefix+"border-item",Ext.baseCSSPrefix+"box-item"],type:"border",padding:undefined,percentageRe:/(\d+)%/,axisProps:{horz:{borderBegin:"west",borderEnd:"east",horizontal:true,posProp:"x",sizeProp:"width",sizePropCap:"Width"},vert:{borderBegin:"north",borderEnd:"south",horizontal:false,posProp:"y",sizeProp:"height",sizePropCap:"Height"}},centerRegion:null,collapseDirections:{north:"top",south:"bottom",east:"right",west:"left"},manageMargins:true,panelCollapseAnimate:true,panelCollapseMode:"placeholder",regionWeights:{north:20,south:10,center:0,west:-10,east:-20},beginAxis:function(l,b,v){var t=this,c=t.axisProps[v],q=!c.horizontal,k=c.sizeProp,o=0,a=l.childItems,f=a.length,s,p,n,g,r,e,j,m,d,u,h;for(p=0;p<f;++p){n=a[p];r=n.target;n.layoutPos={};if(r.region){n.region=e=r.region;n.isCenter=r.isCenter;n.isHorz=r.isHorz;n.isVert=r.isVert;n.weight=r.weight||t.regionWeights[e]||0;b[r.id]=n;if(r.isCenter){s=n;g=r.flex;l.centerRegion=s;continue}if(q!==n.isVert){continue}n.reverseWeighting=(e==c.borderEnd);m=r[k];d=typeof m;if(!r.collapsed){if(d=="string"&&(j=t.percentageRe.exec(m))){n.percentage=parseInt(j[1],10)}else{if(r.flex){o+=n.flex=r.flex}}}}}if(s){u=s.target;if(h=u.placeholderFor){if(!g&&q===h.collapsedVertical()){g=0;s.collapseAxis=v}}else{if(u.collapsed&&(q===u.collapsedVertical())){g=0;s.collapseAxis=v}}}if(g==null){g=1}o+=g;return Ext.apply({before:q?"top":"left",totalFlex:o},c)},beginLayout:function(c){var h=this,g=h.getLayoutItems(),d=h.padding,j=typeof d,l=false,m,k,b,f,e,a;if(d){if(j=="string"||j=="number"){d=Ext.util.Format.parseBox(d)}}else{d=c.getEl("getTargetEl").getPaddingInfo();l=true}c.outerPad=d;c.padOnContainer=l;for(f=0,b=g.length;f<b;++f){k=g[f];a=h.getSplitterTarget(k);if(a&&k.hidden!==a.hidden){if(k.hidden){k.show()}else{k.hide()}}}h.callParent(arguments);g=c.childItems;b=g.length;e={};c.borderAxisHorz=h.beginAxis(c,e,"horz");c.borderAxisVert=h.beginAxis(c,e,"vert");for(f=0;f<b;++f){m=g[f];a=h.getSplitterTarget(m.target);if(a){m.collapseTarget=a=e[a.id];m.weight=a.weight;m.reverseWeighting=a.reverseWeighting;a.splitter=m;m.isHorz=a.isHorz;m.isVert=a.isVert}}h.sortWeightedItems(g,"reverseWeighting");h.setupSplitterNeighbors(g)},calculate:function(d){var l=this,a=l.getContainerSize(d),h=d.childItems,c=h.length,b=d.borderAxisHorz,j=d.borderAxisVert,e=d.outerPad,n=d.padOnContainer,g,p,k,o,m,f;b.begin=e.left;j.begin=e.top;m=b.end=b.flexSpace=a.width+(n?e.left:-e.right);f=j.end=j.flexSpace=a.height+(n?e.top:-e.bottom);for(g=0;g<c;++g){p=h[g];k=p.getMarginInfo();if(p.isHorz||p.isCenter){b.addUnflexed(k.width);m-=k.width}if(p.isVert||p.isCenter){j.addUnflexed(k.height);f-=k.height}if(!p.flex&&!p.percentage){if(p.isHorz||(p.isCenter&&p.collapseAxis==="horz")){o=p.getProp("width");b.addUnflexed(o);if(p.collapseTarget){m-=o}}else{if(p.isVert||(p.isCenter&&p.collapseAxis==="vert")){o=p.getProp("height");j.addUnflexed(o);if(p.collapseTarget){f-=o}}}}}for(g=0;g<c;++g){p=h[g];k=p.getMarginInfo();if(p.percentage){if(p.isHorz){o=Math.ceil(m*p.percentage/100);o=p.setWidth(o);b.addUnflexed(o)}else{if(p.isVert){o=Math.ceil(f*p.percentage/100);o=p.setHeight(o);j.addUnflexed(o)}}}}for(g=0;g<c;++g){p=h[g];if(!p.isCenter){l.calculateChildAxis(p,b);l.calculateChildAxis(p,j)}}if(l.finishAxis(d,j)+l.finishAxis(d,b)<2){l.done=false}else{l.finishPositions(h)}},calculateChildAxis:function(k,c){var a=k.collapseTarget,g="set"+c.sizePropCap,e=c.sizeProp,d=k.getMarginInfo()[e],i,b,f,h,j;if(a){i=a.region}else{i=k.region;f=k.flex}b=i==c.borderBegin;if(!b&&i!=c.borderEnd){k[g](c.end-c.begin-d);h=c.begin}else{if(f){j=Math.ceil(c.flexSpace*(f/c.totalFlex));j=k[g](j)}else{if(k.percentage){j=k.peek(e)}else{j=k.getProp(e)}}j+=d;if(b){h=c.begin;c.begin+=j}else{c.end=h=c.end-j}}k.layoutPos[c.posProp]=h},finishAxis:function(d,c){var b=c.end-c.begin,a=d.centerRegion;if(a){a["set"+c.sizePropCap](b-a.getMarginInfo()[c.sizeProp]);a.layoutPos[c.posProp]=c.begin}return Ext.isNumber(b)?1:0},finishPositions:function(d){var c=d.length,b,a;for(b=0;b<c;++b){a=d[b];a.setProp("x",a.layoutPos.x+a.marginInfo.left);a.setProp("y",a.layoutPos.y+a.marginInfo.top)}},getPlaceholder:function(a){return a.getPlaceholder&&a.getPlaceholder()},getSplitterTarget:function(b){var a=b.collapseTarget;if(a&&a.collapsed){return a.placeholder||a}return a},isItemBoxParent:function(a){return true},isItemShrinkWrap:function(a){return true},insertSplitter:function(c,b){var e=c.region,d={xtype:"bordersplitter",collapseTarget:c,id:c.id+"-splitter",hidden:!!c.hidden},a=b+((e=="south"||e=="east")?0:1);if(c.isHorz){d.height=null}else{d.width=null}if(c.collapseMode=="mini"){d.collapsedCls=c.collapsedCls}c.splitter=this.owner.add(a,d)},onAdd:function(c,a){var b=this,e=c.placeholderFor,d=c.region;b.callParent(arguments);if(d){Ext.apply(c,b.regionFlags[d]);if(d=="center"){if(b.centerRegion){Ext.Error.raise("Cannot have multiple center regions in a BorderLayout.")}b.centerRegion=c}else{c.collapseDirection=this.collapseDirections[d];if(c.split&&(c.isHorz||c.isVert)){b.insertSplitter(c,a)}}if(!c.hasOwnProperty("collapseMode")){c.collapseMode=b.panelCollapseMode}if(!c.hasOwnProperty("animCollapse")){if(c.collapseMode!="placeholder"){c.animCollapse=false}else{c.animCollapse=b.panelCollapseAnimate}}}else{if(e){Ext.apply(c,b.regionFlags[e.region]);c.region=e.region;c.weight=e.weight}}},onDestroy:function(){this.centerRegion=null;this.callParent()},onRemove:function(b){var a=this,d=b.region,c=b.splitter;if(d){if(b.isCenter){a.centerRegion=null}delete b.isCenter;delete b.isHorz;delete b.isVert;if(c){a.owner.doRemove(c,true);delete b.splitter}}a.callParent(arguments)},regionFlags:{center:{isCenter:true,isHorz:false,isVert:false},north:{isCenter:false,isHorz:false,isVert:true},south:{isCenter:false,isHorz:false,isVert:true},west:{isCenter:false,isHorz:true,isVert:false},east:{isCenter:false,isHorz:true,isVert:false}},setupSplitterNeighbors:function(l){var o={},e=l.length,n=this.touchedRegions,g,f,a,k,d,h,m,b,c;for(g=0;g<e;++g){h=l[g].target;m=h.region;if(h.isCenter){a=h}else{if(m){c=n[m];for(f=0,k=c.length;f<k;++f){d=o[c[f]];if(d){d.neighbors.push(h)}}if(h.placeholderFor){b=h.placeholderFor.splitter}else{b=h.splitter}if(b){b.neighbors=[]}o[m]=b}}}if(a){c=n.center;for(f=0,k=c.length;f<k;++f){d=o[c[f]];if(d){d.neighbors.push(a)}}}},touchedRegions:{center:["north","south","east","west"],north:["north","east","west"],south:["south","east","west"],east:["east","north","south"],west:["west","north","south"]},sizePolicies:{vert:{setsWidth:1,setsHeight:0},horz:{setsWidth:0,setsHeight:1},flexAll:{setsWidth:1,setsHeight:1}},getItemSizePolicy:function(e){var d=this,a=this.sizePolicies,c,b,f,g;if(e.isCenter){g=e.placeholderFor;if(g){if(g.collapsedVertical()){return a.vert}return a.horz}if(e.collapsed){if(e.collapsedVertical()){return a.vert}return a.horz}return a.flexAll}c=e.collapseTarget;if(c){return c.isVert?a.vert:a.horz}if(e.region){if(e.isVert){b=e.height;f=a.vert}else{b=e.width;f=a.horz}if(e.flex||(typeof b=="string"&&d.percentageRe.test(b))){return a.flexAll}return f}return d.autoSizePolicy}},function(){var a={addUnflexed:function(c){this.flexSpace=Math.max(this.flexSpace-c,0)}},b=this.prototype.axisProps;Ext.apply(b.horz,a);Ext.apply(b.vert,a)});