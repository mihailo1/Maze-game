// ################ GAME CONTROLLER ################

const gameController = (function () {
  const gameState$ = new rxjs.BehaviorSubject({
    x: 0,
    y: 0,
    time: 1000,
    direction: "",
    keys: 0,
    doorsPassed: [],
  });

  const initialMazeStructures = {
    level1: [
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 4, 1, 1, 1, 0],
      [0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
      [0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 3, 1, 0],
      [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 3, 1, 0],
      [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 4, 0, 0, 0, 1, 0, 0, 0],
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1],
      [0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 4, 0, 0, 0, 1, 2],
      [0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 3, 3, 1, 0],
      [1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    ],
    level2: [
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 0],
      [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 1, 0, 0, 0],
      [0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 4, 1, 0, 1, 1],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 4, 1, 0, 0, 4],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 4, 1, 1, 1, 4],
      [0, 0, 4, 4, 4, 3, 3, 3, 3, 1, 0, 1, 0, 1, 4, 4, 3, 1, 4],
      [1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 0, 1, 0, 1, 1, 1, 3, 1, 4],
      [0, 0, 0, 0, 0, 0, 0, 1, 4, 1, 0, 1, 0, 0, 0, 1, 3, 1, 4],
      [0, 1, 1, 0, 1, 1, 4, 1, 4, 1, 0, 1, 1, 1, 0, 1, 3, 1, 4],
      [0, 1, 0, 0, 0, 1, 0, 1, 4, 1, 3, 0, 0, 1, 0, 1, 3, 1, 4],
      [0, 1, 0, 1, 0, 1, 0, 1, 3, 1, 1, 1, 0, 1, 0, 1, 3, 1, 4],
      [0, 1, 4, 1, 4, 1, 0, 1, 3, 3, 4, 1, 0, 1, 0, 1, 3, 1, 2],
      [0, 1, 4, 1, 4, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
      [0, 1, 3, 1, 3, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0],
      [0, 1, 3, 1, 3, 1, 1, 1, 3, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0],
      [0, 1, 3, 3, 3, 1, 4, 0, 0, 1, 0, 1, 3, 0, 0, 0, 4, 1, 0],
      [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 3, 1, 1, 1, 1, 1, 4, 1, 0],
      [0, 0, 0, 4, 0, 0, 3, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
  };

  const mazeStructures = { ...initialMazeStructures };

  let currentLevel = "level1";

  const getWinPositionFromMaze = (maze) => {
    for (let x = 0; x < maze.length; x++) {
      for (let y = 0; y < maze[x].length; y++) {
        if (maze[x][y] === 2) {
          return { x, y };
        }
      }
    }
    return { x: 0, y: 0 };
  };

  return {
    getMazeStructure: function () {
      return mazeStructures[currentLevel];
    },

    getWinPosition: function () {
      return getWinPositionFromMaze(mazeStructures[currentLevel]);
    },

    setLevel: function (level) {
      if (mazeStructures[level]) {
        currentLevel = level;
        return true;
      }
      return false;
    },

    getCurrentLevel: function () {
      return currentLevel;
    },

    getAvailableLevels: function () {
      return Object.keys(mazeStructures);
    },

    init: function () {
      gameState$.next({
        x: 0,
        y: 0,
        time: 1000,
        direction: "",
        keys: 0,
        doorsPassed: [],
      });
    },

    getPosition: function () {
      const state = gameState$.getValue();
      return {
        x: state.x,
        y: state.y,
      };
    },

    listener: function (code) {
      const currentState = gameState$.getValue();
      let direction = currentState.direction;

      switch (code) {
        case 100:
          direction = "right";
          break;
        case 97:
          direction = "left";
          break;
        case 119:
          direction = "up";
          break;
        case 115:
          direction = "down";
          break;
      }

      gameState$.next({ ...currentState, direction });
    },

    getDirection: function () {
      return gameState$.getValue().direction;
    },

    move: function (dir) {
      const currentState = gameState$.getValue();
      let newX = currentState.x;
      let newY = currentState.y;

      switch (dir) {
        case "down":
          newX += 1;
          break;
        case "up":
          newX -= 1;
          break;
        case "right":
          newY += 1;
          break;
        case "left":
          newY -= 1;
          break;
      }

      gameState$.next({ ...currentState, x: newX, y: newY });
    },

    frameCheck: function () {
      const { x, y } = gameState$.getValue();
      return !(x < 0 || y < 0 || x > 18 || y > 18);
    },

    didWin: function () {
      const { x, y } = gameState$.getValue();
      const maze = mazeStructures[currentLevel];
      return maze[x] && maze[x][y] === 2;
    },

    keyCheck: function () {
      const state = gameState$.getValue();
      const maze = mazeStructures[currentLevel];

      if (maze[state.x] && maze[state.x][state.y] === 3) {
        maze[state.x][state.y] = 0;
        gameState$.next({ ...state, keys: state.keys + 1 });
        return true;
      }
      return false;
    },

    getKeys: function () {
      return {
        keys: gameState$.getValue().keys,
      };
    },

    doorCheck: function () {
      const state = gameState$.getValue();
      const maze = mazeStructures[currentLevel];

      if (maze[state.x] && maze[state.x][state.y] === 4) {
        if (state.keys > 0) {
          const doorPosition = `${state.x},${state.y}`;
          if (!state.doorsPassed.includes(doorPosition)) {
            maze[state.x][state.y] = 0;
            const newState = {
              ...state,
              keys: state.keys - 1,
              doorsPassed: [...state.doorsPassed, doorPosition],
            };
            gameState$.next(newState);
            return true;
          }
        }
        return false;
      }
      return true;
    },

    getStateObservable: function () {
      return gameState$.asObservable();
    },

    testing: function () {
      console.log(gameState$.getValue());
    },

    resetMaze: function () {
      [mazeStructures.level1, mazeStructures.level2] = [
        initialMazeStructures.level1,
        initialMazeStructures.level2,
      ];
    },
  };
})();

// ################ UI CONTROLLER ################

const UIController = (function () {
  const DOMStrings = {
    table: document.querySelector("table"),
    keysCounter: document.querySelector(".keysCounter"),
    timeCounter: document.querySelector(".timeCounter"),
    select: document.querySelector("select"),
    progressBar: document.querySelector(".progress"),
    themeToggle: document.querySelector(".theme-toggle"),
    levelSelect: document.querySelector(".level-select"),
  };

  const buildMazeTable = (mazeStructure) => {
    const tbody = document.createElement("tbody");

    mazeStructure.forEach((row, rowIndex) => {
      const tr = document.createElement("tr");

      row.forEach((cell, cellIndex) => {
        const th = document.createElement("th");

        switch (cell) {
          case 1:
            th.id = "red";
            break;
          case 2:
            th.id = "win";
            th.style.background = "lime";
            break;
          case 3:
            th.id = "keyCell";
            break;
          case 4:
            th.id = "doorCell";
            break;
        }

        tr.appendChild(th);
      });

      tbody.appendChild(tr);
    });

    DOMStrings.table.innerHTML = "";
    DOMStrings.table.appendChild(tbody);
  };

  const selectCell = (pos) => {
    if (DOMStrings.table.querySelectorAll("tr")[pos.x]) {
      return DOMStrings.table
        .querySelectorAll("tr")
        [pos.x].querySelectorAll("th")[pos.y];
    }
    return null;
  };

  let currentCell;

  return {
    init: function (pos, i, maze) {
      buildMazeTable(maze);

      currentCell = selectCell(pos);
      if (currentCell) {
        currentCell.style.background = "blue";
      }

      DOMStrings.keysCounter.innerHTML = "0";
      DOMStrings.progressBar.style.width = "0%";

      if (i && currentCell) {
        currentCell.innerHTML = "";
      }
    },

    populateLevelSelect: function (levels, currentLevel) {
      if (!DOMStrings.levelSelect) {
        const selectContainer = document.createElement("div");
        selectContainer.className = "level-select-container";

        const label = document.createElement("label");
        label.textContent = "Level: ";

        const select = document.createElement("select");
        select.className = "level-select";

        selectContainer.appendChild(label);
        selectContainer.appendChild(select);

        const difficultySelect = DOMStrings.select.parentElement;
        difficultySelect.parentElement.insertBefore(
          selectContainer,
          difficultySelect
        );

        DOMStrings.levelSelect = select;
      }

      DOMStrings.levelSelect.innerHTML = "";

      levels.forEach((level) => {
        const option = document.createElement("option");
        option.value = level;
        option.textContent = `${level.charAt(0).toUpperCase()}${level.slice(
          1,
          -1
        )}: ${level.slice(-1)}`;
        option.selected = level === currentLevel;
        DOMStrings.levelSelect.appendChild(option);
      });
    },

    getLevelSelectValue: function () {
      return DOMStrings.levelSelect ? DOMStrings.levelSelect.value : null;
    },

    check: function (pos, key, maze) {
      const currentCell = selectCell(pos);
      if (!currentCell) return false;

      const cellValue = maze[pos.x][pos.y];

      if (cellValue === 1) return false;

      if (cellValue === 4 && key.keys === 0) return false;

      return true;
    },

    clearCurrCell: function (pos) {
      if (pos && pos.x !== undefined && pos.y !== undefined) {
        currentCell = selectCell(pos);
        if (currentCell) {
          currentCell.removeAttribute("style");
          currentCell.innerHTML = "";
        }
      }
    },

    arrowChange: function (dir) {
      if (currentCell && dir) {
        currentCell.innerHTML = `<div style='position: absolute'><div class='arrow' style='position: relative; bottom: 8px; right: 6px'><i class='fas fa-arrow-${dir}'></i></div></div>`;
      }
    },

    move: function (pos) {
      if (currentCell && pos) {
        let temp = currentCell.innerHTML;
        currentCell.innerHTML = "";
        currentCell.removeAttribute("style");
        currentCell = selectCell(pos);
        if (currentCell) {
          if (currentCell.id === "keyCell") {
            currentCell.id = "";
          }
          currentCell.innerHTML = temp;
          currentCell.style.background = "blue";
        }
      }
    },

    keyGot: (key) => {
      if (key && key.keys !== undefined) {
        DOMStrings.keysCounter.innerHTML = key.keys;
      }
    },

    timeUpdate: function (time, timeRate) {
      if (!isNaN(time)) {
        const width = Math.min(100, Math.round(time / 3) * timeRate);
        DOMStrings.progressBar.style.width = width + "%";
      }
    },

    getSelectValue: () => {
      return DOMStrings.select.options[DOMStrings.select.selectedIndex].value;
    },

    getDOMStrings: () => DOMStrings,

    toggleTheme: function () {
      document.body.classList.toggle("dark-theme");
      const isDark = document.body.classList.contains("dark-theme");
      localStorage.setItem("darkTheme", isDark);
    },

    loadTheme: function () {
      const isDark = localStorage.getItem("darkTheme") === "true";
      if (isDark) {
        document.body.classList.add("dark-theme");
      }
    },
  };
})();

// ################ APP CONTROLLER ################

const appController = (function (gameCtrl, UICtrl) {
  let pos,
    dir,
    isValid,
    isBorder,
    posTemp,
    appStart = 0,
    key;
  let gameLoop$, keyPress$, timer$;
  let gameLoopSubscription, keyPressSubscription, timerSubscription;
  let timeRate = 1;
  let timeInterval = 1200;
  let time = 0;
  let gameActive = true;

  const setupKeyPressObservable = () => {
    keyPress$ = rxjs.fromEvent(window, "keypress").pipe(
      rxjs.operators.filter(() => gameActive),
      rxjs.operators.map((event) => event.keyCode),
      rxjs.operators.tap((code) => {
        gameCtrl.listener(code);
        UICtrl.arrowChange(gameCtrl.getDirection());
      })
    );

    keyPressSubscription = keyPress$.subscribe();
  };

  const setupTimerObservable = () => {
    timer$ = rxjs.interval(1).pipe(
      rxjs.operators.filter(() => gameActive),
      rxjs.operators.tap(() => {
        time++;
        UICtrl.timeUpdate(time, timeRate);
      })
    );

    timerSubscription = timer$.subscribe();
  };

  const setupGameLoopObservable = () => {
    gameLoop$ = rxjs.interval(timeInterval).pipe(
      rxjs.operators.filter(() => gameActive),
      rxjs.operators.tap(() => {
        time = 0;
        dir = gameCtrl.getDirection();

        if (dir) {
          gameCtrl.move(dir);
        }

        isBorder = gameCtrl.frameCheck();

        if (isBorder) {
          pos = gameCtrl.getPosition();

          key = gameCtrl.getKeys();

          const maze = gameCtrl.getMazeStructure();
          isValid = UICtrl.check(pos, key, maze);

          if (isValid) {
            posTemp = gameCtrl.getPosition();

            const doorPassed = gameCtrl.doorCheck();
            if (doorPassed !== false) {
              const currentCell = UICtrl.getDOMStrings()
                .table.querySelectorAll("tr")
                [pos.x].querySelectorAll("th")[pos.y];
              if (
                currentCell &&
                currentCell.id === "doorCell" &&
                key.keys > 0
              ) {
                currentCell.id = "";
                currentCell.removeAttribute("style");
              }

              const keyCollected = gameCtrl.keyCheck();
              if (keyCollected) {
                const keyCell = UICtrl.getDOMStrings()
                  .table.querySelectorAll("tr")
                  [pos.x].querySelectorAll("th")[pos.y];
                if (keyCell) {
                  keyCell.id = "";
                  keyCell.removeAttribute("style");
                }
              }

              key = gameCtrl.getKeys();
              UICtrl.keyGot(key);
              UICtrl.move(posTemp);

              const win = gameCtrl.didWin();
              if (win) {
                pauseGame();
                setTimeout(() => appController.win(), 100);
              }
            } else {
              pauseGame();
              setTimeout(() => appController.lost(), 100);
            }
          } else {
            pauseGame();
            setTimeout(() => appController.lost(), 100);
          }
        } else {
          pauseGame();
          setTimeout(() => appController.lost(), 100);
        }
      })
    );

    gameLoopSubscription = gameLoop$.subscribe();
  };

  const pauseGame = () => {
    gameActive = false;
  };

  const resumeGame = () => {
    gameActive = true;
  };

  const cleanupSubscriptions = () => {
    if (gameLoopSubscription) {
      gameLoopSubscription.unsubscribe();
      gameLoopSubscription = null;
    }
  };

  const setupEventListeners = () => {
    const domStrings = UICtrl.getDOMStrings();
    if (domStrings.levelSelect) {
      domStrings.levelSelect.addEventListener("change", () => {
        appController.levelSwitch();
      });
    }

    domStrings.select.addEventListener("change", () => {
      appController.difficultySwitch();
    });

    domStrings.themeToggle.addEventListener("click", () => {
      appController.toggleTheme();
    });
  };

  return {
    start: function () {
      cleanupSubscriptions();
      resumeGame();

      gameCtrl.resetMaze();
      gameCtrl.init();
      stats = gameCtrl.getPosition();

      const maze = gameCtrl.getMazeStructure();

      UICtrl.init(stats, appStart, maze);

      const levels = gameCtrl.getAvailableLevels();
      const currentLevel = gameCtrl.getCurrentLevel();
      UICtrl.populateLevelSelect(levels, currentLevel);

      dir = "";
      this.difficultySwitch();
      isValid = "";
      time = 0;

      const message = !appStart
        ? "Application has started!"
        : "Application has restarted!";
      console.log(message);

      appStart = 1;

      setupEventListeners();
    },

    lost: function () {
      pauseGame();
      alert("You lost!");
      if (posTemp) {
        UICtrl.clearCurrCell(posTemp);
      }
      appController.start();
    },

    win: function () {
      pauseGame();
      alert("You won!");
      if (posTemp) {
        UICtrl.clearCurrCell(posTemp);
      }
      appController.start();
    },

    difficultySwitch: function () {
      const diff = UICtrl.getSelectValue();

      cleanupSubscriptions();

      switch (diff) {
        case "1":
          timeInterval = 1200;
          timeRate = 1;
          break;
        case "2":
          timeInterval = 850;
          timeRate = 1.4;
          break;
        case "3":
          timeInterval = 500;
          timeRate = 2.4;
          break;
      }

      setupGameLoopObservable();
    },

    levelSwitch: function () {
      const level = UICtrl.getLevelSelectValue();
      if (level && gameCtrl.setLevel(level)) {
        pauseGame();
        cleanupSubscriptions();
        this.start();
      }
    },

    init: function () {
      UICtrl.loadTheme();

      setupKeyPressObservable();
      setupTimerObservable();

      this.start();
    },

    testing: function () {
      const cellsTest = Array.from(document.querySelectorAll("th"));
      let c = 0;
      cellsTest.forEach((el) => {
        if (el.id === "red" && c < 2) {
          el.id = "";
          c++;
        }
      });
    },

    toggleTheme: function () {
      UICtrl.toggleTheme();
    },
  };
})(gameController, UIController);

document.addEventListener("DOMContentLoaded", () => {
  appController.init();
});
