
require('1param_node');

function LGraphExp()
{
    this._ctor(LGraphExp.title);

    this.code_name = "exp2";
    this.output_types = null;
    this.out_extra_info = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};
    this.intput_types = null;
    this.in_extra_info = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};
    LGraph1ParamNode.call( this);
}

LGraphExp.prototype = Object.create(LGraph1ParamNode); // we inherit from Entity

LGraphExp.prototype.constructor = LGraphExp;

LGraphExp.title = "Exp2";
LGraphExp.desc = "Exp of input";


LiteGraph.extendClass(LGraphExp,LGraph1ParamNode);
LiteGraph.registerNodeType("math/"+LGraphExp.title, LGraphExp);

