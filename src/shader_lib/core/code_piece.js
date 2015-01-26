/**
 * Created by vik on 26/01/2015.
 */

declare(CodePiece);

function CodePiece()
{
    this.header = {}; // map for custom uniforms or variants
    this.body = "";
    this.includes = {}; // map for standard uniforms
    this.output_var = "";
    this.scope = "";
}


CodePiece.prototype.getBody = function()
{
    return this.body;
};

CodePiece.prototype.setBody = function(s)
{
    this.body = s;
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
    this.setBody( input_code.getBody().concat(this.body) );

    for (var inc in input_code.getHeader()) { this.header[inc] = input_code.includes[inc]; }
    // we merge the includes
    for (var inc in input_code.includes) { this.includes[inc] = input_code.includes[inc]; }
};