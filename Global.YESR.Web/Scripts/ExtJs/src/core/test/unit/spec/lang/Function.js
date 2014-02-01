describe("Ext.Function",function(){var c,h,a,d,g,f=function(i,k,j){j=j||1;waitsFor(function(){return i.calls.length>=j});runs(k)},e=function(){a=[];d=[];g=[];c=window.setTimeout;window.setTimeout=function(i,j){a.push(j);var k=c.apply(this,arguments);d.push(k);return k};h=window.clearTimeout;window.clearTimeout=function(i){g.push(i);h.apply(this,arguments)}},b=function(){a=undefined;d=undefined;g=undefined;window.setTimeout=c;window.clearTimeout=h};describe("bind",function(){var i,j;beforeEach(function(){i=jasmine.createSpy("bindSpy")});it("should return a function if a function is passed as first argument",function(){j=Ext.Function.bind(i,this);expect(typeof j==="function").toBe(true)});it("should use the correct scope",function(){j=Ext.Function.bind(i,fakeScope);j();expect(i.calls[0].object).toBe(fakeScope)});it("should call the first function when it is executed",function(){j=Ext.Function.bind(i,this);j();expect(i).toHaveBeenCalled()});describe("argument passing",function(){it("should use default args if none are passed",function(){j=Ext.Function.bind(i,this,["a","b"]);j();expect(i).toHaveBeenCalledWith("a","b")});it("should use passed args if they are present",function(){j=Ext.Function.bind(i,this);j("c","d");expect(i).toHaveBeenCalledWith("c","d")});it("should append args",function(){j=Ext.Function.bind(i,this,["a","b"],true);j("c","d");expect(i).toHaveBeenCalledWith("c","d","a","b")});it("should append args at the given index",function(){j=Ext.Function.bind(i,this,["a","b"],0);j("c","d");expect(i).toHaveBeenCalledWith("a","b","c","d")})})});describe("pass",function(){it("should pass the specified array of arguments as the first arguments to the given function",function(){var j=jasmine.createSpy(),i=[0,1,2],k=Ext.Function.pass(j,i);k(3,4,5);expect(j).toHaveBeenCalledWith(0,1,2,3,4,5)});it("should pass the specified string argument as the first argument to the given function",function(){var j=jasmine.createSpy(),i="a",k=Ext.Function.pass(j,i);k("b","c");expect(j).toHaveBeenCalledWith("a","b","c")});it("should pass the specified numeric argument as the first argument to the given function",function(){var j=jasmine.createSpy(),i=0,k=Ext.Function.pass(j,i);k(1);expect(j).toHaveBeenCalledWith(0,1)});it("should pass the specified 'arguments' argument as the first argument to the given funciton",function(){var i=function(){var k=jasmine.createSpy(),j=arguments,l=Ext.Function.pass(k,j);l(3,4,5);expect(k).toHaveBeenCalledWith(0,1,2,3,4,5)};i(0,1,2)});it("should discard the argument if it's undefined",function(){var j=jasmine.createSpy(),i=undefined,k=Ext.Function.pass(j,i);k(1);expect(j).toHaveBeenCalledWith(1)});it("should use 'this' as default scope",function(){var k="a",i=jasmine.createSpy().andCallFake(function(){k=this.foo}),j=Ext.Function.pass(i,"c");j("d");expect(i).toHaveBeenCalledWith("c","d");expect(k).toBeUndefined()});it("should override 'this' with the specified scope",function(){var l="a",j={foo:"b"},i=jasmine.createSpy().andCallFake(function(){l=this.foo}),k=Ext.Function.pass(i,"c",j);k("d");expect(i).toHaveBeenCalledWith("c","d");expect(l).toBe("b")})});describe("clone",function(){it("should clone the given function",function(){var k=jasmine.createSpy().andCallFake(function(l){return"bar"}),j=Ext.Function.clone(k),i=j("foo");expect(i).toBe("bar");expect(k).toHaveBeenCalledWith("foo")})});describe("createInterceptor",function(){var m,l,k,j,i;beforeEach(function(){j=false;i=false;l=jasmine.createSpy("interceptorSpy").andCallFake(function(){j=true});k=jasmine.createSpy("interceptedSpy").andCallFake(function(){i=j})});describe("if no function is passed",function(){it("should return the same function",function(){expect(Ext.Function.createInterceptor(k)).toEqual(k)})});describe("if a function is passed",function(){beforeEach(function(){m=Ext.Function.createInterceptor(k,l,fakeScope);m()});it("should return a new function",function(){expect(typeof m==="function").toBe(true);expect(m).not.toEqual(k)});it("should set the correct scope for the interceptor function",function(){expect(l.calls[0].object).toBe(fakeScope)});it("should call the interceptor function first",function(){expect(i).toBe(true)})});describe("if the interceptor function returns false",function(){it("should not execute the original function",function(){m=Ext.Function.createInterceptor(k,function(){return false});m();expect(k).not.toHaveBeenCalled()})})});describe("createDelayed",function(){it("should create bind to the given function to be called after x milliseconds",function(){e();var j=jasmine.createSpy(),i=Ext.Function.createDelayed(j,2);i("foo");expect(a.shift()).toBe(2);expect(j).not.toHaveBeenCalled();f(j,function(){expect(j).toHaveBeenCalledWith("foo")});b()});it("should use the specified scope as 'this'",function(){var k={x:"foo"},j=jasmine.createSpy().andCallFake(function(){this.x="bar"}),i=Ext.Function.createDelayed(j,2,k);i();expect(j).not.toHaveBeenCalled();expect(k.x).toBe("foo");f(j,function(){expect(k.x).toBe("bar")})});it("should override the call arguments with the specified arguments",function(){var l={},j=[0,1,2],k=jasmine.createSpy(),i=Ext.Function.createDelayed(k,2,l,j);i(3,4,5);expect(k).not.toHaveBeenCalled();f(k,function(){expect(k).toHaveBeenCalledWith(0,1,2)})});it("should append the specified arguments to the call arguments when appendArgs is true",function(){var l={},j=[0,1,2],k=jasmine.createSpy(),i=Ext.Function.createDelayed(k,2,l,j,true);i(3,4,5);expect(k).not.toHaveBeenCalled();f(k,function(){expect(k).toHaveBeenCalledWith(3,4,5,0,1,2)})});it("should insert the specified arguments into the call arguments at the position specified by appendArgs",function(){var l={},j=[0,1,2],k=jasmine.createSpy(),i=Ext.Function.createDelayed(k,2,l,j,2);i(3,4,5);expect(k).not.toHaveBeenCalled();f(k,function(){expect(k).toHaveBeenCalledWith(3,4,0,1,2,5)})})});describe("defer",function(){var i;beforeEach(function(){i=jasmine.createSpy("deferSpy")});it("should execute the function after the specified number of milliseconds",function(){Ext.defer(i,10);waitsFor(function(){return i.calls.length===1},"fn was never called");runs(function(){expect(i).toHaveBeenCalled()})});it("should execute the function directly if the specified number of milliseconds is <= 0",function(){Ext.defer(i,0);expect(i).toHaveBeenCalled()});it("should set the correct scope",function(){Ext.defer(i,10,fakeScope);waitsFor(function(){return i.calls.length===1},"fn was never called");runs(function(){expect(i.calls[0].object).toBe(fakeScope)})});it("should pass the correct arguments",function(){Ext.defer(i,10,this,[1,2,3]);waitsFor(function(){return i.calls.length===1},"fn was never called");runs(function(){expect(i).toHaveBeenCalledWith(1,2,3)})});it("should return a timeout number",function(){expect(typeof Ext.defer(function(){},10)==="number").toBe(true)})});describe("createSequence",function(){var m,l,k,j,i;beforeEach(function(){j=false;i=false;k=jasmine.createSpy("interceptedSpy").andCallFake(function(){j=true});l=jasmine.createSpy("sequenceSpy").andCallFake(function(){i=j})});describe("if no function is passed",function(){it("should return the same function",function(){expect(Ext.Function.createSequence(k)).toEqual(k)})});describe("if a function is passed",function(){beforeEach(function(){m=Ext.Function.createSequence(k,l,fakeScope);m()});it("should return a new function",function(){expect(typeof m==="function").toBe(true);expect(m).not.toEqual(k)});it("should set the correct scope for the sequence function",function(){expect(l.calls[0].object).toBe(fakeScope)});it("should call the sequence function first",function(){expect(i).toBe(true)})})});describe("createBuffered",function(){it("should prevent the execution of multiple calls of the buffered function within the timeout period",function(){e();var i=jasmine.createSpy(),j=Ext.Function.createBuffered(i,2);j();expect(a.shift()).toBe(2);j();expect(g.shift()).toBe(d.shift());expect(a.shift()).toBe(2);expect(i).not.toHaveBeenCalled();f(i,function(){expect(i.calls.length).toBe(1)});b()});it("should use the specified scope as 'this'",function(){var j={x:1},i=jasmine.createSpy().andCallFake(function(){this.x++}),k=Ext.Function.createBuffered(i,20,j);k();expect(j.x).toBe(1);k();f(i,function(){expect(j.x).toBe(2)})});it("should override the call arguments with the specified ones",function(){var k={},i=["bar1","bar2"],j=jasmine.createSpy(),l=Ext.Function.createBuffered(j,20,k,i);l("foo1","foo2");expect(j).not.toHaveBeenCalled();f(j,function(){expect(j).toHaveBeenCalledWith("bar1","bar2")})})});describe("createThrottled",function(){it("should execute only once per each specified time interval",function(){e();var j=jasmine.createSpy(),i=Ext.Function.createThrottled(j,10);expect(j).not.toHaveBeenCalled();i();expect(g.shift()).toBeUndefined();expect(j.calls.length).toBe(1);i();expect(a.shift()).not.toBeGreaterThan(10);expect(g.shift()).toBeUndefined();i();expect(a.shift()).not.toBeGreaterThan(10);expect(g.shift()).toBe(d.shift());i();expect(a.shift()).not.toBeGreaterThan(10);expect(g.shift()).toBe(d.shift());expect(j.calls.length).toBe(1);f(j,function(){expect(j.calls.length).toEqual(2);i();expect(j.calls.length).not.toBeLessThan(2);expect(j.calls.length).not.toBeGreaterThan(3)},2);b()});it("should use the specified scope as 'this'",function(){var k={},j=jasmine.createSpy().andCallFake(function(l){this.x=l}),i=Ext.Function.createThrottled(j,10,k);i("foo");i("bar");i("baz");i("qux");expect(j).toHaveBeenCalledWith("foo");expect(k.x).toBe("foo");expect(j.calls.length).toBe(1)})});describe("interceptAfter",function(){it("should execute interceptor after each method call",function(){var i={phrases:[],addPhrase:function(k){this.phrases.push(k)}},j=jasmine.createSpy().andCallFake(function(k){this.phrases.push(k+" too")});Ext.Function.interceptAfter(i,"addPhrase",j);i.addPhrase("I like you");i.addPhrase("I love you");expect(i.phrases).toEqual(["I like you","I like you too","I love you","I love you too"]);expect(j).toHaveBeenCalledWith("I like you");expect(j).toHaveBeenCalledWith("I love you")});it("should execute interceptor after each method call with the specified scope as 'this'",function(){var j={phrases:[],addPhrase:function(l){this.phrases.push(l)}},k={phrases:[]},i=jasmine.createSpy().andCallFake(function(l){this.phrases.push("He said: "+l)});Ext.Function.interceptAfter(j,"addPhrase",i,k);j.addPhrase("I like you");j.addPhrase("I love you");expect(j.phrases).toEqual(["I like you","I love you"]);expect(k.phrases).toEqual(["He said: I like you","He said: I love you"]);expect(i).toHaveBeenCalledWith("I like you");expect(i).toHaveBeenCalledWith("I love you")})})});