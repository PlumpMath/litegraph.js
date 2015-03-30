require('./operation');


function LGraphPow()
{
    this._ctor(LGraphPow.title);
    this.code_name = "pow";
    LGraphOperation.call( this);
    this.inputs[0].label = "Value";
    this.inputs[1].label = "Exp";
}


LGraphPow.title = "Pow";
LGraphPow.desc = "Power of the input";


LGraphPow.prototype.onDrawBackground = function(ctx)
{
    this.inputs[0].label = "Value";
    this.inputs[1].label = "Exp";
    if(!this.isInputConnected(0))
        this.inputs[0].label += "="+this.properties["A"].toFixed(3);
    if(!this.isInputConnected(1))
        this.inputs[1].label += "="+this.properties["B"].toFixed(3);
}

//LGraphMulOp.prototype = Object.create(LGraphOperation); // we inherit from Entity
//LGraphMulOp.prototype.constructor = LGraphMulOp;
LiteGraph.extendClass(LGraphPow,LGraphOperation);
LiteGraph.registerNodeType("operations/"+LGraphPow.title, LGraphPow);

