Ext.define("Ext.EventObjectImpl",{uses:["Ext.util.Point"],BACKSPACE:8,TAB:9,NUM_CENTER:12,ENTER:13,RETURN:13,SHIFT:16,CTRL:17,ALT:18,PAUSE:19,CAPS_LOCK:20,ESC:27,SPACE:32,PAGE_UP:33,PAGE_DOWN:34,END:35,HOME:36,LEFT:37,UP:38,RIGHT:39,DOWN:40,PRINT_SCREEN:44,INSERT:45,DELETE:46,ZERO:48,ONE:49,TWO:50,THREE:51,FOUR:52,FIVE:53,SIX:54,SEVEN:55,EIGHT:56,NINE:57,A:65,B:66,C:67,D:68,E:69,F:70,G:71,H:72,I:73,J:74,K:75,L:76,M:77,N:78,O:79,P:80,Q:81,R:82,S:83,T:84,U:85,V:86,W:87,X:88,Y:89,Z:90,CONTEXT_MENU:93,NUM_ZERO:96,NUM_ONE:97,NUM_TWO:98,NUM_THREE:99,NUM_FOUR:100,NUM_FIVE:101,NUM_SIX:102,NUM_SEVEN:103,NUM_EIGHT:104,NUM_NINE:105,NUM_MULTIPLY:106,NUM_PLUS:107,NUM_MINUS:109,NUM_PERIOD:110,NUM_DIVISION:111,F1:112,F2:113,F3:114,F4:115,F5:116,F6:117,F7:118,F8:119,F9:120,F10:121,F11:122,F12:123,WHEEL_SCALE:(function(){var a;if(Ext.isGecko){a=3}else{if(Ext.isMac){if(Ext.isSafari&&Ext.webKitVersion>=532){a=120}else{a=12}a*=3}else{a=120}}return a}()),clickRe:/(dbl)?click/,safariKeys:{3:13,63234:37,63235:39,63232:38,63233:40,63276:33,63277:34,63272:46,63273:36,63275:35},btnMap:Ext.isIE?{1:0,4:1,2:2}:{0:0,1:1,2:2},constructor:function(a,b){if(a){this.setEvent(a.browserEvent||a,b)}},setEvent:function(d,e){var c=this,b,a;if(d==c||(d&&d.browserEvent)){return d}c.browserEvent=d;if(d){b=d.button?c.btnMap[d.button]:(d.which?d.which-1:-1);if(c.clickRe.test(d.type)&&b==-1){b=0}a={type:d.type,button:b,shiftKey:d.shiftKey,ctrlKey:d.ctrlKey||d.metaKey||false,altKey:d.altKey,keyCode:d.keyCode,charCode:d.charCode,target:Ext.EventManager.getTarget(d),relatedTarget:Ext.EventManager.getRelatedTarget(d),currentTarget:d.currentTarget,xy:(e?c.getXY():null)}}else{a={button:-1,shiftKey:false,ctrlKey:false,altKey:false,keyCode:0,charCode:0,target:null,xy:[0,0]}}Ext.apply(c,a);return c},stopEvent:function(){this.stopPropagation();this.preventDefault()},preventDefault:function(){if(this.browserEvent){Ext.EventManager.preventDefault(this.browserEvent)}},stopPropagation:function(){var a=this.browserEvent;if(a){if(a.type=="mousedown"){Ext.EventManager.stoppedMouseDownEvent.fire(this)}Ext.EventManager.stopPropagation(a)}},getCharCode:function(){return this.charCode||this.keyCode},getKey:function(){return this.normalizeKey(this.keyCode||this.charCode)},normalizeKey:function(a){return Ext.isWebKit?(this.safariKeys[a]||a):a},getPageX:function(){return this.getX()},getPageY:function(){return this.getY()},getX:function(){return this.getXY()[0]},getY:function(){return this.getXY()[1]},getXY:function(){if(!this.xy){this.xy=Ext.EventManager.getPageXY(this.browserEvent)}return this.xy},getTarget:function(b,c,a){if(b){return Ext.fly(this.target).findParent(b,c,a)}return a?Ext.get(this.target):this.target},getRelatedTarget:function(b,c,a){if(b){return Ext.fly(this.relatedTarget).findParent(b,c,a)}return a?Ext.get(this.relatedTarget):this.relatedTarget},correctWheelDelta:function(c){var b=this.WHEEL_SCALE,a=Math.round(c/b);if(!a&&c){a=(c<0)?-1:1}return a},getWheelDeltas:function(){var d=this,c=d.browserEvent,b=0,a=0;if(Ext.isDefined(c.wheelDeltaX)){b=c.wheelDeltaX;a=c.wheelDeltaY}else{if(c.wheelDelta){a=c.wheelDelta}else{if(c.detail){a=-c.detail;if(a>100){a=3}else{if(a<-100){a=-3}}if(Ext.isDefined(c.axis)&&c.axis===c.HORIZONTAL_AXIS){b=a;a=0}}}}return{x:d.correctWheelDelta(b),y:d.correctWheelDelta(a)}},getWheelDelta:function(){var a=this.getWheelDeltas();return a.y},within:function(d,e,b){if(d){var c=e?this.getRelatedTarget():this.getTarget(),a;if(c){a=Ext.fly(d).contains(c);if(!a&&b){a=c==Ext.getDom(d)}return a}}return false},isNavKeyPress:function(){var b=this,a=this.normalizeKey(b.keyCode);return(a>=33&&a<=40)||a==b.RETURN||a==b.TAB||a==b.ESC},isSpecialKey:function(){var a=this.normalizeKey(this.keyCode);return(this.type=="keypress"&&this.ctrlKey)||this.isNavKeyPress()||(a==this.BACKSPACE)||(a>=16&&a<=20)||(a>=44&&a<=46)},getPoint:function(){var a=this.getXY();return new Ext.util.Point(a[0],a[1])},hasModifier:function(){return this.ctrlKey||this.altKey||this.shiftKey||this.metaKey},injectEvent:(function(){var d,e={},c;if(!Ext.isIE&&document.createEvent){d={createHtmlEvent:function(j,h,g,f){var i=j.createEvent("HTMLEvents");i.initEvent(h,g,f);return i},createMouseEvent:function(t,r,l,k,n,j,h,i,f,q,p,m,o){var g=t.createEvent("MouseEvents"),s=t.defaultView||window;if(g.initMouseEvent){g.initMouseEvent(r,l,k,s,n,j,h,j,h,i,f,q,p,m,o)}else{g=t.createEvent("UIEvents");g.initEvent(r,l,k);g.view=s;g.detail=n;g.screenX=j;g.screenY=h;g.clientX=j;g.clientY=h;g.ctrlKey=i;g.altKey=f;g.metaKey=p;g.shiftKey=q;g.button=m;g.relatedTarget=o}return g},createUIEvent:function(l,j,h,g,i){var k=l.createEvent("UIEvents"),f=l.defaultView||window;k.initUIEvent(j,h,g,f,i);return k},fireEvent:function(h,f,g){h.dispatchEvent(g)},fixTarget:function(f){if(f==window&&!f.dispatchEvent){return document}return f}}}else{if(document.createEventObject){c={0:1,1:4,2:2};d={createHtmlEvent:function(j,h,g,f){var i=j.createEventObject();i.bubbles=g;i.cancelable=f;return i},createMouseEvent:function(s,r,l,k,n,j,h,i,f,q,p,m,o){var g=s.createEventObject();g.bubbles=l;g.cancelable=k;g.detail=n;g.screenX=j;g.screenY=h;g.clientX=j;g.clientY=h;g.ctrlKey=i;g.altKey=f;g.shiftKey=q;g.metaKey=p;g.button=c[m]||m;g.relatedTarget=o;return g},createUIEvent:function(k,i,g,f,h){var j=k.createEventObject();j.bubbles=g;j.cancelable=f;return j},fireEvent:function(h,f,g){h.fireEvent("on"+f,g)},fixTarget:function(f){if(f==document){return document.documentElement}return f}}}}Ext.Object.each({load:[false,false],unload:[false,false],select:[true,false],change:[true,false],submit:[true,true],reset:[true,false],resize:[true,false],scroll:[true,false]},function(h,i){var g=i[0],f=i[1];e[h]=function(l,j){var k=d.createHtmlEvent(h,g,f);d.fireEvent(l,h,k)}});function b(h,g){var f=(h!="mousemove");return function(l,i){var k=i.getXY(),j=d.createMouseEvent(l.ownerDocument,h,true,f,g,k[0],k[1],i.ctrlKey,i.altKey,i.shiftKey,i.metaKey,i.button,i.relatedTarget);d.fireEvent(l,h,j)}}Ext.each(["click","dblclick","mousedown","mouseup","mouseover","mousemove","mouseout"],function(f){e[f]=b(f,1)});Ext.Object.each({focusin:[true,false],focusout:[true,false],activate:[true,true],focus:[false,false],blur:[false,false]},function(h,i){var g=i[0],f=i[1];e[h]=function(l,j){var k=d.createUIEvent(l.ownerDocument,h,g,f,1);d.fireEvent(l,h,k)}});if(!d){e={};d={fixTarget:function(f){return f}}}function a(g,f){}return function(i){var h=this,g=e[h.type]||a,f=i?(i.dom||i):h.getTarget();f=d.fixTarget(f);g(f,h)}}())},function(){Ext.EventObject=new Ext.EventObjectImpl()});