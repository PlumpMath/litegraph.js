/**
 * Created by vik on 26/01/2015.
 */

declare(CodePiece);

function CodePiece()
{
    this.header = {}; // map for custom uniforms or variants
    this.body_hash = {}; // upper part of the body for vars like cameratopixel
    this.body_ids = [];
    this.includes = {}; // map for standard uniforms
    this.output_var = "";
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
    if(!this.body_hash[id]){
        this.body_hash[id] = s;
        this.body_ids.push(id);
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

CodePiece.prototype.setOutputVar = function(out)
{
    this.output_var = out;
};

CodePiece.prototype.getOutputVar = function()
{
    return this.output_var;
};

// fragment or vertex
CodePiece.prototype.setScope = function(scope)
{
   this.scope = scope;
};

CodePiece.prototype.merge = function (input_code)
{
    //this.setBody( input_code.getBody().concat(this.body) );
    var body_hash = input_code.getBody();
    for (var i = 0, l = body_hash.length; i < l; i++)
        this.setBody(body_hash[i]);
    for (var inc in input_code.getHeader()) { this.header[inc] = input_code.header[inc]; }
    // we merge the includes
    for (var inc in input_code.includes) { this.includes[inc] = input_code.includes[inc]; }
};