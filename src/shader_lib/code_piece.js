/**
 * Created by vik on 26/01/2015.
 */


function CodePiece()
{
    this.header = ""; // for custom uniforms or variants
    this.body = "";
    this.includes = {}; // for standard uniforms
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

CodePiece.prototype.setHeader = function(s)
{
    this.header = s;
};

CodePiece.prototype.addHeaderLine = function(s)
{
    this.header += s;
    this.includes[s] = 1; // this check a whole line, very inneficient
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

// fragment or vertex
CodePiece.prototype.setScope = function(scope)
{
   this.scope = scope;
};

CodePiece.prototype.merge = function (input_code)
{
    this.setBody( input_code.getBody().concat(this.body) );
    this.setHeader( input_code.getHeader().concat(this.header) );
    // we merge the includes
    for (var inc in input_code.includes) { this.includes[inc] = input_code.includes[inc]; }
};