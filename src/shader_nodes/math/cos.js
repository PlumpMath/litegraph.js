
require('1param_node');

function LGraphCos()
{
    this._ctor(LGraphCos.title);

    this.code_name = "cos";
    this.output_types = null;
    this.out_extra_info = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};
    this.intput_types = null;
    this.in_extra_info = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};
    LGraph1ParamNode.call( this);
}

LGraphCos.prototype = Object.create(LGraph1ParamNode); // we inherit from Entity
LGraphCos.prototype.constructor = LGraphCos;

LGraphCos.title = "Cos";
LGraphCos.desc = "cosine of input";


LiteGraph.extendClass(LGraphCos,LGraph1ParamNode);
LiteGraph.registerNodeType("math/"+LGraphCos.title, LGraphCos);

