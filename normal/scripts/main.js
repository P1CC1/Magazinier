var currentLevel = 0;

function MainThis() {
  var button = document.getElementById("main");
  if (button.innerHTML == "Start" || button.innerHTML == "Next") {
    currentLevel++;
    button.innerHTML = "Restart";
  }
  Load(Levels[currentLevel]);
}
