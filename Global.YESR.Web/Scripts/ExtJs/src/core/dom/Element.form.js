Ext.apply(Ext.core.Element,{serializeForm:function(c){var d=c.elements||(document.forms[c]||Ext.getDom(c)).elements,n=false,m=encodeURIComponent,i="",j,h=d.length,g,a,l,q,p,f,k,b;for(j=0;j<h;j++){g=d[j];a=g.name;l=g.type;q=g.options;if(!g.disabled&&a){if(/select-(one|multiple)/i.test(l)){k=q.length;for(f=0;f<k;f++){b=q[f];if(b.selected){p=b.hasAttribute?b.hasAttribute("value"):b.getAttributeNode("value").specified;i+=Ext.String.format("{0}={1}&",m(a),m(p?b.value:b.text))}}}else{if(!(/file|undefined|reset|button/i.test(l))){if(!(/radio|checkbox/i.test(l)&&!g.checked)&&!(l=="submit"&&n)){i+=m(a)+"="+m(g.value)+"&";n=/submit/i.test(l)}}}}}return i.substr(0,i.length-1)}});