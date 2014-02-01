Ext.define("Ext.window.MessageBox",{extend:"Ext.window.Window",requires:["Ext.toolbar.Toolbar","Ext.form.field.Text","Ext.form.field.TextArea","Ext.form.field.Display","Ext.button.Button","Ext.layout.container.Anchor","Ext.layout.container.HBox","Ext.ProgressBar"],alias:"widget.messagebox",OK:1,YES:2,NO:4,CANCEL:8,OKCANCEL:9,YESNO:6,YESNOCANCEL:14,INFO:Ext.baseCSSPrefix+"message-box-info",WARNING:Ext.baseCSSPrefix+"message-box-warning",QUESTION:Ext.baseCSSPrefix+"message-box-question",ERROR:Ext.baseCSSPrefix+"message-box-error",hideMode:"offsets",closeAction:"hide",resizable:false,title:"&#160;",width:600,height:500,minWidth:250,maxWidth:600,minHeight:110,maxHeight:500,constrain:true,cls:Ext.baseCSSPrefix+"message-box",layout:{type:"vbox",align:"stretch"},defaultTextHeight:75,minProgressWidth:250,minPromptWidth:250,buttonText:{ok:"OK",yes:"Yes",no:"No",cancel:"Cancel"},buttonIds:["ok","yes","no","cancel"],titleText:{confirm:"Confirm",prompt:"Prompt",wait:"Loading...",alert:"Attention"},iconHeight:35,makeButton:function(a){var b=this.buttonIds[a];return new Ext.button.Button({handler:this.btnCallback,itemId:b,scope:this,text:this.buttonText[b],minWidth:75})},btnCallback:function(a){var b=this,c,d;if(b.cfg.prompt||b.cfg.multiline){if(b.cfg.multiline){d=b.textArea}else{d=b.textField}c=d.getValue();d.reset()}a.blur();b.hide();b.userCallback(a.itemId,c,b.cfg)},hide:function(){var a=this;a.dd.endDrag();a.progressBar.reset();a.removeCls(a.cfg.cls);a.callParent(arguments)},initComponent:function(){var e=this,a=e.id,c,b,d;e.title="&#160;";e.topContainer=new Ext.container.Container({layout:"hbox",style:{padding:"10px",overflow:"hidden"},items:[e.iconComponent=new Ext.Component({cls:e.baseCls+"-icon",width:50,height:e.iconHeight}),e.promptContainer=new Ext.container.Container({flex:1,layout:{type:"anchor"},items:[e.msg=new Ext.form.field.Display({id:a+"-displayfield",cls:e.baseCls+"-text"}),e.textField=new Ext.form.field.Text({id:a+"-testfield",anchor:"100%",enableKeyEvents:true,listeners:{keydown:e.onPromptKey,scope:e}}),e.textArea=new Ext.form.field.TextArea({id:a+"-textarea",anchor:"100%",height:75})]})]});e.progressBar=new Ext.ProgressBar({id:a+"-progressbar",margins:"0 10 0 10"});e.items=[e.topContainer,e.progressBar];e.msgButtons=[];for(c=0;c<4;c++){b=e.makeButton(c);e.msgButtons[b.itemId]=b;e.msgButtons.push(b)}e.bottomTb=new Ext.toolbar.Toolbar({id:a+"-toolbar",ui:"footer",dock:"bottom",layout:{pack:"center"},items:[e.msgButtons[0],e.msgButtons[1],e.msgButtons[2],e.msgButtons[3]]});e.dockedItems=[e.bottomTb];d=e.bottomTb.getLayout();d.finishedLayout=Ext.Function.createInterceptor(d.finishedLayout,function(f){e.tbWidth=f.getProp("contentWidth")});e.on("close",e.onClose,e);e.callParent()},onClose:function(){var a=this.header.child("[type=close]");a.itemId="cancel";this.btnCallback(a);delete a.itemId},onPromptKey:function(a,c){var b=this,d;if(c.keyCode===Ext.EventObject.RETURN||c.keyCode===10){if(b.msgButtons.ok.isVisible()){d=true;b.msgButtons.ok.handler.call(b,b.msgButtons.ok)}else{if(b.msgButtons.yes.isVisible()){b.msgButtons.yes.handler.call(b,b.msgButtons.yes);d=true}}if(d){b.textField.blur()}}},reconfigure:function(a){var d=this,c=0,g=true,f=d.maxWidth,e=d.buttonText,b;d.updateButtonText();a=a||{};d.cfg=a;if(a.width){f=a.width}delete d.defaultFocus;d.animateTarget=a.animateTarget||undefined;d.modal=a.modal!==false;if(a.title){d.setTitle(a.title||"&#160;")}if(Ext.isObject(a.buttons)){d.buttonText=a.buttons;c=0}else{d.buttonText=a.buttonText||d.buttonText;c=Ext.isNumber(a.buttons)?a.buttons:0}c=c|d.updateButtonText();d.buttonText=e;Ext.suspendLayouts();d.hidden=false;if(!d.rendered){d.width=f;d.render(Ext.getBody())}else{d.setSize(f,d.maxHeight)}d.closable=a.closable&&!a.wait;d.header.child("[type=close]").setVisible(a.closable!==false);if(!a.title&&!d.closable){d.header.hide()}else{d.header.show()}d.liveDrag=!a.proxyDrag;d.userCallback=Ext.Function.bind(a.callback||a.fn||Ext.emptyFn,a.scope||Ext.global);d.setIcon(a.icon);if(a.msg){d.msg.setValue(a.msg);d.msg.show()}else{d.msg.hide()}Ext.resumeLayouts(true);Ext.suspendLayouts();if(a.prompt||a.multiline){d.multiline=a.multiline;if(a.multiline){d.textArea.setValue(a.value);d.textArea.setHeight(a.defaultTextHeight||d.defaultTextHeight);d.textArea.show();d.textField.hide();d.defaultFocus=d.textArea}else{d.textField.setValue(a.value);d.textArea.hide();d.textField.show();d.defaultFocus=d.textField}}else{d.textArea.hide();d.textField.hide()}if(a.progress||a.wait){d.progressBar.show();d.updateProgress(0,a.progressText);if(a.wait===true){d.progressBar.wait(a.waitConfig)}}else{d.progressBar.hide()}for(b=0;b<4;b++){if(c&Math.pow(2,b)){if(!d.defaultFocus){d.defaultFocus=d.msgButtons[b]}d.msgButtons[b].show();g=false}else{d.msgButtons[b].hide()}}if(g){d.bottomTb.hide()}else{d.bottomTb.show()}Ext.resumeLayouts(true)},updateButtonText:function(){var d=this,c=d.buttonText,b=0,e,a;for(e in c){if(c.hasOwnProperty(e)){a=d.msgButtons[e];if(a){if(d.cfg&&d.cfg.buttonText){b=b|Math.pow(2,Ext.Array.indexOf(d.buttonIds,e))}if(a.text!=c[e]){a.setText(c[e])}}}}return b},show:function(a){var b=this;b.reconfigure(a);b.addCls(a.cls);b.doAutoSize();b.hidden=true;b.callParent();return b},onShow:function(){this.callParent(arguments);this.center()},doAutoSize:function(){var d=this,e=d.header.rendered&&d.header.isVisible(),c=d.bottomTb.rendered&&d.bottomTb.isVisible(),b,a;if(!Ext.isDefined(d.frameWidth)){d.frameWidth=d.el.getWidth()-d.body.getWidth()}d.minWidth=d.cfg.minWidth||Ext.getClass(this).prototype.minWidth;b=Math.max(e?d.header.getMinWidth():0,d.cfg.width||d.msg.getWidth()+d.iconComponent.getWidth()+25,(c?d.tbWidth:0));a=(e?d.header.getHeight():0)+d.topContainer.getHeight()+d.progressBar.getHeight()+(c?d.bottomTb.getHeight()+d.bottomTb.el.getMargin("tb"):0);d.setSize(b+d.frameWidth,a+d.frameWidth);return d},updateText:function(a){this.msg.setValue(a);return this.doAutoSize(true)},setIcon:function(a){var b=this;b.iconComponent.removeCls(b.messageIconCls);if(a){b.iconComponent.show();b.iconComponent.addCls(Ext.baseCSSPrefix+"dlg-icon");b.iconComponent.addCls(b.messageIconCls=a)}else{b.iconComponent.removeCls(Ext.baseCSSPrefix+"dlg-icon");b.iconComponent.hide()}return b},updateProgress:function(b,a,c){this.progressBar.updateProgress(b,a);if(c){this.updateText(c)}return this},onEsc:function(){if(this.closable!==false){this.callParent(arguments)}},confirm:function(a,d,c,b){if(Ext.isString(a)){a={title:a,icon:this.QUESTION,msg:d,buttons:this.YESNO,callback:c,scope:b}}return this.show(a)},prompt:function(b,f,d,c,a,e){if(Ext.isString(b)){b={prompt:true,title:b,minWidth:this.minPromptWidth,msg:f,buttons:this.OKCANCEL,callback:d,scope:c,multiline:a,value:e}}return this.show(b)},wait:function(a,c,b){if(Ext.isString(a)){a={title:c,msg:a,closable:false,wait:true,modal:true,minWidth:this.minProgressWidth,waitConfig:b}}return this.show(a)},alert:function(a,d,c,b){if(Ext.isString(a)){a={title:a,msg:d,buttons:this.OK,fn:c,scope:b,minWidth:this.minWidth}}return this.show(a)},progress:function(a,c,b){if(Ext.isString(a)){a={title:a,msg:c,progress:true,progressText:b}}return this.show(a)}},function(){Ext.MessageBox=Ext.Msg=new this()});