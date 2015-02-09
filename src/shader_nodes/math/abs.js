
require(LGraph1ParamNode);
declare(LGraphAbs);

function LGraphAbs()
{
    this.code_name = "abs";
    this.output_types = {number:1, vec3:1, vec4:1, vec2:1};
    this.intput_types = {number:1, vec3:1, vec4:1, vec2:1};
    this.output_type = "float";

    LGraph1ParamNode.call( this);
    console.log(this);
}

LGraphAbs.prototype = Object.create(LGraph1ParamNode);
LGraphAbs.prototype.constructor = LGraphAbs;

LGraphAbs.title = "Abs";
LGraphAbs.desc = "Abs of input";


LGraph1ParamNode.inherit(LGraphAbs);
LiteGraph.registerNodeType("math/Abs", LGraphAbs);

