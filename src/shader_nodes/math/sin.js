
require('1param_node');

function LGraphSin()
{
    this._ctor(LGraphSin.title);

    this.code_name = "sin";
    this.output_types = null;
    this.out_extra_info = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};
    this.intput_types = null;
    this.in_extra_info = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};
    LGraph1ParamNode.call( this);
}

LGraphSin.prototype = Object.create(LGraph1ParamNode); // we inherit from Entity

LGraphSin.prototype.constructor = LGraphSin;

LGraphSin.title = "Sin";
LGraphSin.desc = "sine of input";


LiteGraph.extendClass(LGraphSin,LGraph1ParamNode);
LiteGraph.registerNodeType("math/"+LGraphSin.title, LGraphSin);

