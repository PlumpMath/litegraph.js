
require(LGraph1ParamNode);
declare(LGraphCos);

function LGraphCos()
{
    this.code_name = "cos";
    this.output_types = {number:1, vec3:1, vec4:1, vec2:1};
    this.intput_types = {number:1, vec3:1, vec4:1, vec2:1};
    this.output_type = "float";

    LGraph1ParamNode.call( this);
    console.log(this);
}

LGraphCos.prototype = Object.create(LGraph1ParamNode); // we inherit from Entity
LGraphCos.prototype.constructor = LGraphSin;

LGraphCos.title = "Cos";
LGraphCos.desc = "cosine of input";


LGraph1ParamNode.inherit(LGraphCos);
LiteGraph.registerNodeType("math/Cos", LGraphCos);

