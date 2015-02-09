
//Constant
function LGraphVecToComps()
{
    this.addInput("vec","vec4", {vec4:1,vec3:1,vec2:1});
    this.addOutput("x","number", {number:1});
    this.addOutput("y","number", {number:1});
    this.addOutput("z","number", {number:1});
    this.addOutput("v","number", {number:1});

}

LGraphVecToComps.title = "VecToComps";
LGraphVecToComps.desc = "Vector To Components";


LGraphVecToComps.prototype.onExecute = function()
{
    var input_code = this.getInputCode(0);

    if(input_code){
        var x_chan = input_code.clone();
        x_chan.output_var = color_output.getOutputVar()+".x";
        this.codes[0] = x_chan;
        var y_chan = input_code.clone();
        y_chan.output_var = input_code.getOutputVar()+".y";
        this.codes[1] = y_chan;
        var z_chan = input_code.clone();
        z_chan.output_var = input_code.getOutputVar()+".z";
        this.codes[2] = z_chan;
        var v_chan = input_code.clone();
        v_chan.output_var = input_code.getOutputVar()+".v";
        this.codes[4] = v_chan;

    }
}



LiteGraph.registerNodeType("coordinates/VecToComps", LGraphVecToComps);