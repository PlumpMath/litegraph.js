require('./operation');


function LGraphDivOp()
{
    this._ctor(LGraphDivOp.title);
    this.code_name = "div";
    LGraphOperation.call( this);
}


LGraphDivOp.title = "Div";
LGraphDivOp.desc = "div the inputs";


//LGraphMulDiv.prototype = Object.create(LGraphOperation); // we inherit from Entity
//LGraphMulDiv.prototype.constructor = LGraphMulDiv;
LiteGraph.extendClass(LGraphDivOp,LGraphOperation);
LiteGraph.registerNodeType("operations/"+LGraphDivOp.title, LGraphDivOp);

