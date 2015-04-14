require('2param_node');


function LGraphOperation()
{
    this.output_types = null;
    this.out_extra_info = {types_list: {float:1},   use_t:1};
    this.intput_typesA = null;
    this.in_extra_infoA = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1}
    this.intput_typesB = null;
    this.in_extra_infoB = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};
//    this.output_types = {vec2:1, float:1, vec3:1,  vec4:1};
//    this.intput_typesA = {vec2:1, float:1, vec3:1,  vec4:1};
//    this.intput_typesB = {vec2:1, float:1, vec3:1, vec4:1};


    this.number_piece = new PConstant("float"); // hardcoded when the inputs are null
    this.properties = { A:0.0, B:0.0};

    LGraph2ParamNode.call( this);
}
LGraphOperation.prototype = Object.create(LGraph2ParamNode);
LGraphOperation.prototype.constructor = LGraphOperation;



LGraphOperation.prototype.infereTypes = function( output_slot, target_slot, node) {



    var out_types = node.getTypesFromOutputSlot(output_slot);
    if( Object.keys(out_types)[0] == "float")
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


LGraphOperation.prototype.onGetNullCode = function(slot, scope)
{
    if(slot == 0){
        var code = this.number_piece.getCode(
            {
                out_var:"float_A"+this.id,
                a:this.properties["A"].toFixed(3),
                scope:scope,
                order:this.order-1
            });
        return code;
    } else if(slot == 1){
        var code = this.number_piece.getCode(
            {
                out_var:"float_B"+this.id,
                a:this.properties["B"].toFixed(3),
                scope:scope,
                order:this.order-1
        });
        return code;
    }

}

LGraphOperation.prototype.onDrawBackground = function(ctx)
{
    this.inputs[0].label = "A";
    if(!this.isInputConnected(0))
        this.inputs[0].label += "="+this.properties["A"].toFixed(3);

    this.inputs[1].label = "B";
    if(!this.isInputConnected(1))
        this.inputs[1].label += "="+this.properties["B"].toFixed(3);
}



LiteGraph.extendClass(LGraphOperation,LGraph2ParamNode);


