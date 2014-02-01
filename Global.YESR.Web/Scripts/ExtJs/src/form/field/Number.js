Ext.define("Ext.form.field.Number",{extend:"Ext.form.field.Spinner",alias:"widget.numberfield",alternateClassName:["Ext.form.NumberField","Ext.form.Number"],allowDecimals:true,decimalSeparator:".",submitLocaleSeparator:true,decimalPrecision:2,minValue:Number.NEGATIVE_INFINITY,maxValue:Number.MAX_VALUE,step:1,minText:"The minimum value for this field is {0}",maxText:"The maximum value for this field is {0}",nanText:"{0} is not a valid number",negativeText:"The value cannot be negative",baseChars:"0123456789",autoStripChars:false,initComponent:function(){var a=this,b;a.callParent();a.setMinValue(a.minValue);a.setMaxValue(a.maxValue);if(a.disableKeyFilter!==true){b=a.baseChars+"";if(a.allowDecimals){b+=a.decimalSeparator}if(a.minValue<0){b+="-"}b=Ext.String.escapeRegex(b);a.maskRe=new RegExp("["+b+"]");if(a.autoStripChars){a.stripCharsRe=new RegExp("[^"+b+"]","gi")}}},getErrors:function(c){var b=this,e=b.callParent(arguments),d=Ext.String.format,a;c=Ext.isDefined(c)?c:this.processRawValue(this.getRawValue());if(c.length<1){return e}c=String(c).replace(b.decimalSeparator,".");if(isNaN(c)){e.push(d(b.nanText,c))}a=b.parseValue(c);if(b.minValue===0&&a<0){e.push(this.negativeText)}else{if(a<b.minValue){e.push(d(b.minText,b.minValue))}}if(a>b.maxValue){e.push(d(b.maxText,b.maxValue))}return e},rawToValue:function(b){var a=this.fixPrecision(this.parseValue(b));if(a===null){a=b||null}return a},valueToRaw:function(c){var b=this,a=b.decimalSeparator;c=b.parseValue(c);c=b.fixPrecision(c);c=Ext.isNumber(c)?c:parseFloat(String(c).replace(a,"."));c=isNaN(c)?"":String(c).replace(".",a);return c},getSubmitValue:function(){var a=this,b=a.callParent();if(!a.submitLocaleSeparator){b=b.replace(a.decimalSeparator,".")}return b},onChange:function(){this.toggleSpinners();this.callParent(arguments)},toggleSpinners:function(){var b=this,c=b.getValue(),a=c===null;b.setSpinUpEnabled(a||c<b.maxValue);b.setSpinDownEnabled(a||c>b.minValue)},setMinValue:function(a){this.minValue=Ext.Number.from(a,Number.NEGATIVE_INFINITY);this.toggleSpinners()},setMaxValue:function(a){this.maxValue=Ext.Number.from(a,Number.MAX_VALUE);this.toggleSpinners()},parseValue:function(a){a=parseFloat(String(a).replace(this.decimalSeparator,"."));return isNaN(a)?null:a},fixPrecision:function(d){var c=this,b=isNaN(d),a=c.decimalPrecision;if(b||!d){return b?"":d}else{if(!c.allowDecimals||a<=0){a=0}}return parseFloat(Ext.Number.toFixed(parseFloat(d),a))},beforeBlur:function(){var b=this,a=b.parseValue(b.getRawValue());if(!Ext.isEmpty(a)){b.setValue(a)}},onSpinUp:function(){var a=this;if(!a.readOnly){a.setValue(Ext.Number.constrain(a.getValue()+a.step,a.minValue,a.maxValue))}},onSpinDown:function(){var a=this;if(!a.readOnly){a.setValue(Ext.Number.constrain(a.getValue()-a.step,a.minValue,a.maxValue))}}});