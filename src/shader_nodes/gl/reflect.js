//UVS
function LGraphReflect()
{
    this.addOutput("reflect_vec","vec3");
    this.addInput("normal","vec3");
    this.addInput("vector","vec3");

    this.shader_piece = PReflect; // hardcoded for testing
}

LGraphReflect.title = "ReflectVector";
LGraphReflect.desc = "To reflect a vector3";


LGraphReflect.prototype.onExecute = function()
{
    this.processInputCode();
}


LGraphReflect.prototype.processInputCode = function()
{

    var in_codes_normal = this.getInputCode(0); // normal
    var in_codes_incident = this.getInputCode(1); // inident vector

    // (output, incident, normal)
    this.codes = this.shader_piece.getCode("reflect_"+this.id, in_codes_incident[1].getOutputVar(), in_codes_normal[1].getOutputVar()); // output var must be fragment

    this.codes[0].merge(in_codes_normal[0]);
    this.codes[1].merge(in_codes_normal[1]);
    this.codes[0].merge(in_codes_incident[0]);
    this.codes[1].merge(in_codes_incident[1]);

}

LiteGraph.registerNodeType("texture/reflect", LGraphReflect);

