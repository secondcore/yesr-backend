Ext.define("Ext.data.Operation",{synchronous:true,action:undefined,filters:undefined,sorters:undefined,groupers:undefined,start:undefined,limit:undefined,batch:undefined,callback:undefined,scope:undefined,started:false,running:false,complete:false,success:undefined,exception:false,error:undefined,actionCommitRecordsRe:/^(?:create|update)$/i,actionSkipSyncRe:/^destroy$/i,constructor:function(a){Ext.apply(this,a||{})},commitRecords:function(b){var f=this,g,c,d,e,a;if(!f.actionSkipSyncRe.test(f.action)){d=f.records;if(d&&d.length){if(d.length>1){g=new Ext.util.MixedCollection();g.addAll(b);for(c=d.length;c--;){a=d[c];e=g.findBy(f.matchClientRec,a);a.copyFrom(e)}}else{a=d[0];e=b[0];if(e&&(a.phantom||a.getId()===e.getId())){a.copyFrom(e)}}if(f.actionCommitRecordsRe.test(f.action)){for(c=d.length;c--;){d[c].commit()}}}}},matchClientRec:function(c){var a=this,b=a.getId();if(b&&c.getId()===b){return true}return c.internalId===a.internalId},setStarted:function(){this.started=true;this.running=true},setCompleted:function(){this.complete=true;this.running=false},setSuccessful:function(){this.success=true},setException:function(a){this.exception=true;this.success=false;this.running=false;this.error=a},hasException:function(){return this.exception===true},getError:function(){return this.error},getRecords:function(){var a=this.getResultSet();return this.records||(a?a.records:null)},getResultSet:function(){return this.resultSet},isStarted:function(){return this.started===true},isRunning:function(){return this.running===true},isComplete:function(){return this.complete===true},wasSuccessful:function(){return this.isComplete()&&this.success===true},setBatch:function(a){this.batch=a},allowWrite:function(){return this.action!="read"}});