Ext.define("Ext.layout.container.CheckboxGroup",{extend:"Ext.layout.container.Container",alias:["layout.checkboxgroup"],autoFlex:true,type:"checkboxgroup",childEls:["innerCt"],renderTpl:['<table id="{ownerId}-innerCt" role="presentation" style="{tableStyle}"><tbody><tr>','<tpl for="columns">','<td class="{parent.colCls}" valign="top" style="{style}">',"{% this.renderColumn(out,parent,xindex-1) %}","</td>","</tpl>","</tr></tbody></table>"],beginLayout:function(b){var m=this,e,d,k,j,g,a,l,f=0,o=0,n=m.autoFlex,h=m.owner.items.generation,c=m.innerCt.dom.style;m.callParent(arguments);j=b.childItems;if(m.lastChildGeneration!=h){m.lastChildGeneration=h;m.fixColumns()}e=m.columnEls;b.innerCtContext=b.getEl("innerCt",m);if(!b.widthModel.shrinkWrap){d=e.length;if(m.columnsArray){for(g=0;g<d;g++){a=m.owner.columns[g];if(a<1){f+=a;o++}}for(g=0;g<d;g++){a=m.owner.columns[g];if(a<1){l=((a/f)*100)+"%"}else{l=a+"px"}e[g].style.width=l}}else{for(g=0;g<d;g++){l=n?(1/d*100)+"%":"";e[g].style.width=l;o++}}if(!o){c.tableLayout="fixed";c.width=""}else{if(o<d){c.tableLayout="fixed";c.width="100%"}else{c.tableLayout="auto";if(n){c.width="100%"}else{c.width=""}}}}else{c.tableLayout="auto";c.width=""}},cacheElements:function(){var a=this;a.callParent();a.columnEls=a.innerCt.query("td."+a.owner.groupCls);a.lastChildGeneration=a.owner.items.generation},calculate:function(g){var e=this,c,b,a,h,d,f;if(!g.getDomProp("containerChildrenDone")){e.done=false}else{c=g.innerCtContext;b=g.widthModel.shrinkWrap;a=g.heightModel.shrinkWrap;h=a||b;d=c.el.dom;f=h&&c.getPaddingInfo();if(b){g.setContentWidth(d.offsetWidth+f.width,true)}if(a){g.setContentHeight(d.offsetHeight+f.height,true)}}},doRenderColumn:function(d,k,f){var h=k.$layout,c=h.owner,e=k.columnCount,g=c.items.items,b=g.length,l,a,i,j,m;if(c.vertical){i=Math.ceil(b/e);a=f*i;b=Math.min(b,a+i);j=1}else{a=f;j=e}for(;a<b;a+=j){l=g[a];h.configureItem(l);m=l.getRenderTree();Ext.DomHelper.generateMarkup(m,d)}},fixColumns:function(){var l=this,b=l.owner,c=b.columns,e=l.columnEls,j=b.items.items,g=e.length,a=j.length,h,f,m,k,d,n;if((!c||c=="auto")&&(a>g)){n=a-g;for(f=0;f<n;f++){k=l.innerCt.down("tr");k.createChild({cls:b.groupCls,tag:"td",vAlign:"top"})}l.cacheElements();e=l.columnEls;g=e.length}if(b.vertical){h=-1;m=Math.ceil(a/g);for(f=0;f<a;++f){if(f%m===0){++h}e[h].appendChild(j[f].el.dom)}}else{for(f=0;f<a;++f){h=f%g;e[h].appendChild(j[f].el.dom)}}},getColumnCount:function(){var b=this,a=b.owner,c=a.columns;if(b.columnsArray){return c.length}if(Ext.isNumber(c)){return c}return a.items.length},getItemSizePolicy:function(a){return this.autoSizePolicy},getRenderData:function(){var j=this,f=j.callParent(),b=j.owner,g,d=j.getColumnCount(),a,c,h,k=j.autoFlex,e=0,l=0;if(j.columnsArray){for(g=0;g<d;g++){a=j.owner.columns[g];if(a<1){e+=a;l++}}}f.colCls=b.groupCls;f.columnCount=d;f.columns=[];for(g=0;g<d;g++){c=(f.columns[g]={});if(j.columnsArray){a=j.owner.columns[g];if(a<1){h=((a/e)*100)+"%"}else{h=a+"px"}c.style="width:"+h}else{c.style="width:"+(1/d*100)+"%";l++}}f.tableStyle=!l?"table-layout:fixed;":(l<d)?"table-layout:fixed;width:100%":(k)?"table-layout:auto;width:100%":"table-layout:auto;";return f},getRenderTarget:function(){return this.innerCt},initLayout:function(){var b=this,a=b.owner;b.columnsArray=Ext.isArray(a.columns);b.evenColumns=Ext.isNumber(a.columns);b.callParent()},isValidParent:function(){return true},setupRenderTpl:function(a){this.callParent(arguments);a.renderColumn=this.doRenderColumn}});