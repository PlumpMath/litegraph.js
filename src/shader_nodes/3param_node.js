

function LGraph3ParamNode()
{
    this.addOutput("Result","", this.getOutputTypes(), this.getOutputExtraInfo() );
    this.addInput("A","", this.getInputTypesA(), this.getInputExtraInfoA());
    this.addInput("B","", this.getInputTypesB(), this.getInputExtraInfoB());
    this.addInput("C","", this.getInputTypesC(), this.getInputExtraInfoC());
    this.shader_piece = LiteGraph.CodeLib[this.getCodeName()]; // hardcoded for testing

}

LGraph3ParamNode.prototype.constructor = LGraph3ParamNode;

LGraph3ParamNode.prototype.onExecute = function()
{
    this.processNodePath();
}

LGraph3ParamNode.prototype.processInputCode = function(scope)
{

    var output_code = LiteGraph.EMPTY_CODE;

    var code_A = this.getInputCode(0) || this.onGetNullCode(0, scope);
    var code_B = this.getInputCode(1) || this.onGetNullCode(1, scope);
    var code_C = this.getInputCode(2) || this.onGetNullCode(2, scope);
    if(code_A && code_B && code_C){
        // (out_var, a, b, c, scope, out_type)

        output_code = this.codes[0] = this.shader_piece.getCode(
                { out_var:this.getCodeName() + "_" + this.id,
                    a:code_A.getOutputVar(),
                    b:code_B.getOutputVar(),
                    c:code_C.getOutputVar(),
                    scope:scope,
                    out_type:this.getOutputType(),
                    order:this.order
                }); // output var must be fragment
        // if the alpha is an input, otherwise hardcoded
        // we need to set the order into the code so the lines set up correctly
        output_code.setOrder(this.order);

        if(code_C){
            output_code.merge(code_C);
        }
        output_code.merge(code_A);
        output_code.merge(code_B);
    }


}

LGraph3ParamNode.prototype.processNodePath = function()
{
    var input1 = this.getInputNodePath(0);
    var input2 = this.getInputNodePath(1);
    var input3 = this.getInputNodePath(2);
    var input = input1.concat(input2);
    var input = input.concat(input3);
    input.push(this);
    this.node_path[0] = input;
    this.node_path[1] = input.slice(0);
    this.node_path[2] = input.slice(0);
}


LGraph3ParamNode.prototype.getOutputTypes = function()
{
    return this.output_types ? this.output_types :  this.T_out_types;
}

LGraph3ParamNode.prototype.getInputTypesA = function()
{
    return this.intput_typesA ? this.intput_typesA :  this.T_in_types;
}

LGraph3ParamNode.prototype.getInputTypesB = function()
{
    return this.intput_typesB ? this.intput_typesB :  this.T_in_types;
}

LGraph3ParamNode.prototype.getInputTypesC = function()
{
    return this.intput_typesC ? this.intput_typesC :  this.T_in_types;
}

LGraph3ParamNode.prototype.getOutputType = function()
{
    var obj = this.output_types ? this.output_types :  this.T_out_types;
    return Object.keys(obj)[0];
}

LGraph3ParamNode.prototype.getScope = function()
{
    return CodePiece.FRAGMENT; // TODO need to really check the scope
}

LGraph3ParamNode.prototype.getCodeName = function()
{
    return this.code_name;
}

LGraph3ParamNode.prototype.getInputExtraInfoA = function()
{
    return this.in_extra_infoA;
}

LGraph3ParamNode.prototype.getInputExtraInfoB = function()
{
    return this.in_extra_infoB;
}

LGraph3ParamNode.prototype.getInputExtraInfoC = function()
{
    return this.in_extra_infoC;
}

LGraph3ParamNode.prototype.getOutputExtraInfo = function()
{
    return this.out_extra_info;
}


//LiteGraph.registerNodeType("texture/reflect", LGraphReflect);

