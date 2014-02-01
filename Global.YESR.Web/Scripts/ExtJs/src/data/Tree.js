Ext.define("Ext.data.Tree",{alias:"data.tree",mixins:{observable:"Ext.util.Observable"},root:null,constructor:function(a){var b=this;b.mixins.observable.constructor.call(b);if(a){b.setRootNode(a)}},getRootNode:function(){return this.root},setRootNode:function(b){var a=this;a.root=b;if(a.fireEvent("beforeappend",null,b)!==false){b.set("root",true);b.updateInfo();b.commit();b.on({scope:a,insert:a.onNodeInsert,append:a.onNodeAppend,remove:a.onNodeRemove});a.relayEvents(b,["append","remove","move","insert","beforeappend","beforeremove","beforemove","beforeinsert","expand","collapse","beforeexpand","beforecollapse","sort","rootchange"]);a.nodeHash={};a.registerNode(b);a.fireEvent("append",null,b);a.fireEvent("rootchange",b)}return b},flatten:function(){var a=[],c=this.nodeHash,b;for(b in c){if(c.hasOwnProperty(b)){a.push(c[b])}}return a},onNodeInsert:function(a,b){this.registerNode(b,true)},onNodeAppend:function(a,b){this.registerNode(b,true)},onNodeRemove:function(a,b){this.unregisterNode(b,true)},onNodeIdChanged:function(c,d,a){var b=this.nodeHash;b[a]=c;delete b[d||c.internalId]},getNodeById:function(a){return this.nodeHash[a]},registerNode:function(c,a){var b=this;b.nodeHash[c.getId()||c.internalId]=c;c.on("idchanged",b.onNodeIdChanged,b);if(a===true){c.eachChild(function(d){b.registerNode(d,true)})}},unregisterNode:function(b,a){delete this.nodeHash[b.getId()||b.internalId];if(a===true){b.eachChild(function(c){this.unregisterNode(c,true)},this)}},sort:function(b,a){this.getRootNode().sort(b,a)},filter:function(b,a){this.getRootNode().filter(b,a)}});