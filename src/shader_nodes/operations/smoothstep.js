
require('3param_node');

function LGraphSmooth()
{
    this._ctor(LGraphSmooth.title);

    this.code_name = "smoothstep";
    this.output_types = null;
    this.out_extra_info = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};
    this.intput_typesA = null;
    this.in_extra_infoA = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1}
    this.intput_typesB = null;
    this.in_extra_infoB = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};
    this.intput_typesC = null;
    this.in_extra_infoC = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};


    this.properties = { lower:0.0,
                        upper:1.5};

    this.number_piece = new PConstant("float");
    LGraph3ParamNode.call( this);
}

LGraphSmooth.prototype = Object.create(LGraph3ParamNode); // we inherit from Entity
LGraphSmooth.prototype.constructor = LGraphSmooth;

LGraphSmooth.title = "SmoothStep";
LGraphSmooth.desc = "smoothstep of input";

LGraphSmooth.prototype.infereTypes = function( output_slot, target_slot, node) {
    var out_types = node.getTypesFromOutputSlot(output_slot);
    if( (target_slot == 0 || target_slot == 1) && Object.keys(out_types)[0] == "float")
        return;
    this.connectTemplateSlot();


    var input = this.inputs[target_slot];
    if (input.use_t && Object.keys(this.T_in_types).length === 0) {

        this.T_in_types["float"] = 1; // we hardcode the float as operation always accept float in one of the inputs
        for (var k in out_types)
            this.T_in_types[k] = out_types[k];
        for (var k in out_types)
            this.T_out_types[k] = out_types[k];
    }
}

LGraphMix.prototype.disconnectTemplateSlot = function(input_slot){
    if(input_slot == 0 || input_slot == 1 ) return;

    if(this.in_conected_using_T > 0)
        this.in_conected_using_T--;
    this.resetTypes(input_slot);
}

LGraphSmooth.prototype.onGetNullCode = function(slot, scope)
{
    if(slot == 0){
        var code = this.number_piece.getCode({
                out_var:"float_"+this.id+""+ slot,
            a:this.properties["lower"].toFixed(3),
            scope:scope,
            order:this.order-1
        });
        return code;
    }
    else if(slot == 1){
        var code = this.number_piece.getCode({
            out_var:"float_"+this.id+""+ slot,
            a:this.properties["upper"].toFixed(3),
            scope:scope,
            order:this.order-1
        });
        return code;
    }

    return LiteGraph.EMPTY_CODE;

}

LGraphSmooth.prototype.onDrawBackground = function(ctx)
{
    //show the current value
    this.inputs[0].label = "lower";
    if(!this.isInputConnected(0))
        this.inputs[0].label += "="+this.properties["lower"].toFixed(3);
    this.inputs[1].label = "upper";
    if(!this.isInputConnected(1))
        this.inputs[1].label += "="+this.properties["upper"].toFixed(3);
}

LiteGraph.extendClass(LGraphSmooth,LGraph3ParamNode);
LiteGraph.registerNodeType("math/"+LGraphSmooth.title, LGraphSmooth);

