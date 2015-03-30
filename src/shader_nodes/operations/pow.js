require('./operation');


function LGraphPow()
{
    this._ctor(LGraphPow.title);
    this.code_name = "pow";
    LGraphOperation.call( this);
}


LGraphPow.title = "Pow";
LGraphPow.desc = "Power of the input";


//LGraphMulOp.prototype = Object.create(LGraphOperation); // we inherit from Entity
//LGraphMulOp.prototype.constructor = LGraphMulOp;
LiteGraph.extendClass(LGraphPow,LGraphOperation);
LiteGraph.registerNodeType("operations/"+LGraphPow.title, LGraphPow);

