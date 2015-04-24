
//Constant
function LGraphIf()
{
    this._ctor(LGraphIf.title);
    this.addOutput("result","", null, {types_list: {float:1, vec3:1, vec4:1, vec2:1},  use_t:1});
    this.addInput("A","float", {float:1,vec4:1,vec3:1,vec2:1});
    this.addInput("B","float", {float:1,vec4:1,vec3:1,vec2:1});
    this.addInput("A>B","", null, {types_list: {float:1, vec3:1, vec4:1, vec2:1},  use_t:1});
    this.addInput("A<B","", null, {types_list: {float:1, vec3:1, vec4:1, vec2:1},  use_t:1});
    this.addInput("A==B","", null, {types_list: {float:1, vec3:1, vec4:1, vec2:1},  use_t:1});

    this.shader_piece = new PIf();
}

LGraphIf.title = "If";
LGraphIf.desc = "if between A and B";


LGraphIf.prototype.onExecute = function()
{
    this.processNodePath();
}

LGraphIf.prototype.processNodePath = function()
{
    var input1 = this.getInputNodePath(0);
    var input2 = this.getInputNodePath(1);
    var input3 = this.getInputNodePath(2);
    var input4 = this.getInputNodePath(3);
    var input5 = this.getInputNodePath(4);

    this.mergePaths(input1,input2);
    this.mergePaths(input1,input3);
    this.mergePaths(input1,input4);
    this.mergePaths(input1,input5);
    this.insertIntoPath(input1);


    this.node_path[0] = input1;


}

LGraphIf.prototype.processInputCode = function(scope)
{
    var A = this.getInputCode(0) || LiteGraph.EMPTY_CODE;
    var B = this.getInputCode(1) || LiteGraph.EMPTY_CODE;
    var gt = this.getInputCode(2) || LiteGraph.EMPTY_CODE;
    var lt = this.getInputCode(3) || LiteGraph.EMPTY_CODE;
    var eq = this.getInputCode(4) || LiteGraph.EMPTY_CODE;


    A.merge(B);
    var gt_str = A.partialMerge(gt);
    var lt_str = A.partialMerge(lt);
    var eq_str = A.partialMerge(eq);



    var output_code = this.codes[0] = this.shader_piece.getCode(
        {
            out_var:"if_"+this.id,
            out_type: this.getOutputType(),
            a: A.getOutputVar(),
            b: B.getOutputVar(),
            gt_out: gt.getOutputVar(),
            lt_out: lt.getOutputVar(),
            eq_out: eq.getOutputVar(),
            gt: gt_str[scope -1],
            lt: lt_str[scope -1],
            eq: eq_str[scope -1],
            scope:scope,
            order:this.order
        });

    output_code.merge(A);

}

LGraphIf.prototype.getOutputType = function()
{
    var obj = this.output_types ? this.output_types :  this.T_out_types;
    var string_type = LiteGraph.getOtputTypeFromMap(obj);
    return string_type;
}

LiteGraph.registerNodeType("math/"+LGraphIf.title , LGraphIf);
