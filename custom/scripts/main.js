var Gametype = 1;

function LoadThis() {
  var string = document.getElementById("start").value
  if (isJson(string) == false) {alert("the code is invalid");return;}
  Load(JSON.parse(string));
}
