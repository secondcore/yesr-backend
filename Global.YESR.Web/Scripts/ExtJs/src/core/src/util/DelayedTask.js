Ext.util.DelayedTask=function(d,c,a){var e=this,f,b=function(){clearInterval(f);f=null;d.apply(c,a||[])};this.delay=function(h,j,i,g){e.cancel();d=j||d;c=i||c;a=g||a;f=setInterval(b,h)};this.cancel=function(){if(f){clearInterval(f);f=null}}};