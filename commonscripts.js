var level = [[],[]];
var defaultGameState = {
  gameRunning:false,
  moveNumber:0,
  playerTurn:0,
  displaySize:function(){return(this.viewField*2+1);},
  levelMaxSize:[0,0]
};
var gameState = {...defaultGameState};
var pageType;

var void_0 = {
  id:"void_0",
  onStepping:function(object){
    return({endPoints:null});
  },
  texturepath:function(){return("../assets/textures/transparent.png");},
};
var wall_0 = {
  id:"wall_0",
  onStepping:function(object){
    return({endPoints:null,continua:false});
  },
  texture:undefined,
  texturepath:function(){return("../assets/textures/"+this.id+"/"+this.texture+".png");},
  setup:function(data){
    if(data[0]!=undefined){this.texture=data[0];}
    else{this.texture=0;}
    delete this.setup;
  }
};
var path_0 = {
  id:"path_0",texture_options_0:4,texture_options_1:4,
  onStepping:function(object){
    return({});
  },
  texture:undefined,
  texturepath:function(){
    return("../assets/textures/"+this.id+"/"+this.texture+".png");
  },
  setup:function(data){
    var texture = 0;
    if(data[0]!=undefined){texture=data[0];}
    var textureNumber = this["texture_options_"+texture];
    if (textureNumber > 1) {
      texture = texture+"/"+Math.floor(Math.random()*textureNumber);
    }
    this.texture = texture;
    delete this.setup;
  }
};
var goal_0 = {
  id:"goal_0",
  onStepping:function(object) {
    var previousObjectsCell = level[1][object.y+((Math.abs(object.deltay)-1)*object.directiony)][object.x+((Math.abs(object.deltax)-1)*object.directionx)];
    if (previousObjectsCell.id == "box_1" && previousObjectsCell.texture == "deliverable") {
      return({endPoints:[[object.y,object.x,object.deltay,object.deltax]],continua:false});
    }
    return({endPoints:null,continua:false});
  },
  afterMove:function(y,x) {
    if (level[1][y][x].id == "box_1") {
      gameState.remainingBoxes--;
      level[1][y][x] = {...void_1};
      if (gameState.remainingBoxes == 0) {Finish();}
    }
  },
  texturepath:function(){return"../assets/textures/"+this.id+"/infinity.png"}
};
var oneway_0 = {
  id:"oneway_0",directiony:-1,directionx:0,texture:undefined,actOn:"level[1]_player",
  onStepping:function(object){
    if (level[1][object.y+object.deltay][object.x+object.deltax].id==this.actOn) {
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
  setup:function(data){
    if(data[0] != undefined){this.actOn=defaultCells[1][data[0]].id}
    if(data[1] != undefined){this.directiony=data[1]}
    if(data[2] != undefined){this.directionx=data[2]}
    delete this.setup;
  }
};

var void_1 = {
  id:"void_1",
  texturepath:function(){return("../assets/textures/transparent.png");},
  onStepping:function(object){
  return({endPoints:[[object.y,object.x,object.deltay,object.deltax]],continua:false});
}};
var player_1 = {
  id:"player_1",
  playerId:undefined,
  facingy:-1,facingx:0,
  texturepath:function(){
    var facing = "up";
    if (this.facingy == 0) {
      if (this.facingx == -1) {facing = "left";}
      else if (this.facingx == 1) {facing = "right"}
    }
    else if (this.facingy == -1) {facing = "up";}
    else if (this.facingy == 1) {facing = "down";}
    return("../assets/textures/"+this.id+"/"+facing+".png");
  },
  onStepping:function(object){
    return({continua:true});
  },
  setup:function(data){
    this.playerId = data.playerId;
    if (data.facingy != undefined) {this.facingy=data.facingy;}
    if (data.facingx != undefined) {this.facingx=data.facingx;}
    delete this.setup;
  }
};
var box_1 = {
  id:"box_1",justStepped:0,n:0,e:0,s:0,w:0,texture:undefined,lastChecked:0,deliverable:false,
  texturepath:function(y,x) {
    if (this.texture == undefined) {this.determineTexturepath(y,x);}
    return("../assets/textures/"+this.id+"/"+this.texture+".png");
  },
  determineTexturepath:function(y,x){
    var file = "";
    var previousPresent = false;
    if (this.n==1) {
      file = file+"N";
      previousPresent = true;
    }
    if (this.e==1) {
      if ((previousPresent==false || level[1][y-1][x+1].s!=1 || level[1][y-1][x+1].w!=1) && file!="") {file = file + "-";}
      file = file+"E"
      previousPresent = true;
    } else {previousPresent=false;}
    if (this.s==1) {
      if ((previousPresent==false || level[1][y+1][x+1].w!=1 || level[1][y+1][x+1].n!=1) && file!="") {file = file + "-";}
      file = file+"S"
      previousPresent = true;
    } else {previousPresent=false;}
    if (this.w==1) {
      if ((previousPresent==false || level[1][y+1][x-1].n!=1 || level[1][y+1][x-1].e!=1) && file!="") {file = file + "-";}
      file = file+"W"
      previousPresent = true;
    } else {previousPresent=false;}
    if (this.n==1 && this.w==1) {
      if ((level[1][y-1][x-1].e!=1 || level[1][y-1][x-1].s!=1) && file!="") {file = file + "-";}
    }
    if (file=="") {file="default";}
    if (this.deliverable) {file="deliverable";}
    this.texture=file;
  },
  setup:function(data){
    if (data != undefined) {
      if (data[0]==1) {this.n=1;}
      if (data[1]==1) {this.e=1;}
      if (data[2]==1) {this.s=1;}
      if (data[3]==1) {this.w=1;}
      if (data[4]==1) {this.deliverable=true;}
    }
    delete this.setup;
  },
  secondSetup:function(y,x){
    y = Number(y);
    x = Number(x);
    if (this.n==1 && level[1][y-1][x].s!=1) {this.n=0;}
    if (this.e==1 && level[1][y][x+1].w!=1) {this.e=0;}
    if (this.s==1 && level[1][y+1][x].n!=1) {this.s=0;}
    if (this.w==1 && level[1][y][x-1].e!=1) {this.w=0;}
    if (this.n||this.e||this.s||this.w) {this.deliverable=false;}
    this.determineTexturepath(y,x);
    delete this.secondSetup;
  },
  onStepping:function(object){
    this.lastChecked = gameState.moveNumber;
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
        var currentCell = level[1][starty+deltay][startx+deltax];
        if (currentCell.lastChecked == gameState.moveNumber) {break;}
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
};

const defaultCells = [
  [
    void_0, //0
    wall_0, //1
    path_0, //2
    goal_0, //3
    oneway_0 //4
  ],
  [
    void_1, //0
    player_1, //1
    box_1 //2
  ]
];

function PageSetup (input) {
  pageType = input;
  //container
  var div = document.createElement("div");
  div.id = "display_container";
  document.body.append(div);
  //main
  div = document.createElement("div");
  div.id = "display_main";
  document.getElementById("display_container").append(div);
  //side
  div = document.createElement("div");
  div.id = "display_side";
  document.getElementById("display_container").append(div);
  //botton
  div = document.createElement("div");
  div.id = "display_botton";
  document.body.append(div);
  //screen_text
  var p = document.createElement("p");
  p.id = "screen_text";
  document.getElementById("display_main").append(p);
}

function CreateTables (size) {
  var i1, i2, i3;
  for (i1=0; i1<2; i1++) {
    var table = document.createElement("table");
    table.classList.add("tables");
    //table.border = 1;
    for (i2=0; i2<size; i2++) {
      var tr = document.createElement("tr");
      for (i3=0; i3<size; i3++) {
        var td = document.createElement("td");
        var img = document.createElement("img");
        img.classList.add("cells");
        img.src = "../assets/textures/transparent.png";
        img.width = "32";
        img.height = "32";
        img.id = i1+"+"+i2+"+"+i3;
        img.dataset.y = i2;
        img.dataset.x = i3;
        img.dataset.z = i1;
        td.appendChild(img);
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    document.getElementById("display_main").append(table);
  }
}

function Main(input) {
  var doneSomething = false;
  var playersPosition = SearchPositionByID(level[1], "player_1");
  var i1;
  for (i1=0; i1<playersPosition.length; i1++) {
    var currentPlayerPosition = playersPosition[i1];
    if (level[1][currentPlayerPosition[0]][currentPlayerPosition[1]].playerId == gameState.playerTurn) {
      var y = currentPlayerPosition[0];
      var x = currentPlayerPosition[1];
      break;
    }
  }
  if (input.action == "move") {
    doneSomething = Move(y, x, input.directiony,input.directionx);
  }

  if (doneSomething == false) {return;}
  gameState.playerTurn++;
  if (gameState.playerTurn >= gameState.playerNumber) {gameState.playerTurn = 0;}
}

function Move(y, x, directiony, directionx) {
  gameState.moveNumber++;
  var doneSomething = false;
  //cambio la rotazione del player
  if (level[1][y][x].facingy != directiony || level[1][y][x].facingx != directionx)
  {
    level[1][y][x].facingy = directiony;
    level[1][y][x].facingx = directionx;
    doneSomething = true;
  }
  //chiamo CheckMovement
  var endPoints = CheckMovement(y, x, directiony, directionx);
  //console.log(endPoints);
  if (endPoints != null) {
    doneSomething = true;
    var i, i1, i2, i3, eP, cell;
    //remove duplicates
    endPoints = RemoveEndPointsDuplicates (endPoints);

    //moving
    for (i1=0; i1<endPoints.length; i1++) {
      eP = endPoints[i1];
      i2 = eP[2];
      i3 = eP[3];
      while (i2!=0||i3!=0) {
        level[1][eP[0]+i2][eP[1]+i3] = {...level[1][eP[0]+VectorOperation(i2, -1, directiony)][eP[1]+VectorOperation(i3, -1, directionx)]};
        if (i2!=0) {i2=VectorOperation(i2, -1, directiony);}
        if (i3!=0) {i3=VectorOperation(i3, -1, directionx);}
      }
      InsertCell (1,eP[0],eP[1],0);
    }

    //after move
    for (i=0; i<level.length; i++) {
      for (i1=0; i1<endPoints.length; i1++) {
        eP = endPoints[i1];
        i2 = eP[2];
        i3 = eP[3];
        while (i2!=0||i3!=0) {
          cell = level[i][eP[0]+i2][eP[1]+i3];
          if (cell.hasOwnProperty("afterMove")) {cell.afterMove(eP[0]+i2,eP[1]+i3);}
          if (i2!=0) {i2=VectorOperation(i2, -1, directiony);}
          if (i3!=0) {i3=VectorOperation(i3, -1, directionx);}
        }
      }
    }

  }
  if (doneSomething) {Render();}
  return(doneSomething);
}

function RemoveEndPointsDuplicates (endPoints) {
  var i1, i2;
  for (i1=0; i1<endPoints.length; i1++) {
    for (i2=0; i2<endPoints.length; i2++) {
      if (i1 != i2 && endPoints[i1][0]+endPoints[i1][2] == endPoints[i2][0]+endPoints[i2][2] && endPoints[i1][1]+endPoints[i1][3] == endPoints[i2][1]+endPoints[i2][3]) {
        if (Math.abs(endPoints[i1][2]) > Math.abs(endPoints[i2][2])) {endPoints.splice(i2, 1);}
        else if (Math.abs(endPoints[i1][2]) < Math.abs(endPoints[i2][2])) {endPoints.splice(i1, 1);}
        else if (Math.abs(endPoints[i1][3]) > Math.abs(endPoints[i2][3])) {endPoints.splice(i2, 1);}
        else if (Math.abs(endPoints[i1][3]) < Math.abs(endPoints[i2][3])) {endPoints.splice(i1, 1);}
        else if (endPoints[i1][2]==endPoints[i2][2]||endPoints[i1][3]==endPoints[i2][3]) {endPoints.splice(i2, 1);}
      }
    }
  }
  return(endPoints);
}

function CheckMovement(y, x, directiony, directionx) {
  var continua = true;
  var deltay = 0;
  var deltax = 0;
  var i1, currenty, currentx;
  if (typeof(endPoints) != "object") {var endPoints = [];}
  while (continua && endPoints != null) {
    currenty = y+deltay;
    currentx = x+deltax;
    if (!BothCellsExist(currenty,currentx)) {return(null);}
    continua = false;
    var object = {y:y, x:x, directiony:directiony, directionx:directionx, deltax:deltax, deltay:deltay};
    var newObject_0 = level[0][currenty][currentx].onStepping(object);
    var newObject_1 = level[1][currenty][currentx].onStepping(object);
    //sistemo continua
    continua = ContinuaHandlerForMovement(newObject_0.continua, newObject_1.continua);
    //copy endPoints from level[0]
    endPoints = endPointsHandlerForMovement(endPoints, newObject_0.endPoints);
    //copy endPoints from level[1]
    endPoints = endPointsHandlerForMovement(endPoints, newObject_1.endPoints);
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
  var i1;
  var origin = FindOrigin();
  var cells = document.getElementsByClassName("cells");
  for (i1=0; i1<cells.length; i1++) {
    var displayCell = cells[i1];
    var z = displayCell.dataset.z;
    var y = Number(displayCell.dataset.y)+origin[0];
    var x = Number(displayCell.dataset.x)+origin[1];
    if (CellExist(z,y,x)) {
      var cell = level[z][y][x];
      displayCell.src = cell.texturepath(y,x);
    }
  }
}

function OldRender() {
  var i1, i2, i3;
  for (i1=0; i1<level.length; i1++) {
    for (i2=0; i2<level[i1].length; i2++) {
      for (i3=0; i3<level[i1][i2].length; i3++) {
        document.getElementById(i1+"+"+i2+"+"+i3).src = level[i1][i2][i3].texturepath(i2,i3);
      }
    }
  }
}

function FindOrigin () {
  var playerPosition = SearchPositionByID(level[1], "player_1")[0];
  var y = playerPosition[0];
  var x = playerPosition[1];
  var origin = [y-gameState.viewField, x-gameState.viewField];
  if (origin[0]+gameState.displaySize() > gameState.levelMaxSize[0]) {origin[0]=gameState.levelMaxSize[0]-gameState.displaySize();}
  if (origin[1]+gameState.displaySize() > gameState.levelMaxSize[1]) {origin[1]=gameState.levelMaxSize[1]-gameState.displaySize();}
  if (origin[0]<0){origin[0]=0;}
  if (origin[1]<0){origin[1]=0;}
  return(origin);
}

function Load(input) {
  DeleteGame();
  var i1, i2, i3;
  level = copyArray(input[0]);
  //initial copy
  for (i1=0; i1<level.length; i1++) {
    for (i2=0; i2<level[i1].length; i2++) {
      for (i3=0; i3<level[i1][i2].length; i3++) {
        var cell = level[i1][i2][i3];
        InsertCell(i1,i2,i3,cell[0],cell[1]);
      }
    }
  }
  FixLevel();
  //general e player
  if (pageType != 2) {
    document.getElementById("screen_text").innerHTML = "";
    gameState.remainingBoxes = input[1].remainingBoxes;
    gameState.viewField = input[1].viewField;
    gameState.gameRunning = true;
    FindLevelMaxSize();
    CreateTables(gameState.displaySize());
    //players setup
    var playersData = input[2];
    gameState.playerNumber = playersData.length;
    for (i1=0; i1<gameState.playerNumber; i1++) {
      var currentPlayerData = playersData[i1];
      var currenty = currentPlayerData.y;
      var currentx = currentPlayerData.x;
      currentPlayerData.playerId = i1;
      InsertCell(1,currenty,currentx,1,currentPlayerData)
    }
  }
  //setup
  for (i1=0; i1<level.length; i1++) {
    for (i2=0; i2<level[i1].length; i2++) {
      for (i3=0; i3<level[i1][i2].length; i3++) {
        var cell = level[i1][i2][i3];
        if (cell.hasOwnProperty("setup")) {
          cell.setup(input[0][i1][i2][i3][1]);
        }
      }
    }
  }
  //secondSetup
  for (i1=0; i1<level.length; i1++) {
    for (i2=0; i2<level[i1].length; i2++) {
      for (i3=0; i3<level[i1][i2].length; i3++) {
        var cell = level[i1][i2][i3];
        if (cell.hasOwnProperty("secondSetup")) {
          cell.secondSetup(i2,i3);
        }
      }
    }
  }
  Render();
}

function FindLevelMaxSize () {
  gameState.levelMaxSize[0] = level[0].length;
  var i1;
  for (i1=0; i1<level[0].length; i1++) {
    if (level[0][i1].length > gameState.levelMaxSize[1]) {gameState.levelMaxSize[1]=level[0][i1].length;}
  }
}

function FixLevel () {
  var i1, i2;
  //ciclo sulle colonne
  for (i1=0; i1<level[0].length; i1++) {
    //se manca una riga la aggiungo
    if (level[1][i1]==undefined) {level[1].push([]);}
    //ciclo sulle celle
    for (i2=0; i2<level[0][i1].length; i2++) {
      //se manca una cella la aggiungo
      if (!CellExist(1,i1,i2)) {
        level[1][i1].push(undefined);
        InsertCell (1,i1,i2,0);
      }
    }
  }
  for (i1=0; i1<level[1].length; i1++) {
    if (level[0][i1]==undefined) {
      level[1].splice(i1,1);
      i1--;
    }
    else {
      for (i2=0; i2<level[1][i1].length; i2++) {
        if (level[0][i1][i2]==undefined) {
          level[1][i1].splice(i2,1);
          i2--;
        }
      }
    }
  }
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
  if (gameState.gameRunning == false) {return;}
  key = event.keyCode;
  var proceed = false;
  var result = {};
  if (key == 119) { //w
    proceed = true;
    result.action = "move";
    result.directiony = -1;
    result.directionx = 0;
  }
  else if (key == 97) { //a
    proceed = true;
    result.action = "move";
    result.directiony = 0;
    result.directionx = -1;
  }
  else if (key == 115) { //s
    proceed = true;
    result.action = "move";
    result.directiony = 1;
    result.directionx = 0;
  }
  else if (key == 100) { //d
    proceed = true;
    result.action = "move";
    result.directiony = 0;
    result.directionx = 1;
  }
  if (proceed == true) {Main(result);}
})

function Finish() {
  gameState.gameRunning = false;
  document.getElementById("screen_text").innerHTML = "Completed!!"
  if (pageType == 0) {
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

function ClearDisplay () {
  console.log("Clearing the Display, Expect some lag")
  var cells = document.getElementsByClassName("cells");
  var i1;
  for (i1=0; i1<cells.length; i1++) {
    cells[i1].src = "../assets/textures/transparent.png";
  }
}

function DeleteGame () {
  DeleteTables();
  gameState = {...defaultGameState};
  level = [[],[]];
}

function DeleteTables () {
  var tables = document.getElementsByClassName("tables");
  while (tables.length!=0) {
    tables[0].remove();
  }
}

function InsertCell (z,y,x,numeralId,data) {
  level[z][y][x] = {...defaultCells[z][numeralId]};
  if (level[z][y][x].hasOwnProperty("setup") && gameState.gameRunning == true) {level[z][y][x].setup(data,y,x);}
}

function CellExist (z,y,x) {
  if (level[z]==undefined) {return(false);}
  if (level[z][y]==undefined) {return(false);}
  if (level[z][y][x]==undefined) {return(false);}
  return(true);
}

function BothCellsExist (y,x) {
  return(CellExist(0,y,x)&&CellExist(1,y,x));
}
