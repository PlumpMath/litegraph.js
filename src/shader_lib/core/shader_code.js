/**
 * Created by vik on 26/01/2015.
 */

require(CodePiece);
declare(ShaderCode);

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
    this.vertex.merge(other_code.vertex);
    this.fragment.merge(other_code.fragment);

};