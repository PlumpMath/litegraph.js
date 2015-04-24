//UVS
function LGraphFresnel()
{
    this.addOutput("result","float", {float:1});
    this.addInput("normal","vec3", {vec3:1,vec4:1});
    this.addInput("exp","float", {float:1});

    this.shader_piece = new PFresnel(); // hardcoded for testing

}

LGraphFresnel.title = "Fresnel";
LGraphFresnel.desc = "Fresnel the input";


LGraphFresnel.prototype.onExecute = function()
{
    this.processNodePath();
}

LGraphFresnel.prototype.processNodePath = function()
{
    var input1 = this.getInputNodePath(0);
    var input2 = this.getInputNodePath(1);
    this.mergePaths(input1,input2);
    this.insertIntoPath(input1);
    this.node_path[0] = input1;
}


LGraphFresnel.prototype.processInputCode = function(scope)
{

    var code_normal = this.getInputCode(0) || LiteGraph.EMPTY_CODE;
    var code_exp = this.getInputCode(1) || LiteGraph.EMPTY_CODE;

    //(out_var, input, dx, dy, scope, out_type)

    var output_code = this.codes[0] = this.shader_piece.getCode(
        {
            out_var:"fresnel_"+this.id,
            normal:code_normal.getOutputVar(),
            exp:code_exp.getOutputVar(),
            scope:scope,
            order:this.order
        });

    if(code_normal != LiteGraph.EMPTY_CODE)
        output_code.merge(code_normal);
    output_code.merge(code_exp);


}

//LGraphFresnel.prototype.onGetNullCode = function(slot, scope)
//{
//
//
//}

LiteGraph.registerNodeType("math/"+LGraphFresnel.title, LGraphFresnel);

