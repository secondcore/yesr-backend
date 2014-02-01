Ext.define("Ext.form.field.Time",{extend:"Ext.form.field.ComboBox",alias:"widget.timefield",requires:["Ext.form.field.Date","Ext.picker.Time","Ext.view.BoundListKeyNav","Ext.Date"],alternateClassName:["Ext.form.TimeField","Ext.form.Time"],triggerCls:Ext.baseCSSPrefix+"form-time-trigger",minText:"The time in this field must be equal to or after {0}",maxText:"The time in this field must be equal to or before {0}",invalidText:"{0} is not a valid time",format:"g:i A",submitFormat:"g:i A",altFormats:"g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|ha|gA|h a|g a|g A|gi|hi|gia|hia|g|H|gi a|hi a|giA|hiA|gi A|hi A",increment:15,pickerMaxHeight:300,selectOnTab:true,snapToIncrement:false,initDate:"1/1/2008",initDateFormat:"j/n/Y",ignoreSelection:0,queryMode:"local",displayField:"disp",valueField:"date",initComponent:function(){var c=this,b=c.minValue,a=c.maxValue;if(b){c.setMinValue(b)}if(a){c.setMaxValue(a)}c.displayTpl=new Ext.XTemplate('<tpl for=".">{[typeof values === "string" ? values : this.formatDate(values["'+c.displayField+'"])]}<tpl if="xindex < xcount">'+c.delimiter+"</tpl></tpl>",{formatDate:Ext.Function.bind(c.formatDate,c)});this.callParent()},setMinValue:function(c){var b=this,a=b.picker;b.setLimit(c,true);if(a){a.setMinValue(b.minValue)}},setMaxValue:function(c){var b=this,a=b.picker;b.setLimit(c,false);if(a){a.setMaxValue(b.maxValue)}},setLimit:function(b,f){var a=this,e,c;if(Ext.isString(b)){e=a.parseDate(b)}else{if(Ext.isDate(b)){e=b}}if(e){c=Ext.Date.clearTime(new Date(a.initDate));c.setHours(e.getHours(),e.getMinutes(),e.getSeconds(),e.getMilliseconds())}else{c=null}a[f?"minValue":"maxValue"]=c},rawToValue:function(a){return this.parseDate(a)||a||null},valueToRaw:function(a){return this.formatDate(this.parseDate(a))},getErrors:function(d){var b=this,f=Ext.String.format,g=b.callParent(arguments),c=b.minValue,e=b.maxValue,a;d=b.formatDate(d||b.processRawValue(b.getRawValue()));if(d===null||d.length<1){return g}a=b.parseDate(d);if(!a){g.push(f(b.invalidText,d,Ext.Date.unescapeFormat(b.format)));return g}if(c&&a<c){g.push(f(b.minText,b.formatDate(c)))}if(e&&a>e){g.push(f(b.maxText,b.formatDate(e)))}return g},formatDate:function(){return Ext.form.field.Date.prototype.formatDate.apply(this,arguments)},parseDate:function(e){var d=this,g=e,b=d.altFormats,f=d.altFormatsArray,c=0,a;if(e&&!Ext.isDate(e)){g=d.safeParse(e,d.format);if(!g&&b){f=f||b.split("|");a=f.length;for(;c<a&&!g;++c){g=d.safeParse(e,f[c])}}}if(g&&d.snapToIncrement){g=new Date(Ext.Number.snap(g.getTime(),d.increment*60*1000))}return g},safeParse:function(e,f){var d=this,b=Ext.Date,c,a=null;if(b.formatContainsDateInfo(f)){a=b.parse(e,f)}else{c=b.parse(d.initDate+" "+e,d.initDateFormat+" "+f);if(c){a=c}}return a},getSubmitValue:function(){var a=this,c=a.submitFormat||a.format,b=a.getValue();return b?Ext.Date.format(b,c):null},createPicker:function(){var b=this,a;b.listConfig=Ext.apply({xtype:"timepicker",selModel:{mode:"SINGLE"},cls:undefined,minValue:b.minValue,maxValue:b.maxValue,increment:b.increment,format:b.format,maxHeight:b.pickerMaxHeight},b.listConfig);a=b.callParent();b.store=a.store;return a},onItemClick:function(b,a){var d=this,c=b.getSelectionModel().getSelection();if(c.length>0){c=c[0];if(c&&Ext.Date.isEqual(a.get("date"),c.get("date"))){d.collapse()}}},onListSelectionChange:function(c,e){var b=this,a=e[0],d=a?a.get("date"):null;if(!b.ignoreSelection){b.skipSync=true;b.setValue(d);b.skipSync=false;b.fireEvent("select",b,d);b.picker.clearHighlight();b.collapse();b.inputEl.focus()}},syncSelection:function(){var i=this,g=i.picker,c,f,j,b,h,e,a;if(g&&!i.skipSync){g.clearHighlight();j=i.getValue();f=g.getSelectionModel();i.ignoreSelection++;if(j===null){f.deselectAll()}else{if(Ext.isDate(j)){b=g.store.data.items;e=b.length;for(h=0;h<e;h++){a=b[h];if(Ext.Date.isEqual(a.get("date"),j)){c=a;break}}f.select(c)}}i.ignoreSelection--}},postBlur:function(){var a=this;a.callParent(arguments);a.setRawValue(a.formatDate(a.getValue()))},setValue:function(a){this.getPicker();this.callParent([this.parseDate(a)])},getValue:function(){var a=this.callParent(arguments);return this.parseDate(a)}});