//UVS
function LGraphPanner()
{
    this.addOutput("output","", {vec2:1});
    this.addInput("coordinate","", {vec2:1});
    this.addInput("time","", {float:1});
    this.properties = { SpeedX:1.0,
        SpeedY:1.0 };
    this.options = {    SpeedX:{min:-1.0, max:1.0, step:0.001},
        SpeedY:{min:-1.0, max:1.0, step:0.001}
    };
    this.shader_piece = new PPanner(); // hardcoded for testing
    this.uvs_piece = PUVs;
}

LGraphPanner.title = "Panner";
LGraphPanner.desc = "Moves the input";


LGraphPanner.prototype.onExecute = function()
{
   // this.processNodePath();
}

//LGraphPanner.prototype.processNodePath = function()
//{
//    var input1 = this.getInputNodePath(0);
//    var input2 = this.getInputNodePath(1);
//    this.mergePaths(input1,input2);
//    this.insertIntoPath(input1);
//    this.node_path[0] = input1;
//}


LGraphPanner.prototype.processInputCode = function(scope)
{

    var code_input = this.getInputCode(0) || this.onGetNullCode(0, scope);
    var code_time = this.getInputCode(1) || LiteGraph.EMPTY_CODE;

    //(out_var, input, dx, dy, scope, out_type)

    var output_code = this.codes[0] = this.shader_piece.getCode(
        { out_var:"panner_"+this.id,
        input:code_input.getOutputVar(),
        time:code_time.getOutputVar(),
        dx:this.properties.SpeedX.toFixed(3),
        dy:this.properties.SpeedY.toFixed(3),
        scope:scope,
        out_type:"vec2",
        order:this.order
        });

    if(code_time != LiteGraph.EMPTY_CODE)
        output_code.merge(code_time);
    output_code.merge(code_input);


}

LGraphPanner.prototype.onGetNullCode = function(slot, scope)
{
    if(slot == 0){
        var code = this.uvs_piece.getCode({order:this.order-1});
        return code;
    }

}

LiteGraph.registerNodeType("math/"+LGraphPanner.title, LGraphPanner);

