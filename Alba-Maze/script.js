var table, currentRow, currentCell, enemyRow, enemyCell, direction, time;
var x, y, a, b;

function start() {
  x = 0;
  y = 0;
  time = 1000;
  direction = "";
  //   a = 9;
  //   b = 9;
  table = document.querySelector("table");
  currentRow = table.querySelectorAll("tr")[x];
  currentCell = currentRow.querySelectorAll("th")[y];
  currentCell.style.background = "blue";
  arrow = document.querySelector(".arrow");
  winCell = table.querySelectorAll("tr")[12].querySelectorAll("th")[18];
  winCell.style.background = "lime";
  winCell.id = "win";
  //   enemyRow = table.querySelectorAll("tr")[a];
  //   enemyCell = enemyRow.querySelectorAll("th")[b];
  //   enemyCell.style.background = "red";
}

start();

window.setInterval(function() {
  console.log("move " + direction);

  if (direction === "right" && y < 18) {
    currentCell.style.background = "white";
    y += 1;
    currentRow = table.querySelectorAll("tr")[x];
    currentCell = currentRow.querySelectorAll("th")[y];
    currentCell.style.background = "blue";
    check();
  } else if (direction === "right" && y == 18) {
    currentCell.style.background = "white";
    lost();
  }

  if (direction === "left" && y > 0) {
    currentCell.style.background = "white";
    y -= 1;
    currentRow = table.querySelectorAll("tr")[x];
    currentCell = currentRow.querySelectorAll("th")[y];
    currentCell.style.background = "blue";
    check();
  } else if (direction === "left" && y == 0) {
    currentCell.style.background = "white";
    lost();
  }

  if (direction === "up" && x > 0) {
    currentCell.style.background = "white";
    x -= 1;
    currentRow = table.querySelectorAll("tr")[x];
    currentCell = currentRow.querySelectorAll("th")[y];
    currentCell.style.background = "blue";
    check();
  } else if (direction === "up" && x == 0) {
    currentCell.style.background = "white";
    lost();
  }

  if (direction === "down" && x < 18) {
    currentCell.style.background = "white";
    x += 1;
    currentRow = table.querySelectorAll("tr")[x];
    currentCell = currentRow.querySelectorAll("th")[y];
    currentCell.style.background = "blue";
    check();
  } else if (direction === "up" && x == 18) {
    currentCell.style.background = "white";
    lost();
  }

  time -= 6;
  console.log('interval is ' + time);
  
}, time);

window.addEventListener("keypress", event => {
  console.log(event.keyCode);

  // GO RIGHT
  if (event.keyCode == 100 && y < 19) {
    direction = "right";
    arrow.innerHTML = "<i class='fas fa-arrow-right'></i>";
  }

  // GO left
  if (event.keyCode == 97 && y > 0) {
    direction = "left";
    arrow.innerHTML = "<i class='fas fa-arrow-left'></i>";
  }

  // GO UP
  if (event.keyCode == 119 && x > 0) {
    direction = "up";
    arrow.innerHTML = "<i class='fas fa-arrow-up'></i>";
  }

  // GO DOWN
  if (event.keyCode == 115 && x < 19) {
    direction = "down";
    arrow.innerHTML = "<i class='fas fa-arrow-down'></i>";
  }

  //   ENEMY
  // if (event.keyCode === 59 && b < 9) {
  //     enemyCell.style.background = "white";
  //     b += 1;
  //     enemyRow = table.querySelectorAll("tr")[a];
  //     enemyCell = enemyRow.querySelectorAll("th")[b];
  //     enemyCell.style.background = "red";
  //     enemy();
  //   };
  //   if (event.keyCode == 107 && b > 0) {
  //     enemyCell.style.background = "white";
  //     b -= 1;
  //     enemyRow = table.querySelectorAll("tr")[a];
  //     enemyCell = enemyRow.querySelectorAll("th")[b];
  //     enemyCell.style.background = "red";
  //     enemy();
  //   };
  //   if (event.keyCode == 111 && a > 0) {
  //     enemyCell.style.background = "white";
  //     a -= 1;
  //     enemyRow = table.querySelectorAll("tr")[a];
  //     enemyCell = enemyRow.querySelectorAll("th")[b];
  //     enemyCell.style.background = "red";
  //     enemy();
  //   };
  //   // GO DOWN
  //   if (event.keyCode == 108 && a < 9) {
  //     enemyCell.style.background = "white";
  //     a += 1;
  //     enemyRow = table.querySelectorAll("tr")[a];
  //     enemyCell = enemyRow.querySelectorAll("th")[b];
  //     enemyCell.style.background = "red";
  //     enemy();
  //   };
});

// function enemy() {
//   if (x == a && y == b) {
//     enemyCell.style.background = "white";
//     alert("You lost!");
//     start();
//   }
// }

function check() {
  temp = currentCell.id;
  if (temp === "red") {
    currentCell.style.background = "brown";
    lost();
    arrow.innerHTML = "";
  }

  if (temp === "win") {
    alert("You won!");
    start();
    arrow.innerHTML = "";
  }
}

function lost() {
  alert("You lost!");
  start();
  arrow.innerHTML = "";
}
