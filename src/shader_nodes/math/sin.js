
require(LGraph1ParamNode);
declare(LGraphSin);

function LGraphSin()
{
    this.code_name = "sin";
    this.output_types = {number:1, vec3:1, vec4:1, vec2:1};
    this.intput_types = {number:1, vec3:1, vec4:1, vec2:1};
    this.output_type = "float";
    LGraph1ParamNode.call( this);
    console.log(this);
}

LGraphSin.prototype = Object.create(LGraph1ParamNode); // we inherit from Entity
LGraphSin.prototype.constructor = LGraphSin;

LGraphSin.title = "Sin";
LGraphSin.desc = "sine of input";


LGraph1ParamNode.inherit(LGraphSin);
LiteGraph.registerNodeType("math/"+LGraphSin.title, LGraphSin);

