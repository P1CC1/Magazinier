/*
layout=
0=path,
1=wall,
2=goal
3=one-way
*/

/*
path=
0=sand,
1=grass_path
2=grass
*/

/*
wall=
0=bricks,
1=stone_bricks,
2=1-goal
3=transparent
*/

/*
objects=
0=nothing,
1=player,
2=box
*/

var layout = [];
var objects = [];


function Finish() {
  GameRunning = false;
  document.getElementById("completed").innerHTML = "Completed!!"
  if (Gametype == 0) {
    document.getElementById("main").innerHTML = "Next";
  }
}

var RemainingBoxes;
function Move(multy, multx) {
  var position = SearchPosition(1);
  var y = position[0];
  var x = position[1];
  var deltay = multy;
  var deltax = multx;
  if (layout[y+deltay] == undefined || layout[y+deltay][x+deltax] == undefined) {return;}
  if (layout[y][x][0] == 3 && (layout[y][x][1][0] != multy || layout[y][x][1][1] != multx)) {return;}
  if (layout[y+multy][x+multx][0] == 3 && layout[y+multy][x+multx][1][0] == multy*-1 && layout[y+multy][x+multx][1][1] == multx*-1) {return;}
  var box = 0;
  var foundbox = false;
  Loop:
  while (true) {
    //se vai fuori dalla tabella stoppo tutto
    if (layout[y+deltay] == undefined || layout[y+deltay][x+deltax] == undefined) {return;}

    var lcell = layout[y+deltay][x+deltax];
    var ocell = objects[y+deltay][x+deltax];

    if (lcell[0] == 1) {return;}
    if (ocell == 2) {
      box++;
      foundbox = true;
    }
    if (lcell[0] == 2) {
      if (box == 0) {return;}
      if (lcell[1] == 0) {
        box = 0;
      }
      else if (lcell[1] == 1) {
        lcell[0] = 1;
        lcell[1] = 2;
        ChangedLayout = true;
      }
      RemainingBoxes = RemainingBoxes - 1;
      if (RemainingBoxes == 0) {Finish();}
      break Loop;
    }
    if (foundbox == false && (lcell[0] == 0 || lcell[0] == 3)) {break Loop;}

    deltay = (Math.abs(deltay)+1)*multy;
    deltax = (Math.abs(deltax)+1)*multx;
    foundbox = false;
  }
  objects[y][x] = 0;
  objects[y+multy][x+multx] = 1;
  if (box>0) {objects[y+((box+1)*multy)][x+((box+1)*multx)] = 2;}
  Render();
}

function SearchPosition(id) {
  var i1, i2;
  Loop:
  for (i1=0; i1<objects.length; i1++) {
    for (i2=0; i2<objects[i1].length; i2++) {
      if (objects[i1][i2] == id) {
        break Loop;
      }
    }
  }
  return([i1,i2]);
}

function copyArray(item) {
  if (Array.isArray(item)) {
    return item.map(element => copyArray(element))
  }
  else {
    return item
  }
}

var GameRunning = false;
document.addEventListener('keypress', event => {
  if (GameRunning == true) {
    if (event.keyCode == 119) {
      Move(-1,0);
    }
    if (event.keyCode == 97) {
      Move(0,-1);
    }
    if (event.keyCode == 115) {
      Move(+1,0);
    }
    if (event.keyCode == 100) {
      Move(0,+1);
    }
  }
})

var ChangedLayout = true;
function Render() {
  var i1, i2;
  if (ChangedLayout) {
    for(i1=0; i1<layout.length; i1++) {
      for(i2=0; i2<layout[i1].length; i2++) {
        if (i1.toString().length == 1) {id1 = "0"+i1;}
        else {id1 = i1;}
        if (i2.toString().length == 1) {id2 = "0"+i2;}
        else {id2 = i2;}
        var cell = document.getElementById("l+"+id1+"+"+id2);
        var value1 = layout[i1][i2][0];
        var value2 = layout[i1][i2][1];
        if (value1 == 0) {
          if(value2 == 0) {cell.src = "../assets/textures/path/0.png";}
          else if(value2 == 1) {cell.src = "../assets/textures/path/1.png";}
          else if(value2 == 2) {cell.src = "../assets/textures/path/2.jpg";}
        }
        else if (value1 == 1) {
          if (value2 == 0) {cell.src = "../assets/textures/wall/0.png";}
          else if (value2 == 1) {cell.src = "../assets/textures/wall/1.png";}
          else if (value2 == 2) {cell.src = "../assets/textures/wall/2.png";}
          else if (value2 == 3) {cell.src = "../assets/textures/wall/3.png";}
        }
        else if (value1 == 2) {
          if (value2 == 0) {cell.src = "../assets/textures/goal/infinity.png";}
          else if (value2 == 1) {cell.src = "../assets/textures/goal/1.png";}
        }
        else if (value1 == 3) {
          if (value2[0] == -1 && value2[1] == 0) {cell.src = "../assets/textures/one-way/up.png";}
          else if (value2[0] == 0 && value2[1] == +1) {cell.src = "../assets/textures/one-way/right.png";}
          else if (value2[0] == +1 && value2[1] == 0) {cell.src = "../assets/textures/one-way/down.png";}
          else if (value2[0] == 0 && value2[1] == -1) {cell.src = "../assets/textures/one-way/left.png";}
        }
      }
    }
      ChangedLayout = false;
  }
  for(i1=0; i1<objects.length; i1++) {
    for(i2=0; i2<objects[i1].length; i2++) {
      if (i1.toString().length == 1) {id1 = "0"+i1;}
      else {id1 = i1;}
      if (i2.toString().length == 1) {id2 = "0"+i2;}
      else {id2 = i2;}
      var cell = document.getElementById("o+"+id1+"+"+id2);
      var value = objects[i1][i2];
      if (value == 0) {cell.src = "../assets/textures/transparent.png";}
      else if (value == 1) {cell.src = "../assets/textures/player.png";}
      else if (value == 2) {cell.src = "../assets/textures/box.png";}
    }
  }
}

function Load(level) {
  if (level.length != 3) {alert("the code is invalid");return;}
  layout = copyArray(level[2]);
  objects = copyArray(level[2]);
  var i1, i2, i3;
  for (i1=0; i1<objects.length; i1++) {
    for (i2=0; i2<objects[i1].length; i2++) {
      if (i1 == level[0][0] && i2 == level[0][1]) {objects[i1][i2] = 1;}
      for (i3=0; i3<level[1].length; i3++) {
        if (i1 == level[1][i3][0] && i2 == level[1][i3][1]) {objects[i1][i2] = 2}
      }
      if (objects[i1][i2] != 1 && objects[i1][i2] != 2) {objects[i1][i2] = 0;}
    }
  }
  if (Gametype != 2) {
    document.getElementById("completed").innerHTML = "";
    RemainingBoxes = level[1].length;
    GameRunning = true;
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
