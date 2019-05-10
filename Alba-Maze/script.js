// GAME CONTROLLER
var gameController = (function() {
  var stats = {
    x: 0,
    y: 0,
    time: 1000,
    direction: ""
  };

  return {
    init: function() {
      stats.x = 0;
      stats.y = 0;
      stats.time = 1000;
      stats.direction = "";
    },

    getPosition: function() {
      return {
        x: stats.x,
        y: stats.y
      };
    },

    listener: function(code) {
      switch (code) {
        case 100:
          stats.direction = "right";
          break;
        case 97:
          stats.direction = "left";
          break;
        case 119:
          stats.direction = "up";
          break;
        case 115:
          stats.direction = "down";
          break;
      }
    },

    getDirection: function() {
      return stats.direction;
    },

    move: function(dir) {
      switch (dir) {
        case "down":
          stats.x += 1;
          break;
        case "up":
          stats.x -= 1;
          break;
        case "right":
          stats.y += 1;
          break;
        case "left":
          stats.y -= 1;
          break;
      }
    },

    check: function() {
      if (stats.x < 0 || stats.y < 0 || stats.x > 18 || stats.y > 18) {
        return false;
      } else {
        return true;
      }
    },

    didWin: function() {
      if (stats.x == 12 && stats.y == 18) {
        return true;
      }
    },

    testing: function() {
      console.log(stats);
    }
  };
})();

// UI CONTROLLER

var UIController = (function() {

  var DOMStrings = {
    arrow: document.querySelector(".arrow"),
    table: document.querySelector("table"),
  };

  var selectCell = function(pos) {
    currRow = DOMStrings.table.querySelectorAll("tr")[pos.x];
    currCell = currRow.querySelectorAll("th")[pos.y];
    return currCell;
  };

  DOMStrings.winCell = selectCell({x: 12, y: 18});

  return {
    init: function(pos, i) {
      currentCell = selectCell(pos);
      currentCell.style.background = "blue";
      DOMStrings.winCell.style.background = "lime";
      DOMStrings.winCell.id = "win";
 if(i) {
  DOMStrings.arrow.removeChild(DOMStrings.arrow.firstChild);
 };
    },

    check: function(pos) {
      let currentCell;
      currentCell = selectCell(pos);
      if (currentCell.id == "red") {
        return false;
      } else {
        return true;
      }
    },

    clearCurrCell: function(pos) {
      currentCell = selectCell(pos);
      currentCell.style.background = "white";
    },

    arrowChange: function(dir) {
        DOMStrings.arrow.innerHTML = "<i class='fas fa-arrow-" + dir + "'></i>";
    },

    move: function(pos) {
      currentCell.style.background = "white";
      currentCell = selectCell(pos);
      currentCell.style.background = "blue";
    }
  };
})();

// APP CONTROLLER

var appController = (function(gameCtrl, UICtrl) {
  var pos, dir, isRed, isBorder, posTemp, appStart;

  window.addEventListener("keypress", event => {
    gameCtrl.listener(event.keyCode);
    dir = gameCtrl.getDirection();
    UICtrl.arrowChange(dir);
  });

  window.setInterval(function() {
    //move stats
    gameCtrl.move(dir);

    // check border
    isBorder = gameCtrl.check();
    if (isBorder) {
      pos = gameCtrl.getPosition();

      // check red
      isRed = UICtrl.check(pos);

      //check stats if its not border and not red
      if (isRed) {
        // get position
        posTemp = gameCtrl.getPosition();
        // log position
        // console.log(pos);

        // move UI
        UICtrl.move(posTemp);
        // check if won
        win = gameCtrl.didWin();
        if (win) {
          appController.win();
        }
      } else {
        appController.lost();
      }
    } else {
      appController.lost();
    }
  }, 1200);

  return {
    start: function() {
      // set stats to 0
      gameCtrl.init();
      // get start position
      pos = gameCtrl.getPosition();
      // set UI to start
      UICtrl.init(pos, appStart);
      dir = "";
      isRed = "";
      if (!appStart) {
        console.log("Application has started!");
      } else {
        console.log("Application has restarted!");
      };
      appStart = 1;
    },

    lost: function() {
      alert("You lost!");
      UICtrl.clearCurrCell(posTemp);
      appController.start();
    },

    win: function() {
      alert("You won!");
      UICtrl.clearCurrCell(posTemp);
      appController.start();
    },
  };
})(gameController, UIController);

appController.start();
