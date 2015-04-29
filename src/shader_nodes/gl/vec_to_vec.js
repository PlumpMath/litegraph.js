
//Constant
function LGraphVecToVec()
{
    this.addInput("vec","", null, {types_list: {float:1, vec3:1, vec4:1, vec2:1},  use_t:1});
    this.addOutput("number","float", {float:1});
    this.addOutput("vec2","vec2", {vec2:1});
    this.addOutput("vec3","vec3",  {vec3:1});
    this.addOutput("vec4","vec4", {vec4:1});

    this.shader_piece = new PVecToVec();

}

LGraphVecToVec.title = "VecToVec";
LGraphVecToVec.desc = "VectorX To VectorY";


LGraphVecToVec.prototype.onExecute = function()
{
    //this.processNodePath();
}
//
//LGraphVecToVec.prototype.processNodePath = function()
//{
//    var input1 = this.getInputNodePath(0);
//
//
//    this.insertIntoPath(input1);
//
//
//    this.node_path[0] = input1;
//    this.node_path[1] = input1;
//    this.node_path[2] = input1;
//    this.node_path[3] = input1;
//
//
//}

LGraphVecToVec.prototype.processInputCode = function(scope)
{

    var v = this.getInputCode(0) || LiteGraph.EMPTY_CODE;

    var output_code = this.codes[0] = this.shader_piece.getCode(
        {   out_var:"float_"+this.id,
            out_type:"float",
            in_type:this.getInputType(),
            a: v.getOutputVar(),
            scope:scope,
            order:this.order
        });
    output_code.merge(v);

    output_code = this.codes[1] = this.shader_piece.getCode(
        {   out_var:"vec2_"+this.id,
            out_type:"vec2",
            in_type:this.getInputType(),
            a: v.getOutputVar(),
            scope:scope,
            order:this.order
        });
    output_code.merge(v);

    output_code = this.codes[2] = this.shader_piece.getCode(
        {   out_var:"vec3_"+this.id,
            out_type:"vec3",
            in_type:this.getInputType(),
            a: v.getOutputVar(),
            scope:scope,
            order:this.order
        });
    output_code.merge(v);

    output_code = this.codes[3] = this.shader_piece.getCode(
        {   out_var:"vec4_"+this.id,
            out_type:"vec4",
            in_type:this.getInputType(),
            a: v.getOutputVar(),
            scope:scope,
            order:this.order
        });
    output_code.merge(v);

}


LGraphVecToVec.prototype.getInputType = function()
{
    var obj = this.T_in_types;
    var string_type = LiteGraph.getOtputTypeFromMap(obj);
    return string_type;
}

LiteGraph.registerNodeType("coordinates/"+LGraphVecToVec.title , LGraphVecToVec);
