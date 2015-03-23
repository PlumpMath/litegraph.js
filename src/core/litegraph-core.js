
// *************************************************************
//   LiteGraph CLASS                                     *******
// *************************************************************


/**
 * The Global Scope. It contains all the registered node classes.
 *
 * @class LiteGraph
 * @constructor
 */

var LiteGraph = {

    NODE_TITLE_HEIGHT: 16,
    NODE_SLOT_HEIGHT: 15,
    NODE_WIDTH: 140,
    NODE_MIN_WIDTH: 50,
    NODE_COLLAPSED_RADIUS: 10,
    NODE_COLLAPSED_WIDTH: 80,
    CANVAS_GRID_SIZE: 10,
    NODE_TITLE_COLOR: "#222",
    NODE_DEFAULT_COLOR: "#999",
    NODE_DEFAULT_BGCOLOR: "#444",
    NODE_DEFAULT_BOXCOLOR: "#AEF",
    NODE_SELECTED_COLOR: "#FFF",
    NODE_DEFAULT_SHAPE: "box", // round circle box
    MAX_NUMBER_OF_NODES: 1000, //avoid infinite loops
    DEFAULT_POSITION: [100,100],//default node position
    node_images_path: "",

    proxy: null, //used to redirect calls

    debug: false,
    throw_errors: true,
    showcode:false,
    registered_node_types: {},

    graph_max_steps:0,

    CANVAS_WEBGL: 1,
    CANVAS_2D: 2,
    current_ctx: 0,

    COLOR_MAP:0,
    NORMAL_MAP:1,
    TANGENT_MAP:2,
    SPECULAR_MAP:3,
    BUMP_MAP:4,
/**
     * Register a node class so it can be listed when the user wants to create a new one
     * @method registerNodeType
     * @param {String} type name of the node and path
     * @param {Class} base_class class containing the structure of a node
     */

    registerNodeType: function(type, base_class)
    {
        if(!base_class.prototype)
            throw("Cannot register a simple object, it must be a class with a prototype");
        base_class.type = type;

        if(LiteGraph.debug)
            console.log("Node registered: " + type);

        var categories = type.split("/");

        var pos = type.lastIndexOf("/");
        base_class.category = type.substr(0,pos);
        //info.name = name.substr(pos+1,name.length - pos);

        //extend class
        if(base_class.prototype) //is a class
            for(var i in LGraphNode.prototype)
                if(!base_class.prototype[i])
                    base_class.prototype[i] = LGraphNode.prototype[i];

        this.registered_node_types[ type ] = base_class;
    },

    /**
     * Create a node of a given type with a name. The node is not attached to any graph yet.
     * @method createNode
     * @param {String} type full name of the node class. p.e. "math/sin"
     * @param {String} name a name to distinguish from other nodes
     * @param {Object} options to set options
     */

    createNode: function(type, title, options)
    {
        var base_class = this.registered_node_types[type];
        if (!base_class)
        {
            if(LiteGraph.debug)
                console.log("GraphNode type \"" + type + "\" not registered.");
            return null;
        }

        var prototype = base_class.prototype || base_class;

        title = title || base_class.title || type;

        var node = new base_class( title );

        node.type = type;
        if(!node.title) node.title = title;
        if(!node.properties) node.properties = {};
        if(!node.flags) node.flags = {};
        if(!node.size) node.size = node.computeSize();
        if(!node.pos) node.pos = LiteGraph.DEFAULT_POSITION.concat();
        if(!node.shader_piece) node.shader_piece = null;
        if(!node.codes) node.codes = [];
        if(node.extraproperties)
            for(var i in node.extraproperties)
                node.properties[i] = node.extraproperties[i];
        //extra options
        if(options)
        {
            for(var i in options)
                node[i] = options[i];
        }

        if(node.inputs)
            this.graph_max_steps += node.inputs.length;
        return node;
    },


    extendNodeTypeProperties: function(base_class, method_name, proto_method)
    {
        if(!base_class.prototype)
            throw("Cannot register a simple object, it must be a class with a prototype");

        //extend class
        base_class.prototype.extraproperties = base_class.prototype.extraproperties || {};
        base_class.prototype.extraproperties[method_name] = proto_method;

    },

    /**
     * Returns a registered node type with a given name
     * @method getNodeType
     * @param {String} type full name of the node class. p.e. "math/sin"
     * @return {Class} the node class
     */

    getNodeType: function(type)
    {
        return this.registered_node_types[type];
    },


    /**
     * Returns a list of node types matching one category
     * @method getNodeType
     * @param {String} category category name
     * @return {Array} array with all the node classes
     */

    getNodeTypesInCategory: function(category)
    {
        var r = [];
        for(var i in this.registered_node_types)
            if(category == "")
            {
                if (this.registered_node_types[i].category == null)
                    r.push(this.registered_node_types[i]);
            }
            else if (this.registered_node_types[i].category == category)
                r.push(this.registered_node_types[i]);

        return r;
    },

    /**
     * Returns a list with all the node type categories
     * @method getNodeTypesCategories
     * @return {Array} array with all the names of the categories
     */

    getNodeTypesCategories: function()
    {
        var categories = {"":1};
        for(var i in this.registered_node_types)
            if(this.registered_node_types[i].category && !this.registered_node_types[i].skip_list)
                categories[ this.registered_node_types[i].category ] = 1;
        var result = [];
        for(var i in categories)
           // if(i != "core")
                result.push(i);
        return result;
    },

    //debug purposes: reloads all the js scripts that matches a wilcard
    reloadNodes: function (folder_wildcard)
    {
        var tmp = document.getElementsByTagName("script");
        //weird, this array changes by its own, so we use a copy
        var script_files = [];
        for(var i in tmp)
            script_files.push(tmp[i]);


        var docHeadObj = document.getElementsByTagName("head")[0];
        folder_wildcard = document.location.href + folder_wildcard;

        for(var i in script_files)
        {
            var src = script_files[i].src;
            if( !src || src.substr(0,folder_wildcard.length ) != folder_wildcard)
                continue;

            try
            {
                if(LiteGraph.debug)
                    console.log("Reloading: " + src);
                var dynamicScript = document.createElement("script");
                dynamicScript.type = "text/javascript";
                dynamicScript.src = src;
                docHeadObj.appendChild(dynamicScript);
                docHeadObj.removeChild(script_files[i]);
            }
            catch (err)
            {
                if(LiteGraph.throw_errors)
                    throw err;
                if(LiteGraph.debug)
                    console.log("Error while reloading " + src);
            }
        }

        if(LiteGraph.debug)
            console.log("Nodes reloaded");
    },

    //separated just to improve if it doesnt work
    cloneObject: function(obj, target)
    {
        if(obj == null) return null;
        var r = JSON.parse( JSON.stringify( obj ) );
        if(!target) return r;

        for(var i in r)
            target[i] = r[i];
        return target;
    }
};

if(typeof(performance) != "undefined")
    LiteGraph.getTime = function getTime() { return performance.now(); }
else
    LiteGraph.getTime = function getTime() { return Date.now(); }



//API *************************************************
//function roundRect(ctx, x, y, width, height, radius, radius_low) {
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius, radius_low) {

    // http://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
    // then it works with the stroke
    if(  radius_low === undefined || radius === radius_low){
        if (width < 2 * radius) radius = width / 2;
        if (height < 2 * radius) radius = height / 2;
        this.beginPath();
        this.moveTo(x+radius, y);
        this.arcTo(x+width, y,   x+width, y+height, radius);
        this.arcTo(x+width, y+height, x,   y+height, radius);
        this.arcTo(x,   y+height, x,   y,   radius);
        this.arcTo(x,   y,   x+width, y,   radius);
        this.closePath();
        return this;
    }
    if ( radius === undefined ) {
        radius = 5;
    }

    if(radius_low === undefined)
        radius_low  = radius;

    this.beginPath();
    this.moveTo(x + radius, y);
    this.lineTo(x + width - radius, y);
    this.quadraticCurveTo(x + width, y, x + width, y + radius);

    this.lineTo(x + width, y + height - radius_low);
    this.quadraticCurveTo(x + width, y + height, x + width - radius_low, y + height);
    this.lineTo(x + radius_low, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radius_low);
    this.lineTo(x, y + radius);
    this.quadraticCurveTo(x, y, x + radius, y);
    return this;
}

function compareObjects(a,b)
{
    for(var i in a)
        if(a[i] != b[i])
            return false;
    return true;
}

function distance(a,b)
{
    return Math.sqrt( (b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]) );
}

function colorToString(c)
{
    return "rgba(" + Math.round(c[0] * 255).toFixed() + "," + Math.round(c[1] * 255).toFixed() + "," + Math.round(c[2] * 255).toFixed() + "," + (c.length == 4 ? c[3].toFixed(2) : "1.0") + ")";
}

function isInsideRectangle(x,y, left, top, width, height)
{
    if (left < x && (left + width) > x &&
        top < y && (top + height) > y)
        return true;
    return false;
}

//[minx,miny,maxx,maxy]
function growBounding(bounding, x,y)
{
    if(x < bounding[0])
        bounding[0] = x;
    else if(x > bounding[2])
        bounding[2] = x;

    if(y < bounding[1])
        bounding[1] = y;
    else if(y > bounding[3])
        bounding[3] = y;
}

//point inside boundin box
function isInsideBounding(p,bb)
{
    if (p[0] < bb[0][0] ||
        p[1] < bb[0][1] ||
        p[0] > bb[1][0] ||
        p[1] > bb[1][1])
        return false;
    return true;
}

//boundings overlap, format: [start,end]
function overlapBounding(a,b)
{
    if ( a[0] > b[2] ||
        a[1] > b[3] ||
        a[2] < b[0] ||
        a[3] < b[1])
        return false;
    return true;
}

//Convert a hex value to its decimal value - the inputted hex must be in the
//	format of a hex triplet - the kind we use for HTML colours. The function
//	will return an array with three values.
function hex2num(hex) {
    if(hex.charAt(0) == "#") hex = hex.slice(1); //Remove the '#' char - if there is one.
    hex = hex.toUpperCase();
    var hex_alphabets = "0123456789ABCDEF";
    var value = new Array(3);
    var k = 0;
    var int1,int2;
    for(var i=0;i<6;i+=2) {
        int1 = hex_alphabets.indexOf(hex.charAt(i));
        int2 = hex_alphabets.indexOf(hex.charAt(i+1));
        value[k] = (int1 * 16) + int2;
        k++;
    }
    return(value);
}
//Give a array with three values as the argument and the function will return
//	the corresponding hex triplet.
function num2hex(triplet) {
    var hex_alphabets = "0123456789ABCDEF";
    var hex = "#";
    var int1,int2;
    for(var i=0;i<3;i++) {
        int1 = triplet[i] / 16;
        int2 = triplet[i] % 16;

        hex += hex_alphabets.charAt(int1) + hex_alphabets.charAt(int2);
    }
    return(hex);
}

/* LiteGraph GUI elements *************************************/

LiteGraph.createContextualMenu = function(values,options, ref_window)
{
    options = options || {};
    this.options = options;

    //allows to create graph canvas in separate window
    ref_window = ref_window || window;

    if(!options.from)
        LiteGraph.closeAllContextualMenus();

    var root = ref_window.document.createElement("div");
    root.className = "litecontextualmenu litemenubar-panel";
    this.root = root;
    var style = root.style;

    style.minWidth = "100px";
    style.minHeight = "20px";

    style.position = "fixed";
    style.top = "100px";
    style.left = "100px";
    style.color = "#AAF";
    style.padding = "2px";
    style.borderBottom = "2px solid #AAF";
    style.backgroundColor = "#444";

    //avoid a context menu in a context menu
    root.addEventListener("contextmenu", function(e) { e.preventDefault(); return false; });

    for(var i in values)
    {
        var item = values[i];
        var element = ref_window.document.createElement("div");
        element.className = "litemenu-entry";

        if(item == null)
        {
            element.className = "litemenu-entry separator";
            root.appendChild(element);
            continue;
        }

        if(item.is_menu)
            element.className += " submenu";

        if(item.disabled)
            element.className += " disabled";

        element.style.cursor = "pointer";
        element.dataset["value"] = typeof(item) == "string" ? item : item.value;
        element.data = item;
        if(typeof(item) == "string")
            element.innerHTML = values.constructor == Array ? values[i] : i;
        else
            element.innerHTML = item.content ? item.content : i;

        element.addEventListener("click", on_click );
        root.appendChild(element);
    }

    root.addEventListener("mouseover", function(e) {
        this.mouse_inside = true;
    });

    root.addEventListener("mouseout", function(e) {
        //console.log("OUT!");
        var aux = e.toElement;
        while(aux != this && aux != ref_window.document)
            aux = aux.parentNode;

        if(aux == this) return;
        this.mouse_inside = false;
        if(!this.block_close)
            this.closeMenu();
    });

    //insert before checking position
    ref_window.document.body.appendChild(root);

    var root_rect = root.getClientRects()[0];

    //link menus
    if(options.from)
    {
        options.from.block_close = true;
    }

    var left = options.left || 0;
    var top = options.top || 0;
    if(options.event)
    {
        left = (options.event.pageX - 10);
        top = (options.event.pageY - 10);
        if(options.left)
            left = options.left;

        var rect = ref_window.document.body.getClientRects()[0];

        if(options.from)
        {
            var parent_rect = options.from.getClientRects()[0];
            left = parent_rect.left + parent_rect.width;
        }


        if(left > (rect.width - root_rect.width - 10))
            left = (rect.width - root_rect.width - 10);
        if(top > (rect.height - root_rect.height - 10))
            top = (rect.height - root_rect.height - 10);
    }

    root.style.left = left + "px";
    root.style.top = top  + "px";

    function on_click(e) {
        var value = this.dataset["value"];
        var close = true;
        if(options.callback)
        {
            var ret = options.callback.call(root, this.data, e );
            if( ret != undefined ) close = ret;
        }

        if(close)
            LiteGraph.closeAllContextualMenus();
        //root.closeMenu();
    }

    root.closeMenu = function()
    {
        if(options.from)
        {
            options.from.block_close = false;
            if(!options.from.mouse_inside)
                options.from.closeMenu();
        }
        if(this.parentNode)
            ref_window.document.body.removeChild(this);
    };

    return root;
}

LiteGraph.closeAllContextualMenus = function()
{
    var elements = document.querySelectorAll(".litecontextualmenu");
    if(!elements.length) return;

    var result = [];
    for(var i = 0; i < elements.length; i++)
        result.push(elements[i]);

    for(var i in result)
        if(result[i].parentNode)
            result[i].parentNode.removeChild( result[i] );
}

LiteGraph.extendClass = function ( target, origin )
{
    for(var i in origin) //copy class properties
    {
        if(target.hasOwnProperty(i))
            continue;
        target[i] = origin[i];
    }

    if(origin.prototype) //copy prototype properties
        for(var i in origin.prototype) //only enumerables
        {
            if(!origin.prototype.hasOwnProperty(i))
                continue;

            if(target.prototype.hasOwnProperty(i)) //avoid overwritting existing ones
                continue;

            //copy getters
            if(origin.prototype.__lookupGetter__(i))
                target.prototype.__defineGetter__(i, origin.prototype.__lookupGetter__(i));
            else
                target.prototype[i] = origin.prototype[i];

            //and setters
            if(origin.prototype.__lookupSetter__(i))
                target.prototype.__defineSetter__(i, origin.prototype.__lookupSetter__(i));
        }
}

LiteGraph.compareNodeTypes = function(output,input)
{
    var out_types = Object.keys(output.types).length ? output.types : output.types_list;
    var in_types = Object.keys(input.types).length ? input.types : input.types_list;
    if(!out_types || !in_types )
        return false;
    for (key in out_types) {
        if (in_types.hasOwnProperty(key)) {
            return true;
        }
    }
    return false;
}

LiteGraph.dispatchEvent = function(name, obj, element)
{
    var event;
    if (document.createEvent) {
        event = document.createEvent("HTMLEvents");
        event.initEvent(name, true, true);
    } else {
        event = document.createEventObject();
        event.eventType = name;
    }

    event.eventName = name;
    event.data = obj;
    if(!element)
        element = document
    // for other browser
    if (document.createEvent) {
        element.dispatchEvent(event);
    } else {// for IE
        element.fireEvent("on" + event.eventType, event);
    }
}

// to improve a lot
LiteGraph.removeExtension = function(name){
    var no_ext_name = name.split('.')[0];
    return no_ext_name;
}


/*
 LiteGraph.createNodetypeWrapper = function( class_object )
 {
 //create Nodetype object
 }
 //LiteGraph.registerNodeType("scene/global", LGraphGlobal );
 */

if( !window["requestAnimationFrame"] )
{
    window.requestAnimationFrame = window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        (function( callback ){
            window.setTimeout(callback, 1000 / 60);
        });
}
