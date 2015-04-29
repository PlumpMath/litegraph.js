
//Constant
function LGraphVecToComps()
{
    this.addInput("vec","", {vec4:1,vec3:1,vec2:1});
    this.addOutput("x","", {float:1});
    this.addOutput("y","", {float:1});
    this.addOutput("z","", {float:1});
    this.addOutput("v","", {float:1});

}

LGraphVecToComps.title = "VecToComps";
LGraphVecToComps.desc = "Vector To Components";


LGraphVecToComps.prototype.onExecute = function()
{
    //this.processNodePath();
}

//LGraphVecToComps.prototype.processNodePath = function()
//{
//    var input = this.getInputNodePath(0);
//
//    this.insertIntoPath(input);
//
//    this.node_path[0] = input;
//    this.node_path[1] = input;
//    this.node_path[2] = input;
//    this.node_path[3] = input;
//
//
//
//}

LGraphVecToComps.prototype.processInputCode = function(scope)
{
    var input_code = this.getInputCode(0);

    if(input_code){
        var x_chan = input_code.clone();
        x_chan.output_var = input_code.getOutputVar()+".x";
        this.codes[0] = x_chan;
        var y_chan = input_code.clone();
        y_chan.output_var = input_code.getOutputVar()+".y";
        this.codes[1] = y_chan;
        var z_chan = input_code.clone();
        z_chan.output_var = input_code.getOutputVar()+".z";
        this.codes[2] = z_chan;
        var v_chan = input_code.clone();
        v_chan.output_var = input_code.getOutputVar()+".v";
        this.codes[3] = v_chan;
    }
}
LiteGraph.registerNodeType("coordinates/"+LGraphVecToComps.title , LGraphVecToComps);
