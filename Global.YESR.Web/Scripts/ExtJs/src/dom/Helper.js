(function(){var b="afterbegin",h="afterend",a="beforebegin",n="beforeend",k="<table>",g="</table>",c=k+"<tbody>",m="</tbody>"+g,j=c+"<tr>",e="</tr>"+m,o=document.createElement("div"),l=["BeforeBegin","previousSibling"],i=["AfterEnd","nextSibling"],d={beforebegin:l,afterend:i},f={beforebegin:l,afterend:i,afterbegin:["AfterBegin","firstChild"],beforeend:["BeforeEnd","lastChild"]};Ext.define("Ext.dom.Helper",{extend:"Ext.dom.AbstractHelper",tableRe:/^table|tbody|tr|td$/i,tableElRe:/td|tr|tbody/i,useDom:false,createDom:function(p,v){var q,y=document,t,w,r,x,u,s;if(Ext.isArray(p)){q=y.createDocumentFragment();for(u=0,s=p.length;u<s;u++){this.createDom(p[u],q)}}else{if(typeof p=="string"){q=y.createTextNode(p)}else{q=y.createElement(p.tag||"div");t=!!q.setAttribute;for(w in p){if(!this.confRe.test(w)){r=p[w];if(w=="cls"){q.className=r}else{if(t){q.setAttribute(w,r)}else{q[w]=r}}}}Ext.DomHelper.applyStyles(q,p.style);if((x=p.children||p.cn)){this.createDom(x,q)}else{if(p.html){q.innerHTML=p.html}}}}if(v){v.appendChild(q)}return q},ieTable:function(u,p,v,t){o.innerHTML=[p,v,t].join("");var q=-1,s=o,r;while(++q<u){s=s.firstChild}r=s.nextSibling;if(r){s=document.createDocumentFragment();while(r){s.appendChild(r);r=r.nextSibling}}return s},insertIntoTable:function(y,r,q,s){var p,v,u=r==a,x=r==b,t=r==n,w=r==h;if(y=="td"&&(x||t)||!this.tableElRe.test(y)&&(u||w)){return null}v=u?q:w?q.nextSibling:x?q.firstChild:null;if(u||w){q=q.parentNode}if(y=="td"||(y=="tr"&&(t||x))){p=this.ieTable(4,j,s,e)}else{if((y=="tbody"&&(t||x))||(y=="tr"&&(u||w))){p=this.ieTable(3,c,s,m)}else{p=this.ieTable(2,k,s,g)}}q.insertBefore(p,v);return p},createContextualFragment:function(q){var p=document.createDocumentFragment(),r,s;o.innerHTML=q;s=o.childNodes;r=s.length;while(r--){p.appendChild(s[0])}return p},applyStyles:function(p,q){if(q){p=Ext.fly(p);if(typeof q=="function"){q=q.call()}if(typeof q=="string"){q=Ext.dom.Element.parseStyles(q)}if(typeof q=="object"){p.setStyle(q)}}},createHtml:function(p){return this.markup(p)},doInsert:function(s,u,t,v,r,p){s=s.dom||Ext.getDom(s);var q;if(this.useDom){q=this.createDom(u,null);if(p){s.appendChild(q)}else{(r=="firstChild"?s:s.parentNode).insertBefore(q,s[r]||s)}}else{q=this.insertHtml(v,s,this.markup(u))}return t?Ext.get(q,true):q},overwrite:function(r,q,s){var p;r=Ext.getDom(r);q=this.markup(q);if(Ext.isIE&&this.tableRe.test(r.tagName)){while(r.firstChild){r.removeChild(r.firstChild)}if(q){p=this.insertHtml("afterbegin",r,q);return s?Ext.get(p):p}return null}r.innerHTML=q;return s?Ext.get(r.firstChild):r.firstChild},insertHtml:function(r,u,s){var w,q,t,p,v;r=r.toLowerCase();if(u.insertAdjacentHTML){if(Ext.isIE&&this.tableRe.test(u.tagName)&&(v=this.insertIntoTable(u.tagName.toLowerCase(),r,u,s))){return v}if((w=f[r])){u.insertAdjacentHTML(w[0],s);return u[w[1]]}}else{if(u.nodeType===3){r=r==="afterbegin"?"beforebegin":r;r=r==="beforeend"?"afterend":r}q=Ext.supports.CreateContextualFragment?u.ownerDocument.createRange():undefined;p="setStart"+(this.endRe.test(r)?"After":"Before");if(d[r]){if(q){q[p](u);v=q.createContextualFragment(s)}else{v=this.createContextualFragment(s)}u.parentNode.insertBefore(v,r==a?u:u.nextSibling);return u[(r==a?"previous":"next")+"Sibling"]}else{t=(r==b?"first":"last")+"Child";if(u.firstChild){if(q){q[p](u[t]);v=q.createContextualFragment(s)}else{v=this.createContextualFragment(s)}if(r==b){u.insertBefore(v,u.firstChild)}else{u.appendChild(v)}}else{u.innerHTML=s}return u[t]}}Ext.Error.raise({sourceClass:"Ext.DomHelper",sourceMethod:"insertHtml",htmlToInsert:s,targetElement:u,msg:'Illegal insertion point reached: "'+r+'"'})},createTemplate:function(q){var p=this.markup(q);return new Ext.Template(p)}},function(){Ext.ns("Ext.core");Ext.DomHelper=Ext.core.DomHelper=new this})}());