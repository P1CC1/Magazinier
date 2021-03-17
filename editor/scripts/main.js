//  onLoad="Test()"
var section;
var type = [0,0];
var SomethingSelected = false;
var PlayerPresent = false;
var BoxesNumber = 0;
var pageType = 2;

function LoadThis() {
  var string = document.getElementById("start").value
  if (isJson(string) == false) {alert("the code is invalid");return;}
  Load(JSON.parse(string));
}

function Clicked(element) {
  if (SomethingSelected == false) {return;}
  var id = element.id;
  var y = parseInt(id.substring(2, 4));
  var x = parseInt(id.substring(5, 7));
  Fix(y, x);
  if (section == 0) {
    layout[y][x] = type;
    ChangedLayout = true;
  }
  else if (section == 1) {
    if (type == 1 && PlayerPresent == true) {return;}
    if (type == 1 && layout[y][x][0] != 0) {return;}
    if (type == 1) {PlayerPresent = true;}
    if (type == 2 && layout[y][x][0] != 0) {return;}
    if (type == 2) {BoxesNumber++;}
    objects[y][x] = type;
  }
  else if (section == 2) {
    if (objects[y][x] != 0) {
      if (objects[y][x] == 1) {PlayerPresent = false;}
      if (objects[y][x] == 2) {BoxesNumber--;}
      objects[y][x] = 0;
    }
    else {
      layout[y][x] = [1,3];
      ChangedLayout = true;
    }
  }
  Render();
}

function Fix(y, x) {
  if (y > layout.length-1){
    for (var i = layout.length-1; y>i; i++)
    //qui pushavo [[1,3]] magari c'è bug
    layout.push([]);
  }
  if (x > layout[y].length-1){
    for (var i = layout[y].length-1; x>i; i++)
    layout[y].push([1,3]);
  }
  if (y > objects.length-1){
    for (var i = objects.length-1; y>i; i++)
    objects.push([]);
  }
  if (x > objects[y].length-1){
    for (var i = objects[y].length-1; x>i; i++)
    objects[y].push(0);
  }
}

function Selected(element, typethis, sectionthis) {
  var cells = document.getElementsByClassName("selector");
  if (element.style.borderColor == "rgb(255, 0, 0)") {
    SomethingSelected = false;
    element.style.borderColor = "#CC88FF";
  }
  else {
    SomethingSelected = true;
    for (var i=0; i<cells.length; i++) {
      cells[i].style.borderColor = "#CC88FF";
    }
    element.style.borderColor = "#FF0000";
    type = typethis;
    section = sectionthis;
  }
}

function Construct() {
  if (PlayerPresent == false) {
    alert("You have to insert a player");
    return;
  }
  if (BoxesNumber == 0) {
    alert("You have to insert at least a box");
    return;
  }

  var i1, i2;
  var found1 = false;
  var found2 = false;
  for (i1=layout.length-1; i1>=0; i1--) {
    found2 = false;
    //console.log("current row: "+i1);
    if (layout[i1].length>0) {
      //console.log("contiene celle");
      Loop:
      for (i2=layout[i1].length-1; i2>=0; i2--) {
        //console.log("current column: "+i2)
        if (layout[i1][i2][0] == 1 && layout[i1][i2][1] == 3 && found2 == false) {
          //console.log("cella vuota");
          layout[i1].splice(i2);
        }
        else {
          //console.log("cella piena");
          found1 = true;
          found2 = true;
          break Loop;
        }
      }
    }
    if (layout[i1].length == 0 && found1 == false) {
      layout.splice(i1)
      //console.log("riga vuota da cancellare");
    }
  }

  var string = [[],[],[]];
  string[2] = layout;
  string[0] = SearchPosition(1);
  for (i1=0; i1<objects.length; i1++) {
    for (i2=0; i2<objects[i1].length; i2++) {
      if (objects[i1][i2] == 2) {
        string[1].push([i1,i2]);
      }
    }
  }
  document.getElementById("end").innerHTML = JSON.stringify(string);
}
