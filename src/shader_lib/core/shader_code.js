/**
 * Created by vik on 26/01/2015.
 */

require('./code_piece');



function ShaderCode(vertex, fragment, out_var)
{
    this.vertex = vertex || new CodePiece();
    this.fragment = fragment || new CodePiece();
    this.output_var = out_var || "";
}

ShaderCode.prototype.getOutputVar = function()
{
    return this.output_var;
};

ShaderCode.prototype.setOrder = function(order)
{
    this.order = order;
    this.vertex.order = this.order;
    this.fragment.order = this.order;
};


ShaderCode.prototype.merge = function (other_code)
{
    if(other_code === LiteGraph.EMPTY_CODE || this === LiteGraph.EMPTY_CODE)
        return;
    this.vertex.merge(other_code.vertex);
    this.fragment.merge(other_code.fragment);

};

ShaderCode.prototype.partialMerge = function (other_code)
{
    if(other_code === LiteGraph.EMPTY_CODE || this === LiteGraph.EMPTY_CODE)
        return ["", ""];
    var vertex_remainder_map = this.vertex.partialMerge(other_code.vertex);
    var fragment_remainder_map = this.fragment.partialMerge(other_code.fragment);

    var vertex_str = this.getCodeStringFromMap(vertex_remainder_map);
    var frag_str = this.getCodeStringFromMap(fragment_remainder_map);
    return [vertex_str, frag_str];

};



ShaderCode.prototype.clone = function ()
{
    var vertex = this.vertex.clone();
    var fragment = this.fragment.clone();
    var cloned = new ShaderCode(vertex,fragment,this.output_var);
    cloned.order = this.order;
    return cloned;
};


ShaderCode.prototype.sortMapByValue = function (map)
{
    var tupleArray = [];
    for (var key in map) tupleArray.push([key, map[key]]);
    tupleArray.sort(function (a, b) { return a[1] - b[1] });
    return tupleArray;
}

ShaderCode.prototype.getCodeStringFromMap = function (map)
{
    var r = "";
    var sorted_map = this.sortMapByValue(map);
    for(var i in sorted_map)
        r += "         "+sorted_map[i][0];
    return r;
}


LiteGraph.EMPTY_CODE = new ShaderCode();