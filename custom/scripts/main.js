var Gametype = 1;

function LoadThis() {
  var string = document.getElementById("start").value
  var level = string.split(', ');
  console.log(level);
  console.log(typeof(level));
  //if (isJson(string) == false) {alert("the code is invalid");return;}
  //Load(JSON.parse(string));
  Load(level);
}
