/**
 * Created by vik on 26/01/2015.
 */

declare(CodePiece);

CodePiece.VERTEX = 1;
CodePiece.FRAGMENT = 2;
CodePiece.BOTH = 3;

function CodePiece()
{
    this.header = {}; // map for custom uniforms or variants
    this.body_hash = {}; // body hashmap
    this.body_ids = []; // body ids sorted  by insert order
    this.includes = {}; // map for standard uniforms
    this.scope = "";
}

CodePiece.prototype.getBodyIds = function()
{
    return this.body_ids;
};

CodePiece.prototype.getBody = function()
{
    return this.body_hash;
};

CodePiece.prototype.setBody = function(s)
{
    var id = s.hashCode();
    if(typeof(this.body_hash[id]) === 'undefined' ){
        this.body_hash[id] = s;
        this.body_ids.unshift(id);
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
        this.setBody(body_hash[ids[i]]);
    }

    for (var inc in input_code.getHeader()) { this.header[inc] = input_code.header[inc]; }
    // we merge the includes
    for (var inc in input_code.includes) { this.includes[inc] = input_code.includes[inc]; }
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