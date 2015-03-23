//UVS
function LGraphPanner()
{
    this.addOutput("output","vec2", {vec2:1, vec3:1});
    this.addInput("coordinate","vec2", {vec3:1,vec2:1});
    this.addInput("time","float", {float:1});
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
    this.processInputCode();
}


LGraphPanner.prototype.processInputCode = function()
{

    var code_input = this.getInputCode(0) || this.onGetNullCode(0);
    var code_time = this.getInputCode(1) || LiteGraph.EMPTY_CODE;

    //(out_var, input, dx, dy, scope, out_type)
    var output_code = this.codes[0] = this.shader_piece.getCode("panner_"+this.id, code_input.getOutputVar(), code_time.getOutputVar() ,this.properties.SpeedX.toFixed(3), this.properties.SpeedY.toFixed(3), CodePiece.FRAGMENT, "vec2"); // output var must be fragment
    output_code.order = this.order;

    if(code_time != LiteGraph.EMPTY_CODE)
        output_code.merge(code_time);
    output_code.merge(code_input);


}

LGraphPanner.prototype.onGetNullCode = function(slot)
{
    if(slot == 0)
        return this.uvs_piece.getCode();

}

LiteGraph.registerNodeType("operations/"+LGraphPanner.title, LGraphPanner);

