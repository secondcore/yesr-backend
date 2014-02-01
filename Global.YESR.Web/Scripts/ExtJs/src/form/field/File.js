Ext.define("Ext.form.field.File",{extend:"Ext.form.field.Trigger",alias:["widget.filefield","widget.fileuploadfield"],alternateClassName:["Ext.form.FileUploadField","Ext.ux.form.FileUploadField","Ext.form.File"],uses:["Ext.button.Button","Ext.layout.component.field.Field"],buttonText:"Browse...",buttonOnly:false,buttonMargin:3,fieldBodyCls:Ext.baseCSSPrefix+"form-file-wrap",readOnly:true,componentLayout:"triggerfield",childEls:["fileInputEl","buttonEl","buttonEl-btnEl","browseButtonWrap"],onRender:function(){var a=this,b;a.callParent(arguments);b=a.inputEl;b.dom.name="";a.fileInputEl.dom.name=a.getName();a.fileInputEl.on({scope:a,change:a.onFileChange});if(a.buttonOnly){a.inputCell.setDisplayed(false)}a.browseButtonWrap.dom.style.width=(a.browseButtonWrap.dom.lastChild.offsetWidth+a.buttonEl.getMargin("lr"))+"px";if(Ext.isIE){a.buttonEl.repaint()}},getTriggerMarkup:function(){var d=this,a,c=Ext.widget("button",Ext.apply({id:d.id+"-buttonEl",ui:d.ui,disabled:d.disabled,text:d.buttonText,cls:Ext.baseCSSPrefix+"form-file-btn",preventDefault:false,style:d.buttonOnly?"":"margin-left:"+d.buttonMargin+"px"},d.buttonConfig)),b=c.getRenderTree(),e={id:d.id+"-fileInputEl",cls:Ext.baseCSSPrefix+"form-file-input",tag:"input",type:"file",size:1};if(d.disabled){e.disabled=true}b.cn=e;a='<td id="'+d.id+'-browseButtonWrap">'+Ext.DomHelper.markup(b)+"</td>";c.destroy();return a},createFileInput:function(){var a=this;a.fileInputEl=a.buttonEl.createChild({name:a.getName(),id:a.id+"-fileInputEl",cls:Ext.baseCSSPrefix+"form-file-input",tag:"input",type:"file",size:1});a.fileInputEl.on({scope:a,change:a.onFileChange})},onFileChange:function(){this.lastValue=null;Ext.form.field.File.superclass.setValue.call(this,this.fileInputEl.dom.value)},setValue:Ext.emptyFn,reset:function(){var a=this;if(a.rendered){a.fileInputEl.remove();a.createFileInput();a.inputEl.dom.value=""}a.callParent()},onDisable:function(){this.callParent();this.disableItems()},disableItems:function(){var a=this.fileInputEl;if(a){a.dom.disabled=true}this["buttonEl-btnEl"].dom.disabled=true},onEnable:function(){var a=this;a.callParent();a.fileInputEl.dom.disabled=false;this["buttonEl-btnEl"].dom.disabled=true},isFileUpload:function(){return true},extractFileInput:function(){var a=this.fileInputEl.dom;this.reset();return a},onDestroy:function(){Ext.destroyMembers(this,"fileInputEl","buttonEl");this.callParent()}});