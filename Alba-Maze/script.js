// GAME CONTROLLER
var gameController = (function() {
  var stats = {
    x: 0,
    y: 0,
    time: 1000,
    direction: "",
    keys: [false, false, false, false],
    door1: false,
    door2: false,
    door3: false,
    door4: false
  };

  var keyDecremention = function() {
    for (i = 0; i < stats.keys.length; i++) {
      if (stats.keys[i]) {
        stats.keys[i] = false;
        break;
      }
    }
  };

  return {
    init: function() {
      stats.x = 0;
      stats.y = 0;
      stats.time = 1000;
      stats.direction = "";
      stats.keys = 0;
      stats.keys = [false, false, false, false];
      stats.door1 = false;
      stats.door2 = false;
      stats.door3 = false;
      stats.door4 = false;
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

    keyCheck: function() {
      // check if key #1 has been collected
      if (!stats.keys[0]) {
        //check if you are at key cell, update stats     //-- (stats.x == 4 && stats.y == 2)
        if (stats.x == 6 && stats.y == 16) {
          stats.keys[0] = true;
        }
      }
      // check if key #2 has been collected
      if (!stats.keys[1]) {
        //check if you are at key cell, update stats
        if (stats.x == 8 && stats.y == 16) {
          stats.keys[1] = true;
        }
      }
      // check if key #3 has been collected
      if (!stats.keys[2]) {
        //check if you are at key cell, update stats
        if (stats.x == 14 && stats.y == 15) {
          stats.keys[2] = true;
        }
      }
      // check if key #4 has been collected
      if (!stats.keys[3]) {
        //check if you are at key cell, update stats
        if (stats.x == 14 && stats.y == 16) {
          stats.keys[3] = true;
        }
      }
    },

    getKeys: function() {
      var temp;
      temp = 0;
      for (i = 0; i < stats.keys.length; i++) {
        if (stats.keys[i]) {
          temp++;
        }
      }

      return {
        keys: temp,
        key1: stats.key1
      };
    },

    doorCheck: function() {
      // check if door #1 has been opened
      if (!stats.door1) {
        // check if you are at door cell, update stats     //-- (stats.x == 2 && stats.y == 1)
        if (stats.x == 1 && stats.y == 14) {
          keyDecremention();
          stats.door1 = true;
        }
      }
      // check if door #2 has been opened
      if (!stats.door2) {
        // check if you are at door cell, update stats
        if (stats.x == 12 && stats.y == 13) {
          keyDecremention();
          stats.door2 = true;
        }
      }
      // check if door #3 has been opened
      if (!stats.door3) {
        // check if you are at door cell, update stats
        if (stats.x == 13 && stats.y == 14) {
          keyDecremention();
          stats.door3 = true;
        }
      }
      // check if door #4 has been opened
      if (!stats.door4) {
        // check if you are at door cell, update stats
        if (stats.x == 10 && stats.y == 11) {
          keyDecremention();
          stats.door4 = true;
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
  var time;
  var DOMStrings = {
    table: document.querySelector("table"),
    keysCounter: document.querySelector(".keysCounter"),
    timeCounter: document.querySelector(".timeCounter")
  };

  var selectCell = function(pos) {
    currRow = DOMStrings.table.querySelectorAll("tr")[pos.x];
    currCell = currRow.querySelectorAll("th")[pos.y];
    return currCell;
  };

  DOMStrings.winCell = selectCell({ x: 12, y: 18 });
  DOMStrings.keyCells = [
    selectCell({ x: 6, y: 16 }),
    selectCell({ x: 8, y: 16 }),
    selectCell({ x: 14, y: 15 }),
    selectCell({ x: 14, y: 16 })
  ];

  DOMStrings.doorCells = [
    selectCell({ x: 1, y: 14 }),
    selectCell({ x: 12, y: 13 }),
    selectCell({ x: 13, y: 14 }),
    selectCell({ x: 10, y: 11 })
  ];

  /* DOMStrings.keyCell1 = selectCell({ x: 4, y: 2 });
  DOMStrings.doorCell = selectCell({ x: 2, y: 1 }); */

  return {
    init: function(pos, i) {
      currentCell = selectCell(pos);
      currentCell.style.background = "blue";
      DOMStrings.winCell.style.background = "lime";
      DOMStrings.winCell.id = "win";
      DOMStrings.winCell.innerHTML = '';

      for (let i = 0; i < DOMStrings.keyCells.length; i++) {
        DOMStrings.keyCells[i].id = "keyCell";
      }

      for (let i = 0; i < DOMStrings.doorCells.length; i++) {
        DOMStrings.doorCells[i].id = "doorCell";
      }

      DOMStrings.keysCounter.innerHTML = "0";
      if (i) {
        currentCell.innerHTML = "";
      }
    },

    check: function(pos, key) {
      let currentCell;
      currentCell = selectCell(pos);
      if (
        currentCell.id == "red" ||
        (currentCell.id == "doorCell" && key.keys == 0)
      ) {
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
       currentCell.innerHTML = "<div style='position: absolute'><div class='arrow' style='position: relative; bottom: 8px; right: 6px'><i class='fas fa-arrow-" + dir + "'></i></div></div>";
    },

    move: function(pos) {
      let temp;
      currentCell.id = "";
      temp = currentCell.innerHTML;
      currentCell.innerHTML = "";
      currentCell.removeAttribute("style");
      currentCell = selectCell(pos);
      currentCell.innerHTML = temp;
      currentCell.style.background = "blue";
    },

    keyGot: function(key) {
      DOMStrings.keysCounter.innerHTML = key.keys;
    },

    timeUpdate: function(time) {
      if (!isNaN(time)) {
        time = Math.round(time / 3);

        document.querySelector(".progress").style.width = time +'%';
      }
    }
  };
})();

// APP CONTROLLER

var appController = (function(gameCtrl, UICtrl) {
  var pos, dir, isRed, isBorder, posTemp, appStart, key, stats, time;

  window.addEventListener("keypress", event => {
    let arrowDir;
    gameCtrl.listener(event.keyCode);
    arrowDir = gameCtrl.getDirection();
    UICtrl.arrowChange(arrowDir);
  });

  window.setInterval(function() {
    time++;
    UICtrl.timeUpdate(time);
  }, 1);

  window.setInterval(function() {
    time = 0;
    dir = gameCtrl.getDirection();
    //move stats
    gameCtrl.move(dir);

    // check border
    isBorder = gameCtrl.check();
    if (isBorder) {
      pos = gameCtrl.getPosition();

      // check red
      isRed = UICtrl.check(pos, key);

      //check stats if its not border and not red
      if (isRed) {
        // get position
        posTemp = gameCtrl.getPosition();
        // log position
        // console.log(pos);

        // door check
        gameCtrl.doorCheck();

        // check if got the key
        gameCtrl.keyCheck();

        // get keys quantity
        key = gameCtrl.getKeys();

        // UI keys update
        UICtrl.keyGot(key);

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
