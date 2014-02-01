Ext.define("Ext.resizer.Resizer",{mixins:{observable:"Ext.util.Observable"},uses:["Ext.resizer.ResizeTracker","Ext.Component"],alternateClassName:"Ext.Resizable",handleCls:Ext.baseCSSPrefix+"resizable-handle",pinnedCls:Ext.baseCSSPrefix+"resizable-pinned",overCls:Ext.baseCSSPrefix+"resizable-over",wrapCls:Ext.baseCSSPrefix+"resizable-wrap",dynamic:true,handles:"s e se",height:null,width:null,heightIncrement:0,widthIncrement:0,minHeight:20,minWidth:20,maxHeight:10000,maxWidth:10000,pinned:false,preserveRatio:false,transparent:false,possiblePositions:{n:"north",s:"south",e:"east",w:"west",se:"southeast",sw:"southwest",nw:"northwest",ne:"northeast"},constructor:function(b){var j=this,h,n,p,o=j.handles,c,m,f,d=0,l,k=[],g,a,e;j.addEvents("beforeresize","resizedrag","resize");if(Ext.isString(b)||Ext.isElement(b)||b.dom){h=b;b=arguments[1]||{};b.target=h}j.mixins.observable.constructor.call(j,b);h=j.target;if(h){if(h.isComponent){j.el=h.getEl();if(h.minWidth){j.minWidth=h.minWidth}if(h.minHeight){j.minHeight=h.minHeight}if(h.maxWidth){j.maxWidth=h.maxWidth}if(h.maxHeight){j.maxHeight=h.maxHeight}if(h.floating){if(!j.hasOwnProperty("handles")){j.handles="n ne e se s sw w nw"}}}else{j.el=j.target=Ext.get(h)}}else{j.target=j.el=Ext.get(j.el)}p=j.el.dom.tagName.toUpperCase();if(p=="TEXTAREA"||p=="IMG"||p=="TABLE"){j.originalTarget=j.target;n=j.el;e=n.getBox();j.target=j.el=j.el.wrap({cls:j.wrapCls,id:j.el.id+"-rzwrap",style:n.getStyles("margin-top","margin-bottom")});j.el.setPositioning(n.getPositioning());n.clearPositioning();j.el.setBox(e);n.setStyle("position","absolute")}j.el.position();if(j.pinned){j.el.addCls(j.pinnedCls)}j.resizeTracker=new Ext.resizer.ResizeTracker({disabled:j.disabled,target:j.target,constrainTo:j.constrainTo,overCls:j.overCls,throttle:j.throttle,originalTarget:j.originalTarget,delegate:"."+j.handleCls,dynamic:j.dynamic,preserveRatio:j.preserveRatio,heightIncrement:j.heightIncrement,widthIncrement:j.widthIncrement,minHeight:j.minHeight,maxHeight:j.maxHeight,minWidth:j.minWidth,maxWidth:j.maxWidth});j.resizeTracker.on({mousedown:j.onBeforeResize,drag:j.onResize,dragend:j.onResizeEnd,scope:j});if(j.handles=="all"){j.handles="n s e w ne nw se sw"}o=j.handles=j.handles.split(/ |\s*?[,;]\s*?/);m=j.possiblePositions;f=o.length;c=j.handleCls+" "+(j.target.isComponent?(j.target.baseCls+"-handle "):"")+j.handleCls+"-";g=Ext.isIE6?' style="height:'+j.el.getHeight()+'px"':"";for(;d<f;d++){if(o[d]&&m[o[d]]){l=m[o[d]];if(l==="east"||l==="west"){a=g}else{a=""}k.push('<div id="'+j.el.id+"-"+l+'-handle" class="'+c+l+" "+Ext.baseCSSPrefix+'unselectable"'+a+"></div>")}}Ext.DomHelper.append(j.el,k.join(""));for(d=0;d<f;d++){if(o[d]&&m[o[d]]){l=m[o[d]];j[l]=j.el.getById(j.el.id+"-"+l+"-handle");j[l].region=l;j[l].unselectable();if(j.transparent){j[l].setOpacity(0)}}}if(Ext.isNumber(j.width)){j.width=Ext.Number.constrain(j.width,j.minWidth,j.maxWidth)}if(Ext.isNumber(j.height)){j.height=Ext.Number.constrain(j.height,j.minHeight,j.maxHeight)}if(j.width!==null||j.height!==null){if(j.originalTarget){j.originalTarget.setWidth(j.width);j.originalTarget.setHeight(j.height)}j.resizeTo(j.width,j.height)}j.forceHandlesHeight()},disable:function(){this.resizeTracker.disable()},enable:function(){this.resizeTracker.enable()},onBeforeResize:function(b,c){var a=this.el.getBox();return this.fireEvent("beforeresize",this,a.width,a.height,c)},onResize:function(c,d){var b=this,a=b.el.getBox();b.forceHandlesHeight();return b.fireEvent("resizedrag",b,a.width,a.height,d)},onResizeEnd:function(c,d){var b=this,a=b.el.getBox();b.forceHandlesHeight();return b.fireEvent("resize",b,a.width,a.height,d)},resizeTo:function(b,a){var c=this;c.target.setSize(b,a);c.fireEvent("resize",c,b,a,null)},getEl:function(){return this.el},getTarget:function(){return this.target},destroy:function(){var d=0,c=this.handles,a=c.length,b=this.possiblePositions;for(;d<a;d++){this[b[c[d]]].remove()}},forceHandlesHeight:function(){var a=this,b;if(Ext.isIE6){b=a.east;if(b){b.setHeight(a.el.getHeight())}b=a.west;if(b){b.setHeight(a.el.getHeight())}a.el.repaint()}}});