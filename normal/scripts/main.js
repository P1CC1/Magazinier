var CurrentLevel = 0;
var Gametype = 0;

function Main() {
  var button = document.getElementById("main");
  if (button.innerHTML == "Start" || button.innerHTML == "Next") {
    CurrentLevel++;
    GameRunning = true;
    button.innerHTML = "Restart";
  }
  Load(Levels[CurrentLevel]);
}
//ciao
