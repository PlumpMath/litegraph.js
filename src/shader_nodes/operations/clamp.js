
require('3param_node');

function LGraphClamp()
{
    this._ctor(LGraphClamp.title);

    this.code_name = "clamp";
    this.output_types = null;
    this.out_extra_info = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};
    this.intput_typesA = null;
    this.in_extra_infoA = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1}
    this.intput_typesB = null;
    this.in_extra_infoB = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};
    this.intput_typesC = null;
    this.in_extra_infoC = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};


    this.properties = { min:0.0,
        max:1.5};

    this.number_piece = new PConstant("float");
    LGraph3ParamNode.call( this);
}

LGraphClamp.prototype = Object.create(LGraph3ParamNode); // we inherit from Entity
LGraphClamp.prototype.constructor = LGraphClamp;

LGraphClamp.title = "Clamp";
LGraphClamp.desc = "Clamp of input";



LGraphClamp.prototype.onGetNullCode = function(slot, scope)
{
    if(slot == 1){
        var code = this.number_piece.getCode({
            out_var:"float_"+this.id+""+ slot,
            a:this.properties["min"].toFixed(3),
            scope:scope,
            order:this.order-1
        });
        return code;
    }
    else if(slot == 2){
        var code = this.number_piece.getCode({
            out_var:"float_"+this.id+""+ slot,
            a:this.properties["max"].toFixed(3),
            scope:scope,
            order:this.order-1
        });
        return code;
    }

    return LiteGraph.EMPTY_CODE;

}

LGraphClamp.prototype.onDrawBackground = function(ctx)
{
    //show the current value
    this.inputs[0].label = "x";

    this.inputs[1].label = "min";
    if(!this.isInputConnected(1))
        this.inputs[1].label += "="+this.properties["min"].toFixed(3);
    this.inputs[2].label = "max";
    if(!this.isInputConnected(2))
        this.inputs[2].label += "="+this.properties["max"].toFixed(3);

}

LiteGraph.extendClass(LGraphClamp,LGraph3ParamNode);
LiteGraph.registerNodeType("operations/"+LGraphClamp.title, LGraphClamp);

