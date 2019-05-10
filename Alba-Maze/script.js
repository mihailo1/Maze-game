// GAME CONTROLLER
var gameController = (function() {
  var stats = {
    x: 0,
    y: 0,
    time: 1000,
    direction: "",
    keys: 0,
    key1: false
  };

  return {
    init: function() {
      stats.x = 0;
      stats.y = 0;
      stats.time = 1000;
      stats.direction = "";
      stats.keys = 0;
      stats.key1 = false;
    },

    getPosition: function() {
      return {
        x: stats.x,
        y: stats.y,
        keys: stats.y
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

    keyCheck: function() {
      if (!stats.key1) {
        if (stats.x == 6 && stats.y == 16) {
          stats.keys += 1;
          stats.key1 = true;
        }
      }
    },

    getKeys: function() {
      return {
        keys: stats.keys,
        key1: stats.key1
      };
    },

    doorCheck: function(key) {
      if (stats.x == 1 && stats.y == 14) {
        if (key.key1 == false) {
          appController.lost();
        }
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
    keysCounter: document.querySelector(".keysCounter")
  };

  var selectCell = function(pos) {
    currRow = DOMStrings.table.querySelectorAll("tr")[pos.x];
    currCell = currRow.querySelectorAll("th")[pos.y];
    return currCell;
  };

  DOMStrings.winCell = selectCell({ x: 12, y: 18 });
  DOMStrings.keyCell = selectCell({x: 6, y: 16});
  DOMStrings.doorCell = selectCell({ x: 1, y: 14 });

  return {
    init: function(pos, i) {
      currentCell = selectCell(pos);
      currentCell.style.background = "blue";
      DOMStrings.winCell.style.background = "lime";
      DOMStrings.winCell.id = "win";
      DOMStrings.keyCell.id = "keyCell";
      DOMStrings.doorCell.id = "doorCell";
      DOMStrings.keysCounter.innerHTML = "0";
      if (i) {
        DOMStrings.arrow.removeChild(DOMStrings.arrow.firstChild);
      }
    },

    check: function(pos,key) {
      let currentCell;
      currentCell = selectCell(pos);
      if (currentCell.id == "red" || (currentCell.id == "doorCell" && key.key1 == false) ) {
        return false;
      } else {
        return true;
      }
    },

    clearCurrCell: function(pos) {
      currentCell = selectCell(pos);
      currentCell.removeAttribute("style");
    },

    arrowChange: function(dir) {
      DOMStrings.arrow.innerHTML = "<i class='fas fa-arrow-" + dir + "'></i>";
    },

    move: function(pos) {
      currentCell.removeAttribute("style");
      currentCell = selectCell(pos);
      currentCell.style.background = "blue";
    },

    keyGot: function(key) {
      DOMStrings.keysCounter.innerHTML = key.keys;
      if (key.key1) {
        DOMStrings.keyCell.id = "";
      }
    }
  };
})();

// APP CONTROLLER

var appController = (function(gameCtrl, UICtrl) {
  var pos, dir, isRed, isBorder, posTemp, appStart, key, stats;

  window.addEventListener("keypress", event => {
    let arrowDir;
    gameCtrl.listener(event.keyCode);
    arrowDir = gameCtrl.getDirection();
    UICtrl.arrowChange(arrowDir);
  });

  window.setInterval(function() {
    dir = gameCtrl.getDirection();
    //move stats
    gameCtrl.move(dir);

    // check border
    isBorder = gameCtrl.check();
    if (isBorder) {
      pos = gameCtrl.getPosition();

      // check red
      isRed = UICtrl.check(pos,key);

      //check stats if its not border and not red
      if (isRed) {
        // get position
        posTemp = gameCtrl.getPosition();
        // log position
        // console.log(pos);

        // check if got the key
        gameCtrl.keyCheck();

        // get keys quantity
        key = gameCtrl.getKeys();

        // UI keys update
        if (key.keys) {
          UICtrl.keyGot(key);
        }

        // door check
        // gameCtrl.doorCheck(key);


        
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
  }, 1000);

  return {
    start: function() {
      // set stats to 0
      gameCtrl.init();
      // get start position
      stats = gameCtrl.getPosition();
      // set UI to start
      UICtrl.init(stats, appStart);
      dir = "";
      isRed = "";
      if (!appStart) {
        console.log("Application has started!");
      } else {
        console.log("Application has restarted!");
      }
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
    }
  };
})(gameController, UIController);

appController.start();
