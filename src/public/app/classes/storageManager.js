(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        //define(["jquery", "underscore"], factory);
        define(factory);
    } else if (typeof exports === "object") {
        //module.exports = factory(require("jquery"), require("underscore"));
        module.exports = factory();
    } else {
        //root.Requester = factory(root.$, root._);
        root.Storage = factory();
    }
}(this, function (/*$, _*/) {
    // this is where I defined my module implementation

    var p = {
        isJSON : function(str){
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        },
        stringConstructor : "test".constructor,
        arrayConstructor : [].constructor,
        objectConstructor : {}.constructor,
        whatIsIt : function(object) {
            if (object === null) {
                return "null";
            }
            else if (object === undefined) {
                return "undefined";
            }
            else if (object.constructor === this.stringConstructor) {
                return "String";
            }
            else if (object.constructor === this.arrayConstructor) {
                return "Array";
            }
            else if (object.constructor === this.objectConstructor) {
                return "Object";
            }
            else {
                return "don't know";
            }
        }
    };

    var Storage = { 
        local : function(){
            if(arguments.length == 0){
                throw new Error("Arguments not passed");
            }

            if(arguments.length == 1){
                //get
                var result = window.localStorage.getItem(arguments[0]);
                if(p.isJSON(result)){
                    return JSON.parse(result);
                }

                return result;
            }

            if(arguments.length == 2){
                //set
                if(p.whatIsIt(arguments[1]) == 'Object')
                    window.localStorage.setItem(arguments[0], JSON.stringify(arguments[1]));   
                else{
                    window.localStorage.setItem(arguments[0], arguments[1]);
                }
            }    
        }
    };

    return Storage;
}));