Ext.define("Ext.draw.engine.ImageExporter",{singleton:true,statics:(function(){var d={"image/png":1,"image/jpeg":1},k=function(l){if(l.hasOwnProperty("width")){b=l.width}if(l.hasOwnProperty("height")){h=l.height}if(l.hasOwnProperty("type")&&d[l.type]){e=l.type}else{return false}if(j&&i&&a&&f&&g){return true}j=j||Ext.get(document.createElement("form"));j.set({action:"http://svg.sencha.io",method:"POST"});i=i||Ext.get(document.createElement("input"));i.set({name:"svg",type:"hidden"});a=a||Ext.get(document.createElement("input"));a.set({name:"type",type:"hidden"});f=f||Ext.get(document.createElement("input"));f.set({name:"width",type:"hidden"});g=g||Ext.get(document.createElement("input"));g.set({name:"height",type:"hidden"});j.appendChild(i);j.appendChild(a);j.appendChild(f);j.appendChild(g);Ext.getBody().appendChild(j);return true},c=function(l){var m=Ext.draw.engine.SvgExporter.self.generate({},l);f.set({value:b||l.width});g.set({value:h||l.height});if(e){a.set({value:e})}i.set({value:m});j.dom.submit()},j,a,i,f,g,e,b,h;return{generate:function(m,l){if(k(m)){c(l)}else{return false}}}}())});