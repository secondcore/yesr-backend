Ext.define("Ext.layout.container.VBox",{alias:["layout.vbox"],extend:"Ext.layout.container.Box",alternateClassName:"Ext.layout.VBoxLayout",align:"left",type:"vbox",direction:"vertical",horizontal:false,names:{lr:"tb",left:"top",leftCap:"Top",right:"bottom",position:"top",width:"height",contentWidth:"contentHeight",minWidth:"minHeight",maxWidth:"maxHeight",widthCap:"Height",widthModel:"heightModel",widthIndex:1,x:"y",scrollLeft:"scrollTop",overflowX:"overflowY",center:"center",top:"left",topPosition:"left",bottom:"right",height:"width",contentHeight:"contentWidth",minHeight:"minWidth",maxHeight:"maxWidth",heightCap:"Width",heightModel:"widthModel",heightIndex:0,y:"x",scrollTop:"scrollLeft",overflowY:"overflowX",getWidth:"getHeight",getHeight:"getWidth",setWidth:"setHeight",setHeight:"setWidth",gotWidth:"gotHeight",gotHeight:"gotWidth",setContentWidth:"setContentHeight",setContentHeight:"setContentWidth"},sizePolicy:{flex:{"":{setsWidth:0,setsHeight:1},stretch:{setsWidth:1,setsHeight:1},stretchmax:{readsWidth:1,setsWidth:1,setsHeight:1}},"":{setsWidth:0,setsHeight:0},stretch:{setsWidth:1,setsHeight:0},stretchmax:{readsWidth:1,setsWidth:1,setsHeight:0}}});