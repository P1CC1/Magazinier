var Gametype = 1;

function LoadThis() {
  var string = document.getElementById("start").value
  if (isJson(string) == false) {alert("the code is invalid");return;}
  var level = JSON.parse(string)
  if (level.length != 3) {alert("the code is invalid");return;}
  Load(level);
  GameRunning = true;
}
