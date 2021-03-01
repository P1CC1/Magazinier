var layout_wall = {
  id:"layout_wall",onStepping:function(object){
    return({endPoints:null,continua:false});
  },
  texture:undefined,texturepath:function(){return("../assets/textures/"+this.id+"/"+this.texture+".png");},
  setup:function(y,x){
    if(layout[y]!=undefined&&layout[y][x]!=undefined&&layout[y][x][1]!=undefined){this.texture=layout[y][x][1];}
    else{this.texture=0;}
    delete this.setup;
  }
};
var layout_path = {
  id:"layout_path",onStepping:function(object){
    return({});
  },
  texture:undefined,texturepath:function(){return("../assets/textures/"+this.id+"/"+this.texture+".png");},
  setup:function(y,x){
    if(layout[y]!=undefined&&layout[y][x]!=undefined&&layout[y][x][1]!=undefined){this.texture=layout[y][x][1];}
    else{this.texture=0;}
    delete this.setup;
  }
};
var layout_goal = {
  id:"layout_goal",
  onStepping:function(object) {
    if (objects[object.y+((Math.abs(object.deltay)-1)*object.directiony)][object.x+((Math.abs(object.deltax)-1)*object.directionx)].id == "objects_player") {
      return ({endPoints:null,continua:false});
    }
    else if (objects[object.y+((Math.abs(object.deltay)-1)*object.directiony)][object.x+((Math.abs(object.deltax)-1)*object.directionx)].id == "objects_box") {
      return({endPoints:[[object.y,object.x,object.deltay,object.deltax]],continua:false});
    }
  },
  afterStep:function(object) {

  },
  texturepath:function(){return"../assets/textures/layout_goal/infinity.png"}
};
var layout_oneway = {
  id:"layout_oneway",directiony:-1,directionx:0,texture:undefined,actOn:"objects_player",
  onStepping:function(object){
    if (objects[object.y+object.deltay][object.x+object.deltax].id==this.actOn) {
      if (object.directiony==this.directiony&&object.directionx==this.directionx) {return({});}
      else {return({endPoints:null});}
    }
    else {return({});}
  },
  texturepath:function(){
    if (this.texture == undefined) {this.determineTexturepath();}
    return("../assets/textures/"+this.id+"/"+this.texture+".png");
  },
  determineTexturepath:function(){
    if (this.directiony == 0) {
      if (this.directionx == 1) {this.texture="right";}
      else if (this.directionx == -1) {this.texture="left";}
    }
    else if (this.directiony == -1) {this.texture="up";}
    else if (this.directiony == 1) {this.texture="down";}
  },
  setup:function(y,x){
    var data = layout[y][x];
    if(data[1] != undefined){this.directiony=data[1]}
    if(data[2] != undefined){this.directionx=data[2]}
    if(data[3] != undefined){this.actOn=objects_cells[data[3]].id}
    delete this.setup;
  }
}
const layout_cells = [layout_wall,layout_path,layout_goal,layout_oneway];

var objects_void = {id:"objects_void",texturepath:function(){return("../assets/textures/transparent.png");},onStepping:function(object){
  return({endPoints:[[object.y,object.x,object.deltay,object.deltax]],continua:false});
}};
var objects_player = {
  id:"objects_player",
  facingy:-1,facingx:0,
  texturepath:function(){
    var facing = "up";
    if (this.facingy == 0) {
      if (this.facingx == -1) {facing = "left";}
      else if (this.facingx == 1) {facing = "right"}
    }
    else if (this.facingy == -1) {facing = "up";}
    else if (this.facingy == 1) {facing = "down";}
    return("../assets/textures/objects_player/"+facing+".png");
  },
  onStepping:function(object){
    return({continua:true});
  }
};
var objects_box = {
  id:"objects_box",justStepped:0,n:0,e:0,s:0,w:0,texture:undefined,lastChecked:0,
  texturepath:function(y,x) {
    if (this.texture == undefined) {this.determineTexturepath(y,x);}
    return("../assets/textures/objects_box/"+this.texture+".png");
  },
  determineTexturepath:function(y,x){
    var file = "";
    var previousPresent = false;
    if (this.n==1) {
      file = file+"N";
      previousPresent = true;
    }
    if (this.e==1) {
      if ((previousPresent==false || objects[y-1][x+1].s!=1 || objects[y-1][x+1].w!=1) && file!="") {file = file + "-";}
      file = file+"E"
      previousPresent = true;
    } else {previousPresent=false;}
    if (this.s==1) {
      if ((previousPresent==false || objects[y+1][x+1].w!=1 || objects[y+1][x+1].n!=1) && file!="") {file = file + "-";}
      file = file+"S"
      previousPresent = true;
    } else {previousPresent=false;}
    if (this.w==1) {
      if ((previousPresent==false || objects[y+1][x-1].n!=1 || objects[y+1][x-1].e!=1) && file!="") {file = file + "-";}
      file = file+"W"
      previousPresent = true;
    } else {previousPresent=false;}
    if (this.n==1 && this.w==1) {
      if ((objects[y-1][x-1].e!=1 || objects[y-1][x-1].s!=1) && file!="") {file = file + "-";}
    }
    if (file=="") {file="default";}
    this.texture=file;
  },
  setup:function(y,x){
    if (objects[y][x][1]==1) {this.n=1;}
    if (objects[y][x][2]==1) {this.e=1;}
    if (objects[y][x][3]==1) {this.s=1;}
    if (objects[y][x][4]==1) {this.w=1;}
    delete this.setup;
  },
  onStepping:function(object){
    this.lastChecked = moveNumber;
    var result = {continua:true,endPoints:[]};
    var sides = [];
    if (object.directiony == 0) {
      if (this.n == 1) {sides.push([-1,0]);}
      if (this.s == 1) {sides.push([1,0]);}
    }
    if (object.directionx == 0) {
      if (this.e == 1) {sides.push([0,1]);}
      if (this.w == 1) {sides.push([0,-1]);}
    }
    for (var i=0; i<sides.length; i++) {
      var starty = object.y+object.deltay+sides[i][0];
      var startx = object.x+object.deltax+sides[i][1];
      var deltay = 0;
      var deltax = 0;
      var antiDirectiony = object.directiony*-1;
      var antiDirectionx = object.directionx*-1;
      var antiCardinal = SwithCardinalVectorial ([antiDirectiony,antiDirectionx]);
      while (true) {
        var currentCell = objects[starty+deltay][startx+deltax];
        if (currentCell.lastChecked == moveNumber) {break;}
        if (currentCell[antiCardinal] != 1) {
          var endPoints = CheckMovement(starty+deltay, startx+deltax, object.directiony, object.directionx);
          result.endPoints = endPointsHandlerForMovement(result.endPoints, endPoints);
          break;
        }
        deltay = VectorOperation(deltay, 1, antiDirectiony);
        deltax = VectorOperation(deltax, 1, antiDirectionx);
      }
    }
    return(result);
  },
  loadFix:function (y,x) {
    if (this.n==1 && objects[y-1][x].s!=1) {this.n=0;}
    if (this.e==1 && objects[y][x+1].w!=1) {this.e=0;}
    if (this.s==1 && objects[y+1][x].n!=1) {this.s=0;}
    if (this.w==1 && objects[y][x-1].e!=1) {this.w=0;}
  }
};
const objects_cells = [objects_void,objects_player,objects_box];

var layout = [];
var objects = [];
var ChangedLayout = true;
var GameRunning = false;
var RemainingBoxes;
var moveNumber = 0;

function CreateTables () {
  var prefix = "l";
  var i1, i2, i3, id2, id3;
  for (i1=0; i1<2; i1++) {
    var table = document.createElement("table");
    table.classList.add("display");
    if (Gametype == 2) {table.classList.add("display_editor");}
    for (i2=0; i2<29; i2++) {
      var tr = document.createElement("tr");
      for (i3=0; i3<29; i3++) {
        var td = document.createElement("td");
        var img = document.createElement("img");
        img.src = "../assets/textures/transparent.png";
        img.width = "32";
        img.height = "32";
        if (i2.toString().length == 1) {id2 = "0"+i2;}
        else {id2 = i2;}
        if (i3.toString().length == 1) {id3 = "0"+i3;}
        else {id3 = i3;}
        id = prefix+"+"+id2+"+"+id3;
        img.id = id;
        if (Gametype == 2 && prefix == "o") {img.onclick = function() {Clicked(this)};}
        td.appendChild(img);
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    document.body.insertBefore(table, document.getElementById("completed"));
    prefix = "o";
  }
}

function Main(key) {
  var moving = false;
  if (key == 119) { //w
    moving = true;
    var directiony = -1;
    var directionx = 0;
  }
  else if (key == 97) { //a
    moving = true;
    var directiony = 0;
    var directionx = -1;
  }
  else if (key == 115) { //s
    moving = true;
    var directiony = 1;
    var directionx = 0;
  }
  else if (key == 100) { //d
    moving = true;
    var directiony = 0;
    var directionx = 1;
  }
  if (moving == true) {
    var hasMoved = Move(directiony, directionx)
  }
}

function Move(directiony, directionx) {
  moveNumber++;
  var playersPosition = SearchPositionByID(objects, "objects_player")
  var y = playersPosition[0][0];
  var x = playersPosition[0][1];
  var doneSomething = false;
  //cambio la rotazione del player
  if (objects[y][x].facingy != directiony || objects[y][x].facingx != directionx)
  {
    objects[y][x].facingy = directiony;
    objects[y][x].facingx = directionx;
    doneSomething = true;
  }
  //chiamo CheckMovement
  var endPoints = CheckMovement(y, x, directiony, directionx);
  //console.log(endPoints);
  if (endPoints != null) {
    doneSomething = true;
    var i1, i2;
    //remove duplicates
    for (i1=0; i1<endPoints.length; i1++) {
      for (i2=0; i2<endPoints.length; i2++) {
        if (i1 != i2 && endPoints[i1][0]+endPoints[i1][2] == endPoints[i2][0]+endPoints[i2][2] && endPoints[i1][1]+endPoints[i1][3] == endPoints[i2][1]+endPoints[i2][3]) {
          if (Math.abs(endPoints[i1][2]) > Math.abs(endPoints[i2][2])) {endPoints.splice(i2, 1);}
          else if (Math.abs(endPoints[i1][2]) < Math.abs(endPoints[i2][2])) {endPoints.splice(i1, 1);}
          else if (Math.abs(endPoints[i1][3]) > Math.abs(endPoints[i2][3])) {endPoints.splice(i2, 1);}
          else if (Math.abs(endPoints[i1][3]) < Math.abs(endPoints[i2][3])) {endPoints.splice(i1, 1);}
        }
      }
    }
    //moving
    for (i1=0; i1<endPoints.length; i1++) {
      for (i2=endPoints[i1][2]; i2!=0; i2=((Math.abs(i2)-1)*directiony)) {
        objects[ endPoints[i1][0]+i2 ][ endPoints[i1][1] ] = {...objects[ endPoints[i1][0]+((Math.abs(i2)-1)*directiony) ][ endPoints[i1][1] ]}
      }
      for (i2=endPoints[i1][3]; i2!=0; i2=((Math.abs(i2)-1)*directionx)) {
        objects[ endPoints[i1][0] ][ endPoints[i1][1]+i2 ] = {...objects[ endPoints[i1][0] ][ endPoints[i1][1]+((Math.abs(i2)-1)*directionx) ]}
      }
      objects[endPoints[i1][0]][endPoints[i1][1]] = {...objects_void};
    }
    //after move
  }
  if (doneSomething) {Render();}
  return(doneSomething);
}

function CheckMovement(y, x, directiony, directionx) {
  var continua = true;
  var deltay = 0;
  var deltax = 0;
  var i1;
  if (typeof(endPoints) != "object") {var endPoints = [];}
  while (continua && endPoints != null) {
    if (layout[y+deltay]==undefined||layout[y+deltay][x+deltax]==undefined||objects[y+deltay]==undefined||objects[y+deltay][x+deltax]==undefined) {
      return(null);
    }
    continua = false;
    var object = {y:y, x:x, directiony:directiony, directionx:directionx, deltax:deltax, deltay:deltay};
    var newObjectLayout = layout[y+deltay][x+deltax].onStepping(object);
    var newObjectObjects = objects[y+deltay][x+deltax].onStepping(object);
    //sistemo continua
    continua = ContinuaHandlerForMovement(newObjectLayout.continua, newObjectObjects.continua);
    //copy endPoints from layout
    endPoints = endPointsHandlerForMovement(endPoints, newObjectLayout.endPoints);
    //copy endPoints from objects
    endPoints = endPointsHandlerForMovement(endPoints, newObjectObjects.endPoints);
    //end loop oerations
    deltay = VectorOperation(deltay, 1, directiony);
    deltax = VectorOperation(deltax, 1, directionx);
  }
  return(endPoints);
}

function ContinuaHandlerForMovement(value1, value2) {
  if (value1 == undefined && value2 == undefined) {return(false);}
  if (value1 == undefined) {return(value2);}
  if (value2 == undefined) {return(value1);}
  return(value1 && value2);
}

function endPointsHandlerForMovement(base, toAdd) {
  var i1;
  if (toAdd === undefined) {return(base);}
  if (base == null || toAdd == null) {base = null;}
  else {
    for (i1=0; i1<toAdd.length; i1++) {
      base.push(toAdd[i1]);
    }
  }
  return(base);
}

function Render() {
  var i1, i2, id1, id2;
  if (ChangedLayout == true) {
    for (i1=0; i1<layout.length; i1++) {
      for (i2=0; i2<layout[i1].length; i2++) {
        if (i1.toString().length == 1) {id1 = "0"+i1;}
        else {id1 = i1;}
        if (i2.toString().length == 1) {id2 = "0"+i2;}
        else {id2 = i2;}
        var cell = document.getElementById("l+"+id1+"+"+id2);
        var texturepath = layout[i1][i2].texturepath();
        if (cell.src != texturepath) {cell.src = texturepath;}
      }
    }
    ChangedLayout = false
  }
  for (i1=0; i1<objects.length; i1++) {
    for (i2=0; i2<objects[i1].length; i2++) {
      if (i1.toString().length == 1) {id1 = "0"+i1;}
      else {id1 = i1;}
      if (i2.toString().length == 1) {id2 = "0"+i2;}
      else {id2 = i2;}
      var cell = document.getElementById("o+"+id1+"+"+id2);
      var texturepath = objects[i1][i2].texturepath(i1,i2);
      if (cell.src != texturepath) {cell.src = texturepath;}
    }
  }
}

function Load(level) {
  var i1, i2, i3;
  layout = copyArray(level[2]);
  objects = copyArray(level[3]);
  if (Gametype != 2) {
    document.getElementById("completed").innerHTML = "";
    RemainingBoxes = level[0][0];
    GameRunning = true;
  }
  //layout
  for (i1=0; i1<layout.length; i1++) {
    for (i2=0; i2<layout[i1].length; i2++) {
      var object = {...layout_cells[layout[i1][i2][0]]};
      if (object.hasOwnProperty("setup")) {object.setup(i1, i2);}
      layout[i1][i2] = {...object};
    }
  }
  //objects
  for (i1=0; i1<objects.length; i1++) {
    for (i2=0; i2<objects[i1].length; i2++) {
      var object = {...objects_cells[objects[i1][i2][0]]};
      if (object.hasOwnProperty("setup")) {object.setup(i1, i2);}
      objects[i1][i2] = {...object};
    }
  }
  //fix layout
  for (i1=0; i1<layout.length; i1++) {
    for (i2=0; i2<layout[i1].length; i2++) {
      if (layout[i1][i2].hasOwnProperty("loadFix")) {layout[i1][i2].loadFix(i1, i2);}
    }
  }
  //fix objects
  for (i1=0; i1<objects.length; i1++) {
    for (i2=0; i2<objects[i1].length; i2++) {
      if (objects[i1][i2].hasOwnProperty("loadFix")) {objects[i1][i2].loadFix(i1, i2);}
    }
  }
  ChangedLayout = true;
  Render();
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function SearchPositionByID(array, id) {
  var i1, i2;
  var positions = [];
  for (i1=0; i1<array.length; i1++) {
    for (i2=0; i2<array[i1].length; i2++) {
      if (array[i1][i2].id == id) {
        positions.push([i1,i2])
      }
    }
  }
  return(positions);
}

function copyArray(item) {
  if (Array.isArray(item)) {
    return item.map(element => copyArray(element))
  }
  else {
    return item
  }
}

document.addEventListener('keypress', event => {
  if (GameRunning == true) {
    Main(event.keyCode);
  }
})

function Finish() {
  GameRunning = false;
  document.getElementById("completed").innerHTML = "Completed!!"
  if (Gametype == 0) {
    document.getElementById("main").innerHTML = "Next";
  }
}

function VectorOperation(base, operation, multiplicator) {
  return((Math.abs(base)+operation)*multiplicator);
}

function SwithCardinalVectorial (input) {
  if (input == "n") {return([-1,0]);}
  if (input == "e") {return([0,1]);}
  if (input == "s") {return([1,0]);}
  if (input == "w") {return([0,-1]);}
  if (input[0] == 0) {
    if (input[1] == 1) {
      return("e");
    }
    else if (input[1] == -1) {
      return("w");
    }
  }
  else if (input[0] == 1) {
    return("s");
  }
  else if (input[0] == -1) {
    return("n");
  }
}
