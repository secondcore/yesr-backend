Ext.define("Ext.env.Browser",{statics:{browserNames:{ie:"IE",firefox:"Firefox",safari:"Safari",chrome:"Chrome",opera:"Opera",other:"Other"},engineNames:{webkit:"WebKit",gecko:"Gecko",presto:"Presto",trident:"Trident",other:"Other"},enginePrefixes:{webkit:"AppleWebKit/",gecko:"Gecko/",presto:"Presto/",trident:"Trident/"},browserPrefixes:{ie:"MSIE ",firefox:"Firefox/",chrome:"Chrome/",safari:"Version/",opera:"Opera/"}},isSecure:false,isStrict:false,is:Ext.emptyFn,name:null,version:null,engineName:null,engineVersion:null,constructor:function(){var j=this.userAgent=Ext.global.navigator.userAgent,c=this.statics(),b=j.match(new RegExp("((?:"+Ext.Object.getValues(c.browserPrefixes).join(")|(?:")+"))([\\d\\._]+)")),a=j.match(new RegExp("((?:"+Ext.Object.getValues(c.enginePrefixes).join(")|(?:")+"))([\\d\\._]+)")),d=c.browserNames.other,i="",h=c.engineNames.other,g="",f,e;this.is=function(k){return this.is[k]===true};if(b){d=c.browserNames[Ext.Object.getKey(c.browserPrefixes,b[1])];i=b[2]}if(a){h=c.engineNames[Ext.Object.getKey(c.enginePrefixes,a[1])];g=a[2]}Ext.apply(this,{engineName:h,engineVersion:new Ext.Version(g),name:d,version:new Ext.Version(i)});this.is[this.name]=true;this.is[this.name+(this.version.getMajor()||"")]=true;this.is[this.name+this.version.getShortVersion()]=true;for(f in c.browserNames){if(c.browserNames.hasOwnProperty(f)){e=c.browserNames[f];this.is[e]=(this.name===e)}}this.is[this.name]=true;this.is[this.engineName+(this.engineVersion.getMajor()||"")]=true;this.is[this.engineName+this.engineVersion.getShortVersion()]=true;for(f in c.engineNames){if(c.engineNames.hasOwnProperty(f)){e=c.engineNames[f];this.is[e]=(this.engineNames===e)}}this.isSecure=/^https/i.test(Ext.global.location.protocol);this.isStrict=Ext.global.document.compatMode==="CSS1Compat";return this}},function(){Ext.browser=new Ext.env.Browser()});