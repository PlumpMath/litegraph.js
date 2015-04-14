
//Constant
function LGraphIf()
{
    this.addOutput("result","vec4", {float:1,vec4:1,vec3:1,vec2:1});
    this.addInput("A","float", {float:1,vec4:1,vec3:1,vec2:1});
    this.addInput("B","float", {float:1,vec4:1,vec3:1,vec2:1});
    this.addInput("A>B","float", {float:1,vec4:1,vec3:1,vec2:1});
    this.addInput("A<B","float", {float:1,vec4:1,vec3:1,vec2:1});
    this.addInput("A==B","float", {float:1,vec4:1,vec3:1,vec2:1});

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

    var input = input1.concat(input2);
    input = input.concat(input3);
    input = input.concat(input4);
    input = input.concat(input5);
    input.push(this);
    this.node_path[0] = input;


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
            out_type: "vec3",
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


LiteGraph.registerNodeType("coordinates/"+LGraphIf.title , LGraphIf);
