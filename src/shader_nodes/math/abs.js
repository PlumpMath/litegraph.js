
require('1param_node');


function LGraphAbs()
{
    this._ctor(LGraphAbs.title);

    this.code_name = "abs";
    this.output_types = null;
    this.out_extra_info = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};
    this.intput_types = null;
    this.in_extra_info = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};

    LGraph1ParamNode.call( this);
}

LGraphAbs.prototype = Object.create(LGraph1ParamNode);
LGraphAbs.prototype.constructor = LGraphAbs;

LGraphAbs.title = "Abs";
LGraphAbs.desc = "Abs of input";


LiteGraph.extendClass(LGraphAbs,LGraph1ParamNode);
LiteGraph.registerNodeType("math/"+LGraphAbs.title, LGraphAbs);

