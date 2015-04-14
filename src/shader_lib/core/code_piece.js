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
    this.body_ids = []; // body ids sorted  by insert order
    this.includes = {}; // map for standard uniforms
    this.scope = "";
    this.order = typeof order !== 'undefined' ? order : Number.MAX_VALUE;
    this.order -= CodePiece.ORDER_MODIFIER;
}

CodePiece.prototype.getBodyIds = function()
{
    return this.body_ids;
};

CodePiece.prototype.getBody = function()
{
    return this.body_hash;
};


CodePiece.prototype.setPartialBody = function(s, other_order)
{

    if(s != ""){
        var id = s.hashCode();
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

CodePiece.prototype.setBody = function(s, other_order)
{

    if(s != ""){
        var id = s.hashCode();
        var new_order = typeof other_order !== 'undefined' ? other_order : this.order;
        if(this.body_hash[id] !== undefined){
            if(this.body_hash[id].order > new_order){
                this.body_hash[id].order = new_order;
                var index = this.body_ids.indexOf(id);
                this.body_ids.splice(index, 1);
                this.body_ids.unshift(id);
            }
        }  else {
            this.body_hash[id] = {"str":s, order:new_order}; // we save the order
            this.body_ids.unshift(id);
        }
       // console.log("str:"+ s + " new_order:"+this.body_hash[id].order+" old_order:"+old_order);
    }
};

CodePiece.prototype.getHeader = function()
{
    return this.header;
};

CodePiece.prototype.setHeader = function(map)
{
    // we set the includes object
    for(var k in map) this.header[k] = 1;
};

CodePiece.prototype.addHeaderLine = function(s)
{
    this.header[s] = 1;
};

// format needs to be {a:smth , b: smth};
CodePiece.prototype.setIncludes = function(inc)
{
    // we set the includes object
    for(var k in inc) this.includes[k] = 1;
};

// fragment or vertex
CodePiece.prototype.setScope = function(scope)
{
   this.scope = scope;
};

CodePiece.prototype.merge = function (input_code)
{
    //this.setBody( input_code.getBody().concat(this.body) );

    var ids = input_code.getBodyIds();
    var body_hash = input_code.getBody();
    for (var i = ids.length-1; i >= 0; i--) {
        var order = typeof body_hash[ids[i]].order !== 'undefined' ? body_hash[ids[i]].order : input_code.order;
        this.setBody(body_hash[ids[i]].str, order);
    }

    for (var inc in input_code.getHeader()) { this.header[inc] = input_code.header[inc]; }
    // we merge the includes
    for (var inc in input_code.includes) { this.includes[inc] = input_code.includes[inc]; }
};

CodePiece.prototype.partialMerge = function (input_code)
{
    //this.setBody( input_code.getBody().concat(this.body) );

    var ids = input_code.getBodyIds();
    var body_hash = input_code.getBody();
    var map = {};
    for (var i = ids.length-1; i >= 0; i--) {
        var order = typeof body_hash[ids[i]].order !== 'undefined' ? body_hash[ids[i]].order : input_code.order;
        var arr = this.setPartialBody(body_hash[ids[i]].str, order);
        if(arr !== null){
            map[arr[0]] = arr[1];
        }
    }

    for (var inc in input_code.getHeader()) { this.header[inc] = input_code.header[inc]; }
    // we merge the includes
    for (var inc in input_code.includes) { this.includes[inc] = input_code.includes[inc]; }

    return map;
};

CodePiece.prototype.clone = function()
{
    var cloned = new CodePiece();
    cloned.header = JSON.parse(JSON.stringify(this.header)); // map for custom uniforms or variants
    cloned.body_hash = JSON.parse(JSON.stringify(this.body_hash)); // body hashmap
    cloned.body_ids =  this.body_ids.slice(0);; // body ids sorted  by insert order
    cloned.includes = JSON.parse(JSON.stringify(this.includes)); // map for standard uniforms
    cloned.scope = this.scope;
    return cloned;
};


LiteGraph.CodeLib = {};