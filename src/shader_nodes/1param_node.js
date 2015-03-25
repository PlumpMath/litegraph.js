
function LGraph1ParamNode()
{
    this.addOutput("result","notype", this.getOutputTypes(), this.getOutputExtraInfo() );
    this.addInput("A","notype", this.getInputTypes(), this.getInputExtraInfo());
    this.shader_piece = LiteGraph.CodeLib[this.getCodeName()]; // hardcoded for testing

}

LGraph1ParamNode.prototype.constructor = LGraph1ParamNode;


LGraph1ParamNode.prototype.onExecute = function()
{
    this.processNodePath();
}

LGraph1ParamNode.prototype.processNodePath = function()
{
    var input = this.getInputNodePath(0);
    input.push(this);
    this.node_path[0] = input;
}


LGraph1ParamNode.prototype.processInputCode = function(scope)
{

    var code_A = this.getInputCode(0); // normal

    if(code_A){
        // (output, incident, normal)
        var output_code = this.codes[0] = this.shader_piece.getCode(this.getCodeName()+"_"+this.id, code_A.getOutputVar(), scope, this.getOutputType()); // output var must be fragment
        output_code.setOrder(this.order);
        output_code.merge(code_A);
    }

}

LGraph1ParamNode.prototype.getOutputType = function()
{
    var obj = this.output_types ? this.output_types :  this.T_types;
    return Object.keys(obj)[0];
}


LGraph1ParamNode.prototype.getOutputTypes = function()
{
    return this.output_types ? this.output_types :  this.T_types;
}

LGraph1ParamNode.prototype.getInputTypes = function()
{
    return this.intput_types ? this.intput_types :  this.T_types;
}

LGraph1ParamNode.prototype.getScope = function()
{
    return CodePiece.FRAGMENT; // TODO need to really check the scope
}

LGraph1ParamNode.prototype.getCodeName = function()
{
    return this.code_name;
}

LGraph1ParamNode.prototype.getInputExtraInfo = function()
{
    return this.in_extra_info;
}

LGraph1ParamNode.prototype.getOutputExtraInfo = function()
{
    return this.out_extra_info;
}

//LiteGraph.registerNodeType("texture/reflect", LGraphReflect);

