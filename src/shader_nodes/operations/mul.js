require('./operation');


function LGraphMulOp()
{
    this._ctor(LGraphMulOp.title);
    this.code_name = "mul";
    LGraphOperation.call( this);
}


LGraphMulOp.title = "Mul";
LGraphMulOp.desc = "Mul the inputs";


//LGraphMulOp.prototype = Object.create(LGraphOperation); // we inherit from Entity
//LGraphMulOp.prototype.constructor = LGraphMulOp;
LiteGraph.extendClass(LGraphMulOp,LGraphOperation);
LiteGraph.registerNodeType("math/"+LGraphMulOp.title, LGraphMulOp);

