
//Constant
function LGraphCompsToVec()
{
    this.addOutput("result","vec4", {float:1,vec4:1,vec3:1,vec2:1});
    this.addInput("x","float", {float:1});
    this.addInput("y","float", {float:1});
    this.addInput("z","float", {float:1});
    this.addInput("v","float", {float:1});

    this.shader_piece = new PConstant("vec4");

}

LGraphCompsToVec.title = "CompsToVec";
LGraphCompsToVec.desc = "Components To Vector";


LGraphCompsToVec.prototype.onExecute = function()
{
    this.processNodePath();
}

LGraphCompsToVec.prototype.processNodePath = function()
{
    var input1 = this.getInputNodePath(0);
    var input2 = this.getInputNodePath(1);
    var input3 = this.getInputNodePath(2);
    var input4 = this.getInputNodePath(3);

    this.mergePaths(input1,input2);
    this.mergePaths(input1,input3);
    this.mergePaths(input1,input4);
    this.insertIntoPath(input1);


    this.node_path[0] = input1;


}

LGraphCompsToVec.prototype.processInputCode = function(scope)
{
    var comps = 0;
    var x = this.getInputCode(0) || LiteGraph.EMPTY_CODE;
    comps += x.getOutputVar() ? 1 : 0;
    var y = this.getInputCode(1) || LiteGraph.EMPTY_CODE;
    comps += y.getOutputVar() ? 1 : 0;
    var z = this.getInputCode(2) || LiteGraph.EMPTY_CODE;
    comps += z.getOutputVar() ? 1 : 0;
    var v = this.getInputCode(3) || LiteGraph.EMPTY_CODE;
    comps += v.getOutputVar() ? 1 : 0;
    var type = (comps < 2) ? "float" : "vec"+comps;

    this.shader_piece.setType(type);
    var output_code = this.codes[0] = this.shader_piece.getCode(
        { out_var:type+"_"+this.id,
            a:this.valueToString(type,comps, x.getOutputVar(),y.getOutputVar(),z.getOutputVar(),v.getOutputVar()),
            scope:scope,
            order:this.order
        });
    output_code.merge(x);
    output_code.merge(y);
    output_code.merge(z);
    output_code.merge(v);

}
LGraphCompsToVec.prototype.valueToString = function(type,comps,x,y,z,v)
{
    var comps_str = Array.prototype.slice.call(arguments,2,2+ parseInt(comps));
    var val = comps_str.join(",");
    val = type+"("+val+")";
    return val;

}

LiteGraph.registerNodeType("coordinates/"+LGraphCompsToVec.title , LGraphCompsToVec);
