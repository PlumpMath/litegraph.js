// *************************************************************
//   Node CLASS                                          *******
// *************************************************************

/* flags:
 + skip_title_render
 + clip_area
 + unsafe_execution: not allowed for safe execution

 supported callbacks:
 + onAdded: when added to graph
 + onRemoved: when removed from graph
 + onStart:	when starts playing
 + onStop:	when stops playing
 + onDrawForeground: render the inside widgets inside the node
 + onDrawBackground: render the background area inside the node (only in edit mode)
 + onMouseDown
 + onMouseMove
 + onMouseUp
 + onMouseEnter
 + onMouseLeave
 + onExecute: execute the node
 + onPropertyChange: when a property is changed in the panel (return true to skip default behaviour)
 + onGetInputs: returns an array of possible inputs
 + onGetOutputs: returns an array of possible outputs
 + onDblClick
 + onSerialize
 + onSelected
 + onDeselected
 + onDropFile
 */

require(LiteGraph);
declare(LGraphNode);

/**
 * Base Class for all the node type classes
 * @class LGraphNode
 * @param {String} name a name for the node
 */

function LGraphNode(title)
{
    this._ctor();
}

LGraphNode.prototype._ctor = function( title )
{
    this.title = title || "Unnamed";
    this.title_width = LiteGraph.NODE_MIN_WIDTH;
    this.size = [LiteGraph.NODE_WIDTH,60];
    this.graph = null;

    this.pos = [10,10];
    this.id = -1; //not know till not added
    this.type = null;

    //inputs available: array of inputs
    this.inputs = [];
    this.outputs = [];
    this.connections = [];

    //local data
    this.properties =  {};
    this.data = null; //persistent local data
    this.flags = {
        //skip_title_render: true,
        //unsafe_execution: false,
    };


    this.shader_piece = null;
    this.codes = []; //output codes in each output link channel


    this.T_type = {}; // template type
}

/**
 * configure a node from an object containing the serialized info
 * @method configure
 */
LGraphNode.prototype.configure = function(info)
{
    for (var j in info)
    {
        if(j == "console") continue;

        if(j == "properties")
        {
            //i dont want to clone properties, I want to reuse the old container
            for(var k in info.properties)
                this.properties[k] = info.properties[k];
            continue;
        }

        if(info[j] == null)
            continue;
        else if (typeof(info[j]) == 'object') //object
        {
            if(this[j] && this[j].configure)
                this[j].configure( info[j] );
            else
                this[j] = LiteGraph.cloneObject(info[j], this[j]);
        }
        else //value
            this[j] = info[j];
    }

    //FOR LEGACY, PLEASE REMOVE ON NEXT VERSION
    for(var i in this.inputs)
    {
        var input = this.inputs[i];
        if(!input.link || !input.link.length )
            continue;
        var link = input.link;
        if(typeof(link) != "object")
            continue;
        input.link = link[0];
        this.graph.links[ link[0] ] = { id: link[0], origin_id: link[1], origin_slot: link[2], target_id: link[3], target_slot: link[4] };
    }
    for(var i in this.outputs)
    {
        var output = this.outputs[i];
        if(!output.links || output.links.length == 0)
            continue;
        for(var j in output.links)
        {
            var link = output.links[j];
            if(typeof(link) != "object")
                continue;
            output.links[j] = link[0];
        }
    }

}

/**
 * serialize the content
 * @method serialize
 */

LGraphNode.prototype.serialize = function()
{
    var o = {
        id: this.id,
        title: this.title,
        type: this.type,
        pos: this.pos,
        size: this.size,
        data: this.data,
        flags: LiteGraph.cloneObject(this.flags),
        inputs: this.inputs,
        outputs: this.outputs,
        shader_piece: this.shader_piece,
        codes: this.codes
    };

    if(this.properties)
        o.properties = LiteGraph.cloneObject(this.properties);

    if(!o.type)
        o.type = this.constructor.type;

    if(this.color)
        o.color = this.color;
    if(this.bgcolor)
        o.bgcolor = this.bgcolor;
    if(this.boxcolor)
        o.boxcolor = this.boxcolor;
    if(this.shape)
        o.shape = this.shape;

    if(this.onSerialize)
        this.onSerialize(o);

    return o;
}


/* Creates a clone of this node */
LGraphNode.prototype.clone = function()
{
    var node = LiteGraph.createNode(this.type);

    var data = this.serialize();
    delete data["id"];
    node.configure(data);

    return node;
}


/**
 * serialize and stringify
 * @method toString
 */

LGraphNode.prototype.toString = function()
{
    return JSON.stringify( this.serialize() );
}
//LGraphNode.prototype.unserialize = function(info) {} //this cannot be done from within, must be done in LiteGraph


/**
 * get the title string
 * @method getTitle
 */

LGraphNode.prototype.getTitle = function()
{
    return this.title || this.constructor.title;
}

/**
 * get the title width string
 * @param {ctx, font} the context to calculate the width
 * @method getTitle
 */

LGraphNode.prototype.getTitleWidth = function(ctx, font)
{
    return this.title_width;
}

/**
 * get the title width string
 * @param {ctx, font} the context to calculate the width
 * @method getTitle
 */

LGraphNode.prototype.computeTitleWidth = function(ctx, font)
{
    ctx.font = font;
    this.title_width = this.title ? ctx.measureText(this.title ).width + LiteGraph.NODE_TITLE_HEIGHT + 5: 0; // 5 it's the padding
    if(this.size[0] < this.title_width)
        this.size[0] = this.title_width;
    return this.title_width;
}

// Execution *************************
/**
 * sets the output data
 * @method setOutputData
 * @param {number} slot
 * @param {*} data
 */
LGraphNode.prototype.setOutputData = function(slot,data)
{
    if(!this.outputs) return;
    if(slot > -1 && slot < this.outputs.length && this.outputs[slot] && this.outputs[slot].links != null)
    {
        for(var i = 0; i < this.outputs[slot].links.length; i++)
        {
            var link_id = this.outputs[slot].links[i];
            this.graph.links[ link_id ].data = data;
        }
    }
}

/**
 * retrieves the input data from one slot
 * @method getInputData
 * @param {number} slot
 * @return {*} data
 */
LGraphNode.prototype.getInputData = function(slot)
{
    if(!this.inputs) return null;
    if(slot < this.inputs.length && this.inputs[slot].link != null)
        return this.graph.links[ this.inputs[slot].link ].data;
    return null;
}

/**
 * tells you if there is a connection in one input slot
 * @method isInputConnected
 * @param {number} slot
 * @return {boolean}
 */
LGraphNode.prototype.isInputConnected = function(slot)
{
    if(!this.inputs) return null;
    return (slot < this.inputs.length && this.inputs[slot].link != null);
}

/**
 * tells you info about an input connection (which node, type, etc)
 * @method getInputInfo
 * @param {number} slot
 * @return {Object}
 */
LGraphNode.prototype.getInputInfo = function(slot)
{
    if(!this.inputs) return null;
    if(slot < this.inputs.length)
        return this.inputs[slot];
    return null;
}


/**
 * tells you info about an output connection (which node, type, etc)
 * @method getOutputInfo
 * @param {number} slot
 * @return {Object}
 */
LGraphNode.prototype.getOutputInfo = function(slot)
{
    if(!this.outputs) return null;
    if(slot < this.outputs.length)
        return this.outputs[slot];
    return null;
}


/**
 * tells you if there is a connection in one output slot
 * @method isOutputConnected
 * @param {number} slot
 * @return {boolean}
 */
LGraphNode.prototype.isOutputConnected = function(slot)
{
    if(!this.outputs) return null;
    return (slot < this.outputs.length && this.outputs[slot].links && this.outputs[slot].links.length);
}

/**
 * retrieves all the nodes connected to this output slot
 * @method getOutputNodes
 * @param {number} slot
 * @return {array}
 */
LGraphNode.prototype.getOutputNodes = function(slot)
{
    if(!this.outputs || this.outputs.length == 0) return null;
    if(slot < this.outputs.length)
    {
        var output = this.outputs[slot];
        var r = [];
        for(var i = 0; i < output.length; i++)
            r.push( this.graph.getNodeById( output.links[i].target_id ));
        return r;
    }
    return null;
}

LGraphNode.prototype.triggerOutput = function(slot,param)
{
    var n = this.getOutputNode(slot);
    if(n && n.onTrigger)
        n.onTrigger(param);
}

//connections

/**
 * add a new output slot to use in this node
 * @method addOutput
 * @param {string} name
 * @param {string} type string defining the output type ("vec3","number",...)
 * @param {Object} extra_info this can be used to have special properties of an output (special color, position, etc)
 */
LGraphNode.prototype.addOutput = function(name,type,types, extra_info)
{
    var o = {name:name,type:type,types:types,links:null};
    if(extra_info)
        for(var i in extra_info)
            o[i] = extra_info[i];

    if(!this.outputs) this.outputs = [];
    this.outputs.push(o);
    if(this.onOutputAdded)
        this.onOutputAdded(o);
    this.size = this.computeSize();
}

/**
 * add a new output slot to use in this node
 * @method addOutputs
 * @param {Array} array of triplets like [[name,type,extra_info],[...]]
 */
LGraphNode.prototype.addOutputs = function(array)
{
    for(var i in array)
    {
        var info = array[i];
        var o = {name:info[0],type:info[1],link:null};
        if(array[2])
            for(var j in info[2])
                o[j] = info[2][j];

        if(!this.outputs)
            this.outputs = [];
        this.outputs.push(o);
        if(this.onOutputAdded)
            this.onOutputAdded(o);
    }

    this.size = this.computeSize();
}

/**
 * remove an existing output slot
 * @method removeOutput
 * @param {number} slot
 */
LGraphNode.prototype.removeOutput = function(slot)
{
    this.disconnectOutput(slot);
    this.outputs.splice(slot,1);
    this.size = this.computeSize();
    if(this.onOutputRemoved)
        this.onOutputRemoved(slot);
}


/**
 * add a new input slot to use in this node
 * @method addInput
 * @param {string} name
 * @param {string} type string defining the input type ("vec3","number",...)
 * @param {Object} extra_info this can be used to have special properties of an input (label, color, position, etc)
 */
LGraphNode.prototype.addInput = function(name,type,types,extra_info)
{
    var o = {name:name,type:type,link:null, types:types};
    if(extra_info)
        for(var i in extra_info)
            o[i] = extra_info[i];

    if(!this.inputs) this.inputs = [];
    this.inputs.push(o);
    this.size = this.computeSize();
    if(this.onInputAdded)
        this.onInputAdded(o);
}

/**
 * add several new input slots in this node
 * @method addInputs
 * @param {Array} array of triplets like [[name,type,extra_info],[...]]
 */
LGraphNode.prototype.addInputs = function(array)
{
    for(var i in array)
    {
        var info = array[i];
        var o = {name:info[0], type:info[1], link:null};
        if(array[2])
            for(var j in info[2])
                o[j] = info[2][j];

        if(!this.inputs)
            this.inputs = [];
        this.inputs.push(o);
        if(this.onInputAdded)
            this.onInputAdded(o);
    }

    this.size = this.computeSize();
}

/**
 * remove an existing input slot
 * @method removeInput
 * @param {number} slot
 */
LGraphNode.prototype.removeInput = function(slot)
{
    this.disconnectInput(slot);
    this.inputs.splice(slot,1);
    this.size = this.computeSize();
    if(this.onInputRemoved)
        this.onInputRemoved(slot);

}

/**
 * add an special connection to this node (used for special kinds of graphs)
 * @method addConnection
 * @param {string} name
 * @param {string} type string defining the input type ("vec3","number",...)
 * @param {[x,y]} pos position of the connection inside the node
 * @param {string} direction if is input or output
 */
LGraphNode.prototype.addConnection = function(name,type,pos,direction)
{
    this.connections.push( {name:name,type:type,pos:pos,direction:direction,links:null});
}

/**
 * computes the size of a node according to its inputs and output slots
 * @method computeSize
 * @param {number} minHeight
 * @return {number} the total size
 */
LGraphNode.prototype.computeSize = function(minHeight)
{
    var rows = Math.max( this.inputs ? this.inputs.length : 1, this.outputs ? this.outputs.length : 1);
    var size = new Float32Array([0,0]);
    size[1] = rows * 14 + 6;
    if(!this.inputs || this.inputs.length == 0 || !this.outputs || this.outputs.length == 0)
        size[0] = LiteGraph.NODE_WIDTH * 0.5;
    else
        size[0] = LiteGraph.NODE_WIDTH;
    return size;
}

/**
 * returns the bounding of the object, used for rendering purposes
 * @method getBounding
 * @return {Float32Array[4]} the total size
 */
LGraphNode.prototype.getBounding = function()
{
    return new Float32Array([this.pos[0] - 4, this.pos[1] - LiteGraph.NODE_TITLE_HEIGHT, this.pos[0] + this.size[0] + 4, this.pos[1] + this.size[1] + LGraph.NODE_TITLE_HEIGHT]);
}

/**
 * checks if a point is inside the shape of a node
 * @method isPointInsideNode
 * @param {number} x
 * @param {number} y
 * @return {boolean}
 */
LGraphNode.prototype.isPointInsideNode = function(x,y)
{
    var margin_top = this.graph && this.graph.isLive() ? 0 : 20;
    if(this.flags.collapsed)
    {
        //if ( distance([x,y], [this.pos[0] + this.size[0]*0.5, this.pos[1] + this.size[1]*0.5]) < LiteGraph.NODE_COLLAPSED_RADIUS)
        if( isInsideRectangle(x,y, this.pos[0], this.pos[1] - LiteGraph.NODE_TITLE_HEIGHT, this.getTitleWidth(), LiteGraph.NODE_TITLE_HEIGHT) )
            return true;
    }
    else if (this.pos[0] - 4 < x && (this.pos[0] + this.size[0] + 4) > x
        && (this.pos[1] - margin_top) < y && (this.pos[1] + this.size[1]) > y)
        return true;
    return false;
}

/**
 * returns the input slot with a given name (used for dynamic slots), -1 if not found
 * @method findInputSlot
 * @param {string} name the name of the slot
 * @return {number} the slot (-1 if not found)
 */
LGraphNode.prototype.findInputSlot = function(name)
{
    if(!this.inputs) return -1;
    for(var i = 0, l = this.inputs.length; i < l; ++i)
        if(name == this.inputs[i].name)
            return i;
    return -1;
}

/**
 * returns the output slot with a given name (used for dynamic slots), -1 if not found
 * @method findOutputSlot
 * @param {string} name the name of the slot
 * @return {number} the slot (-1 if not found)
 */
LGraphNode.prototype.findOutputSlot = function(name)
{
    if(!this.outputs) return -1;
    for(var i = 0, l = this.outputs.length; i < l; ++i)
        if(name == this.outputs[i].name)
            return i;
    return -1;
}

/**
 * connect this node output to the input of another node
 * @method connect
 * @param {number_or_string} slot (could be the number of the slot or the string with the name of the slot)
 * @param {LGraphNode} node the target node
 * @param {number_or_string} target_slot the input slot of the target node (could be the number of the slot or the string with the name of the slot)
 * @return {boolean} if it was connected succesfully
 */
LGraphNode.prototype.connect = function(slot, node, target_slot)
{
    target_slot = target_slot || 0;

    //seek for the output slot
    if( slot.constructor === String )
    {
        slot = this.findOutputSlot(slot);
        if(slot == -1)
        {
            if(LiteGraph.debug)
                console.log("Connect: Error, no slot of name " + slot);
            return false;
        }
    }
    else if(!this.outputs || slot >= this.outputs.length)
    {
        if(LiteGraph.debug)
            console.log("Connect: Error, slot number not found");
        return false;
    }

    //avoid loopback
    if(node == this) return false;
    //if( node.constructor != LGraphNode ) throw ("LGraphNode.connect: node is not of type LGraphNode");

    if(target_slot.constructor === String)
    {
        target_slot = node.findInputSlot(target_slot);
        if(target_slot == -1)
        {
            if(LiteGraph.debug)
                console.log("Connect: Error, no slot of name " + target_slot);
            return false;
        }
    }
    else if(!node.inputs || target_slot >= node.inputs.length)
    {
        if(LiteGraph.debug)
            console.log("Connect: Error, slot number not found");
        return false;
    }

    //if there is something already plugged there, disconnect
    if(target_slot != -1 && node.inputs[target_slot].link != null)
        node.disconnectInput(target_slot);

    //special case: -1 means node-connection, used for triggers
    var output = this.outputs[slot];
    if(target_slot == -1)
    {
        if( output.links == null )
            output.links = [];
        output.links.push({id:node.id, slot: -1});
    }
    else if( !output.type ||  //generic output
        !node.inputs[target_slot].type || //generic input
        output.type == node.inputs[target_slot].type || //same type
        LiteGraph.compareNodeTypes(output,node.inputs[target_slot])) //compare with multiple types
    {
        //info: link structure => [ 0:link_id, 1:start_node_id, 2:start_slot, 3:end_node_id, 4:end_slot ]
        //var link = [ this.graph.last_link_id++, this.id, slot, node.id, target_slot ];
        var link = { id: this.graph.last_link_id++, origin_id: this.id, origin_slot: slot, target_id: node.id, target_slot: target_slot };
        this.graph.links[ link.id ] = link;

        //connect
        if( output.links == null )	output.links = [];
        output.links.push( link.id );
        node.inputs[target_slot].link = link.id;

        if(node.infereTypes && node.inputs[target_slot].use_t){ // use Template type
            node.infereTypes( output, node.inputs[target_slot], this);
        }

        console.log(node);
        this.setDirtyCanvas(false,true);
        this.graph.onConnectionChange();
    }
    return true;
}

/**
 * disconnect one output to an specific node
 * @method disconnectOutput
 * @param {number_or_string} slot (could be the number of the slot or the string with the name of the slot)
 * @param {LGraphNode} target_node the target node to which this slot is connected [Optional, if not target_node is specified all nodes will be disconnected]
 * @return {boolean} if it was disconnected succesfully
 */
LGraphNode.prototype.disconnectOutput = function(slot, target_node)
{
    if( slot.constructor === String )
    {
        slot = this.findOutputSlot(slot);
        if(slot == -1)
        {
            if(LiteGraph.debug)
                console.log("Connect: Error, no slot of name " + slot);
            return false;
        }
    }
    else if(!this.outputs || slot >= this.outputs.length)
    {
        if(LiteGraph.debug)
            console.log("Connect: Error, slot number not found");
        return false;
    }

    //get output slot
    var output = this.outputs[slot];
    if(!output.links || output.links.length == 0)
        return false;

    if(target_node)
    {
        for(var i = 0, l = output.links.length; i < l; i++)
        {
            var link_id = output.links[i];
            var link_info = this.graph.links[ link_id ];

            //is the link we are searching for...
            if( link_info.target_id == target_node.id )
            {
                output.links.splice(i,1); //remove here
                target_node.inputs[ link_info.target_slot ].link = null; //remove there
                delete this.graph.links[ link_id ]; //remove the link from the links pool
                break;
            }
        }
    }
    else
    {
        for(var i = 0, l = output.links.length; i < l; i++)
        {
            var link_id = output.links[i];
            var link_info = this.graph.links[ link_id ];

            var target_node = this.graph.getNodeById( link_info.target_id );
            if(target_node)
                target_node.inputs[ link_info.target_slot ].link = null; //remove other side link
        }
        output.links = null;
    }

    this.resetTypes();
    this.setDirtyCanvas(false,true);
    this.graph.onConnectionChange();
    return true;
}

/**
 * disconnect one input
 * @method disconnectInput
 * @param {number_or_string} slot (could be the number of the slot or the string with the name of the slot)
 * @return {boolean} if it was disconnected succesfully
 */
LGraphNode.prototype.disconnectInput = function(slot)
{
    //seek for the output slot
    if( slot.constructor === String )
    {
        slot = this.findInputSlot(slot);
        if(slot == -1)
        {
            if(LiteGraph.debug)
                console.log("Connect: Error, no slot of name " + slot);
            return false;
        }
    }
    else if(!this.inputs || slot >= this.inputs.length)
    {
        if(LiteGraph.debug)
            console.log("Connect: Error, slot number not found");
        return false;
    }

    var input = this.inputs[slot];
    if(!input) return false;
    var link_id = this.inputs[slot].link;
    this.inputs[slot].link = null;

    //remove other side
    var link_info = this.graph.links[ link_id ];
    var node = this.graph.getNodeById( link_info.origin_id );
    if(!node) return false;

    var output = node.outputs[ link_info.origin_slot ];
    if(!output || !output.links || output.links.length == 0)
        return false;

    //check outputs
    for(var i = 0, l = output.links.length; i < l; i++)
    {
        var link_id = output.links[i];
        var link_info = this.graph.links[ link_id ];
        if( link_info.target_id == this.id )
        {
            output.links.splice(i,1);
            break;
        }
    }

    this.setDirtyCanvas(false,true);
    this.graph.onConnectionChange();
    return true;
}

/**
 * returns the center of a connection point in canvas coords
 * @method getConnectionPos
 * @param {boolean} is_input true if if a input slot, false if it is an output
 * @param {number_or_string} slot (could be the number of the slot or the string with the name of the slot)
 * @return {[x,y]} the position
 **/
LGraphNode.prototype.getConnectionPos = function(is_input,slot_number)
{
    if(this.flags.collapsed)
    {
        if(is_input)
            return [this.pos[0], this.pos[1] - LiteGraph.NODE_TITLE_HEIGHT * 0.5];
        else
            return [this.pos[0] + this.getTitleWidth(), this.pos[1] - LiteGraph.NODE_TITLE_HEIGHT * 0.5];
        //return [this.pos[0] + this.size[0] * 0.5, this.pos[1] + this.size[1] * 0.5];
    }

    if(is_input && slot_number == -1)
    {
        return [this.pos[0] + 10, this.pos[1] + 10];
    }

    if(is_input && this.inputs.length > slot_number && this.inputs[slot_number].pos)
        return [this.pos[0] + this.inputs[slot_number].pos[0],this.pos[1] + this.inputs[slot_number].pos[1]];
    else if(!is_input && this.outputs.length > slot_number && this.outputs[slot_number].pos)
        return [this.pos[0] + this.outputs[slot_number].pos[0],this.pos[1] + this.outputs[slot_number].pos[1]];

    if(!is_input) //output
        return [this.pos[0] + this.size[0] + 1, this.pos[1] + 10 + slot_number * LiteGraph.NODE_SLOT_HEIGHT];
    return [this.pos[0] , this.pos[1] + 10 + slot_number * LiteGraph.NODE_SLOT_HEIGHT];
}

/* Force align to grid */
LGraphNode.prototype.alignToGrid = function()
{
    this.pos[0] = LiteGraph.CANVAS_GRID_SIZE * Math.round(this.pos[0] / LiteGraph.CANVAS_GRID_SIZE);
    this.pos[1] = LiteGraph.CANVAS_GRID_SIZE * Math.round(this.pos[1] / LiteGraph.CANVAS_GRID_SIZE);
}


/* Console output */
LGraphNode.prototype.trace = function(msg)
{
    if(!this.console)
        this.console = [];
    this.console.push(msg);
    if(this.console.length > LGraphNode.MAX_CONSOLE)
        this.console.shift();

    this.graph.onNodeTrace(this,msg);
}

/* Forces to redraw or the main canvas (LGraphNode) or the bg canvas (links) */
LGraphNode.prototype.setDirtyCanvas = function(dirty_foreground, dirty_background)
{
    if(!this.graph)
        return;
    this.graph.sendActionToCanvas("setDirty",[dirty_foreground, dirty_background]);
}

LGraphNode.prototype.loadImage = function(url)
{
    var img = new Image();
    img.src = LiteGraph.node_images_path + url;
    img.ready = false;

    var that = this;
    img.onload = function() {
        this.ready = true;
        that.setDirtyCanvas(true);
    }
    return img;
}

//safe LGraphNode action execution (not sure if safe)
LGraphNode.prototype.executeAction = function(action)
{
    if(action == "") return false;

    if( action.indexOf(";") != -1 || action.indexOf("}") != -1)
    {
        this.trace("Error: Action contains unsafe characters");
        return false;
    }

    var tokens = action.split("(");
    var func_name = tokens[0];
    if( typeof(this[func_name]) != "function")
    {
        this.trace("Error: Action not found on node: " + func_name);
        return false;
    }

    var code = action;

    try
    {
        var _foo = eval;
        eval = null;
        (new Function("with(this) { " + code + "}")).call(this);
        eval = _foo;
    }
    catch (err)
    {
        this.trace("Error executing action {" + action + "} :" + err);
        return false;
    }

    return true;
}

/* Allows to get onMouseMove and onMouseUp events even if the mouse is out of focus */
LGraphNode.prototype.captureInput = function(v)
{
    if(!this.graph || !this.graph.list_of_graphcanvas)
        return;

    var list = this.graph.list_of_graphcanvas;

    for(var i in list)
    {
        var c = list[i];
        //releasing somebody elses capture?!
        if(!v && c.node_capturing_input != this)
            continue;

        //change
        c.node_capturing_input = v ? this : null;
        if(this.graph.debug)
            console.log(this.title + ": Capturing input " + (v?"ON":"OFF"));
    }
}

/**
 * Collapse the node to make it smaller on the canvas
 * @method collapse
 **/
LGraphNode.prototype.collapse = function()
{
    if(!this.flags.collapsed)
        this.flags.collapsed = true;
    else
        this.flags.collapsed = false;
    this.setDirtyCanvas(true,true);
}

/**
 * Forces the node to do not move or realign on Z
 * @method pin
 **/

LGraphNode.prototype.pin = function(v)
{
    if(v === undefined)
        this.flags.pinned = !this.flags.pinned;
    else
        this.flags.pinned = v;
}

LGraphNode.prototype.localToScreen = function(x,y, graphcanvas)
{
    return [(x + this.pos[0]) * graphcanvas.scale + graphcanvas.offset[0],
            (y + this.pos[1]) * graphcanvas.scale + graphcanvas.offset[1]];
}

LGraphNode.prototype.getInputNodes = function()
{
    var r = [];
    if(!this.inputs || this.inputs.length == 0) return r;
    for(var i = 0; i < this.inputs.length; i++){
        var link_id = this.inputs[i].link;
        var link = this.graph.links[link_id];
        if(link)
            r[i] =  this.graph.getNodeById( link.origin_id );// we knot it's 0 cause inputs only can have one link
    }
    return r;
}

LGraphNode.prototype.getInputCode = function(slot)
{
    var link_id = this.inputs[slot].link;
    var link = this.graph.links[link_id];
    if(link)
        return this.graph.getNodeById( link.origin_id ).codes[link.origin_slot];
    return null;

}

LGraphNode.prototype.infereTypes = function( output, input)
{
    for(var i in this.inputs){
        var inp = this.inputs[i];
        if(this.inputs[i].use_t){
            inp.types = output.types;
            inp.label = Object.keys(output.types)[0]; // as it can have more than one property atm we extract the first one
        }
    }

    for(var i in this.outputs){
        var out = this.outputs[i];
        if(this.outputs[i].use_t){
            out.types = output.types;
            out.label = Object.keys(output.types)[0]; // as it can have more than one property atm we extract the first one
        }
    }
}

LGraphNode.prototype.resetTypes = function( )
{

    var inputs_connected = false;
    for(var i in this.inputs){
        inputs_connected = inputs_connected || this.inputs[i].link != null ;
        if(inputs_connected)
            return;
    }



    for(var i in this.inputs){
        var inp = this.inputs[i];
        if(this.inputs[i].use_t){
            inp.types = {};
            inp.label = null; // as it can have more than one property atm we extract the first one
        }
    }

    for(var i in this.outputs){
        var out = this.outputs[i];
        if(this.outputs[i].use_t){
            out.types = {};
            out.label = null; // as it can have more than one property atm we extract the first one
        }
    }
}






