describe("Ext.Error",function(){var a;beforeEach(function(){a=Ext.global;Ext.global={console:{dir:function(b){return b},log:function(b){return b},error:function(b){return b},warn:function(b){return b}}}});afterEach(function(){Ext.global=a});describe("raising an error via Ext.Error.raise",function(){describe("passing a string",function(){it("should throw an error with a msg property",function(){var b;try{Ext.Error.raise("foo")}catch(c){b=c}expect(b.msg).toEqual("foo")});it("should log an error to the console",function(){spyOn(Ext.global.console,"error");try{Ext.Error.raise("foo")}catch(b){}expect(Ext.global.console.error).toHaveBeenCalledWith("[E] foo")});it("should log the error object to the console",function(){spyOn(Ext.global.console,"dir").andCallFake(function(c){expect(c.msg).toEqual("foo")});try{Ext.Error.raise("foo")}catch(b){}});it("should do nothing when Ext.Error.ignore = true",function(){spyOn(Ext.global.console,"warn");Ext.Error.ignore=true;try{Ext.Error.raise("foo")}catch(b){expect("Error should not have been caught").toBe(true)}expect(Ext.global.console.warn).not.toHaveBeenCalled();Ext.Error.ignore=false});it("should not throw an error if handled by Ext.Error.handle",function(){spyOn(Ext.global.console,"warn");var b=Ext.Error.handle;Ext.Error.handle=function(d){expect(d.msg).toEqual("foo");return true};try{Ext.Error.raise("foo")}catch(c){expect("Error should not have been caught").toBe(true)}expect(Ext.global.console.warn).not.toHaveBeenCalled();Ext.Error.handle=b})});describe("passing an object with a msg property",function(){it("should throw an error with a msg property",function(){var b;try{Ext.Error.raise({msg:"foo"})}catch(c){b=c}expect(b.msg).toEqual("foo")});it("should log an error to the console",function(){spyOn(Ext.global.console,"error");try{Ext.Error.raise({msg:"foo"})}catch(b){}expect(Ext.global.console.error).toHaveBeenCalledWith("[E] foo")});it("should log the error object to the console",function(){spyOn(Ext.global.console,"dir").andCallFake(function(c){expect(c.msg).toEqual("foo")});try{Ext.Error.raise({msg:"foo"})}catch(b){}});it("should do nothing when Ext.Error.ignore = true",function(){spyOn(Ext.global.console,"warn");Ext.Error.ignore=true;try{Ext.Error.raise({msg:"foo"})}catch(b){expect("Error should not have been caught").toBe(true)}expect(Ext.global.console.warn).not.toHaveBeenCalled();Ext.Error.ignore=false});it("should not throw an error if handled by Ext.Error.handle",function(){spyOn(Ext.global.console,"warn");var b=Ext.Error.handle;Ext.Error.handle=function(d){expect(d.msg).toEqual("foo");return true};try{Ext.Error.raise({msg:"foo"})}catch(c){expect("Error should not have been caught").toBe(true)}expect(Ext.global.console.warn).not.toHaveBeenCalled();Ext.Error.handle=b})});describe("passing an object with custom metadata",function(){it("should throw an error with matching metadata",function(){var b;try{Ext.Error.raise({msg:"Custom error",data:{foo:"bar"}})}catch(c){b=c}expect(b.msg).toEqual("Custom error");expect(b.data).not.toBe(null);expect(b.data.foo).toEqual("bar")});it("should log the complete metadata to the console",function(){spyOn(Ext.global.console,"dir").andCallFake(function(c){expect(c.msg).toEqual("Custom error");expect(c.data).not.toBe(null);expect(c.data.foo).toEqual("bar")});try{Ext.Error.raise({msg:"Custom error",data:{foo:"bar"}})}catch(b){}})});describe("originating from within a class defined by Ext",function(){Ext.define("CustomClass",{doSomething:function(c){Ext.Error.raise({msg:"Custom error",data:c,foo:"bar"})}});var b=Ext.create("CustomClass");it("should throw an error containing the source class and method",function(){var c;try{b.doSomething({extraData:"extra"})}catch(d){c=d}expect(c.msg).toEqual("Custom error");expect(c.sourceClass).toEqual("CustomClass");expect(c.sourceMethod).toEqual("doSomething");expect(c.toString()).toBe("CustomClass.doSomething(): Custom error")});it("should log the complete metadata to the console",function(){spyOn(Ext.global.console,"dir").andCallFake(function(d){expect(d.msg).toEqual("Custom error");expect(d.sourceClass).toEqual("CustomClass");expect(d.sourceMethod).toEqual("doSomething");expect(d.data).not.toBe(null);expect(d.data.extraData).not.toBe(null);expect(d.data.extraData).toEqual("extra");expect(d.foo).toEqual("bar")});try{b.doSomething({extraData:"extra"})}catch(c){}})})});describe("Throwing an an Ext.Error directly intantiated",function(){describe("Passing an string as constructor argument",function(){it("should contain a msg property with the given string as value",function(){expect(function(){throw new Ext.Error("expected message")}).toRaiseExtError("expected message")})})});xdescribe("Ext.deprecated",function(){it("should return a function that raises an error with the given suggestion",function(){Ext.ClassManager.enableNamespaceParseCache=false;Ext.define("Test.ThisClassContainsADeprecatedMethod",{deprecatedMethod:Ext.deprecated("use another function")});expect(function(){new Test.ThisClassContainsADeprecatedMethod().deprecatedMethod()}).toThrow('The method "Test.ThisClassContainsADeprecatedMethod.deprecatedMethod" has been removed. use another function');try{delete Test}catch(b){}Ext.ClassManager.enableNamespaceParseCache=true})})});