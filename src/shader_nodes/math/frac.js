
require('1param_node');

function LGraphFrac()
{
    this._ctor(LGraphFrac.title);
    this.code_name = "fract";
    this.output_types = null;
    this.out_extra_info = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};
    this.intput_types = null;
    this.in_extra_info = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};
    LGraph1ParamNode.call( this);
}

LGraphFrac.prototype = Object.create(LGraph1ParamNode); // we inherit from Entity
LGraphFrac.prototype.constructor = LGraphFrac;

LGraphFrac.title = "Fract";
LGraphFrac.desc = "fract of input";


LiteGraph.extendClass(LGraphFrac,LGraph1ParamNode);
LiteGraph.registerNodeType("math/"+LGraphFrac.title, LGraphFrac);

