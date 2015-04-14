require(CodePiece);
declare(PIf);


function PIf () {
    this.id = "if";
    this.includes = {};
}

PIf.prototype.getVertexCode = function (out_type, out_var, a,b,gt,lt,eq,gt_out,lt_out,eq_out,scope) {
    if(scope == CodePiece.VERTEX || scope == CodePiece.BOTH){
        var code = out_type+" " +out_var+";\n" +
            "      if("+ a+">"+ b+")\n" +
            "      {\n" +
            ""+gt+"\n" +
            "          "+out_var+" = " + gt_out +";\n"+
            "      } else if ("+ a+"<"+ b+"){\n" +
            ""+lt+"\n" +
            "          "+out_var+" = " + lt_out +";\n"+
            "      } else {\n" +
            ""+eq+"\n" +
            "          "+out_var+" = " + eq_out +";\n"
        " }\n";
        return code;
    }
    return "";
}

PIf.prototype.getFragmentCode = function (out_type, out_var, a,b,gt,lt,eq,gt_out,lt_out,eq_out,scope) {
    if(scope == CodePiece.FRAGMENT || scope == CodePiece.BOTH){
        gt = gt ? gt +"" : "";
        lt = lt ? lt +"" : "";
        eq = eq ? eq +"" : "";
        gt_out = gt_out ? "         "+out_var+" = " + gt_out +";\n" : "";
        lt_out = lt_out ? "         "+out_var+" = " + lt_out +";\n" : "";
        eq_out = eq_out ? "         "+out_var+" = " + eq_out +";\n" : "";
        var code = out_type+" " +out_var+";\n" +
            "      if("+ a+" > "+ b+")\n" +
            "      {\n" +
            ""+gt+"" +
            gt_out  +
            "      } else if ("+ a+" < "+ b+"){\n" +
            ""+lt+"" +
            lt_out  +
            "      } else {\n" +
            ""+eq+"" +
            eq_out  +
            "      }\n";
        return code;
    }
    return "";
}


PIf.prototype.getCode = function (params) {
    var out_var = params.out_var;
    var out_type = params.out_type;
    var a = params.a;
    var b = params.b;
    var gt = params.gt;
    var lt = params.lt;
    var eq = params.eq;
    var gt_out = params.gt_out;
    var lt_out = params.lt_out;
    var eq_out = params.eq_out;
    var scope = params.scope;
    var order = params.hasOwnProperty("order") ? params.order : Number.MAX_VALUE;

    var vertex = new CodePiece(order);
    vertex.setBody(this.getVertexCode(out_type, out_var, a,b,gt,lt,eq,gt_out,lt_out,eq_out, scope));
    vertex.setIncludes(this.includes);

    var fragment = new CodePiece(order);
    fragment.setBody(this.getFragmentCode(out_type, out_var, a,b,gt,lt,eq,gt_out,lt_out,eq_out,scope));
    fragment.setIncludes(this.includes );

    return new ShaderCode(vertex, fragment, out_var);
}



