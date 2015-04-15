/**
 * Created by vik on 26/01/2015.
 */


CodePiece.VERTEX = 1;
CodePiece.FRAGMENT = 2;
CodePiece.BOTH = 3;
CodePiece.ORDER_MODIFIER = 0;
function CodePiece(order)
{
    this.header = {}; // map for custom uniforms or variants
    this.body_hash = {}; // body hashmap
    //this.body_ids = []; // body ids sorted  by insert order
    this.includes = {}; // map for standard uniforms
    this.scope = "";
    this.order = typeof order !== 'undefined' ? order : Number.MAX_VALUE;
    this.order -= CodePiece.ORDER_MODIFIER;
}

//CodePiece.prototype.getBodyIds = function()
//{
//    return this.body_ids;
//};

CodePiece.prototype.getBody = function()
{
    return this.body_hash;
};


CodePiece.prototype.setPartialBody = function(s, other_order, id)
{
    s = s || "";
    if(s != ""){
        id = id || s.hashCode();
        var new_order = typeof other_order !== 'undefined' ? other_order : this.order;
        if(this.body_hash[id] !== undefined) {
            if(this.body_hash[id].order > new_order){
                return [s, other_order];
            }
        }  else {
            return [s, other_order];
        }
    }
    return null;
};


CodePiece.prototype.setBody = function(s, other_order , id)
{
    var body_item;
    s = s || "";
    if(s !== ""){
        id = id || s.hashCode();
        body_item = this.body_hash[id];
        other_order = typeof other_order !== 'undefined' ? other_order : this.order;
        if(body_item !== undefined){
            if(body_item.order > other_order){
                body_item.order = other_order;
            }
        }  else {
            this.body_hash[id] = {"str":s, order:other_order}; // we save the order
            //this.body_ids.unshift(id);
        }
       // console.log("str:"+ s + " new_order:"+this.body_hash[id].order+" old_order:"+old_order);
    }
};

CodePiece.prototype.getHeader = function()
{
    return this.header;
};

CodePiece.prototype.setHeaderFromHashMap = function(map)
{
    var objKeys = Object.keys(map);
    var id;
    for (var i = 0, l = objKeys.length; i < l; i++) {
        id = objKeys[i];
        this.header[id] = map[id];
    }
};

CodePiece.prototype.setHeaderFromMap = function(map)
{
    var objKeys = Object.keys(map);
    var s;
    for (var i = 0, l = objKeys.length; i < l; i++) {
        s = objKeys[i];
        this.header[s.hashCode()] = s;
    }

};

CodePiece.prototype.addHeaderLine = function(s)
{
    var k = s.hashCode();
    this.header[k] = s;
};


// format needs to be {a:smth , b: smth};
CodePiece.prototype.setIncludesFromHashMap = function(map)
{
    var objKeys = Object.keys(map);
    var id;
    for (var i = 0, l = objKeys.length; i < l; i++) {
        id = objKeys[i];
        this.includes[id] = map[id];
    }


};

// format needs to be {a:smth , b: smth};
CodePiece.prototype.setIncludesFromMap = function(map)
{
    var objKeys = Object.keys(map);
    var s;
    for (var i = 0, l = objKeys.length; i < l; i++) {
        s = objKeys[i];
        this.includes[s.hashCode()] = s;
    }

};

CodePiece.prototype.isLineIncluded = function(s)
{
    var id = s.hashCode();
    return this.includes.hasOwnProperty(id);
};

// fragment or vertex
CodePiece.prototype.setScope = function(scope)
{
   this.scope = scope;
};

CodePiece.prototype.merge = function (input_code)
{

    var body_hash = input_code.getBody();
    var objKeys = Object.keys(body_hash);
    var id;
    var order;
    for (var i = 0, l = objKeys.length; i < l; i++) {
        id = objKeys[i];
        order = body_hash[id].order;
        order = typeof order !== 'undefined' ? order : input_code.order;
        this.setBody( body_hash[id].str, order, id);
    }

    this.setHeaderFromHashMap(input_code.getHeader());
    this.setIncludesFromHashMap(input_code.includes);

};

CodePiece.prototype.partialMerge = function (input_code)
{
    //this.setBody( input_code.getBody().concat(this.body) );


    var body_hash = input_code.getBody();
    var map = {};
    var objKeys = Object.keys(body_hash);
    var id;
    var order;
    for (var i = 0, l = objKeys.length; i < l; i++) {
        id = objKeys[i];
        order = body_hash[id].order;
        order = typeof order !== 'undefined' ? order : input_code.order;
        var arr = this.setPartialBody(body_hash[id].str, order, id);
        if(arr !== null){
            map[arr[0]] = arr[1];
        }
    }

    this.setHeaderFromHashMap(input_code.getHeader());
    this.setIncludesFromHashMap(input_code.includes);

    return map;
};

CodePiece.prototype.clone = function()
{
//    var cloned = new CodePiece();
//    cloned.header = JSON.parse(JSON.stringify(this.header)); // map for custom uniforms or variants
//    cloned.body_hash = JSON.parse(JSON.stringify(this.body_hash)); // body hashmap
//    //cloned.body_ids =  this.body_ids.slice(0);; // body ids sorted  by insert order
//    cloned.includes = JSON.parse(JSON.stringify(this.includes)); // map for standard uniforms
//    cloned.scope = this.scope;
//    return cloned;
    return this;
};


LiteGraph.CodeLib = {};