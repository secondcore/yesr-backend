Ext.define("Ext.layout.container.Auto",{alias:["layout.auto","layout.autocontainer"],extend:"Ext.layout.container.Container",type:"autocontainer",childEls:["clearEl"],renderTpl:["{%this.renderBody(out,values)%}",'<div id="{ownerId}-clearEl" class="',Ext.baseCSSPrefix,'clear" role="presentation"></div>'],calculate:function(b){var a=this,c;if(!b.hasDomProp("containerChildrenDone")){a.done=false}else{c=a.getContainerSize(b);if(!c.gotAll){a.done=false}a.calculateContentSize(b)}}});