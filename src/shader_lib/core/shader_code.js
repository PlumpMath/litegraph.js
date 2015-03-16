/**
 * Created by vik on 26/01/2015.
 */

require('./code_piece');


function ShaderCode(vertex, fragment, out_var)
{
    this.vertex = vertex || new CodePiece();
    this.fragment = fragment || new CodePiece();
    this.output_var = out_var || "";
}

ShaderCode.prototype.getOutputVar = function()
{
    return this.output_var;
};

ShaderCode.prototype.merge = function (other_code)
{
    this.vertex.order = this.order;
    this.fragment.order = this.order;
    this.vertex.merge(other_code.vertex);
    this.fragment.merge(other_code.fragment);

};

ShaderCode.prototype.clone = function ()
{
    var vertex = this.vertex.clone();
    var fragment = this.fragment.clone();
    var cloned = new ShaderCode(vertex,fragment,this.output_var);
    cloned.order = this.order;
    return cloned;
};



LiteGraph.EMPTY_CODE = new ShaderCode();