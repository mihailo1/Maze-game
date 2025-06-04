// ################ GAME STATE ################

const GameState = (() => {
  const state$ = new rxjs.BehaviorSubject({ x: 0, y: 0, time: 1000, direction: '', keys: 0, doorsPassed: [] });
  return {
    get: () => state$.getValue(),
    set: newState => state$.next({ ...state$.getValue(), ...newState }),
    reset: () => state$.next({ x: 0, y: 0, time: 1000, direction: '', keys: 0, doorsPassed: [] }),
    asObservable: () => state$.asObservable(),
  };
})();

// ################ MAZE MODEL ################

const Maze = (() => {
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
  let currentLevel = 'level1';
  const getWinPositionFromMaze = maze => {
    for (let x = 0; x < maze.length; x++) for (let y = 0; y < maze[x].length; y++) if (maze[x][y] === 2) return { x, y };
    return { x: 0, y: 0 };
  };
  return {
    get: () => mazeStructures[currentLevel],
    setLevel: level => mazeStructures[level] ? (currentLevel = level, true) : false,
    getCurrentLevel: () => currentLevel,
    getAvailableLevels: () => Object.keys(mazeStructures),
    getWinPosition: () => getWinPositionFromMaze(mazeStructures[currentLevel]),
    reset: () => {
      mazeStructures.level1 = initialMazeStructures.level1.map(row => [...row]);
      mazeStructures.level2 = initialMazeStructures.level2.map(row => [...row]);
    },
  };
})();

// ################ GAME CONTROLLER ################

const gameController = ((GameState, Maze) => ({
  getMazeStructure: Maze.get,
  getWinPosition: Maze.getWinPosition,
  setLevel: Maze.setLevel,
  getCurrentLevel: Maze.getCurrentLevel,
  getAvailableLevels: Maze.getAvailableLevels,
  init: GameState.reset,
  getPosition: () => { const { x, y } = GameState.get(); return { x, y }; },
  listener: code => {
    let direction = GameState.get().direction;
    direction = code === 100 ? 'right' : code === 97 ? 'left' : code === 119 ? 'up' : code === 115 ? 'down' : direction;
    GameState.set({ direction });
  },
  getDirection: () => GameState.get().direction,
  move: dir => {
    let { x, y } = GameState.get();
    dir === 'down' ? x++ : dir === 'up' ? x-- : dir === 'right' ? y++ : dir === 'left' ? y-- : null;
    GameState.set({ x, y });
  },
  frameCheck: () => { const { x, y } = GameState.get(); return !(x < 0 || y < 0 || x > 18 || y > 18); },
  didWin: () => { const { x, y } = GameState.get(); const maze = Maze.get(); return maze[x] && maze[x][y] === 2; },
  keyCheck: () => {
    const state = GameState.get(), maze = Maze.get();
    if (maze[state.x] && maze[state.x][state.y] === 3) { maze[state.x][state.y] = 0; GameState.set({ keys: state.keys + 1 }); return true; }
    return false;
  },
  getKeys: () => ({ keys: GameState.get().keys }),
  doorCheck: () => {
    const state = GameState.get(), maze = Maze.get();
    if (maze[state.x] && maze[state.x][state.y] === 4) {
      if (state.keys > 0) {
        const doorPosition = `${state.x},${state.y}`;
        if (!state.doorsPassed.includes(doorPosition)) {
          maze[state.x][state.y] = 0;
          GameState.set({ keys: state.keys - 1, doorsPassed: [...state.doorsPassed, doorPosition] });
          return true;
        }
      }
      return false;
    }
    return true;
  },
  getStateObservable: GameState.asObservable,
  resetMaze: Maze.reset,
}))(GameState, Maze);

// ################ UI CONTROLLER ################

const UIController = (() => {
  const DOMStrings = {
    table: document.querySelector('table'),
    keysCounter: document.querySelector('.keysCounter'),
    timeCounter: document.querySelector('.timeCounter'),
    select: document.querySelector('select'),
    progressBar: document.querySelector('.progress'),
    themeToggle: document.querySelector('.theme-toggle'),
    levelSelect: document.querySelector('.level-select'),
  };
  const buildMazeTable = mazeStructure => {
    const tbody = document.createElement('tbody');
    mazeStructure.forEach(row => {
      const tr = document.createElement('tr');
      row.forEach(cell => {
        const th = document.createElement('th');
        cell === 1 ? th.id = 'red' : cell === 2 ? (th.id = 'win', th.style.background = 'lime') : cell === 3 ? th.id = 'keyCell' : cell === 4 ? th.id = 'doorCell' : null;
        tr.appendChild(th);
      });
      tbody.appendChild(tr);
    });
    DOMStrings.table.innerHTML = '';
    DOMStrings.table.appendChild(tbody);
  };
  const selectCell = pos => DOMStrings.table.querySelectorAll('tr')[pos.x]?.querySelectorAll('th')[pos.y] || null;
  let currentCell;
  return {
    init: (pos, i, maze) => { buildMazeTable(maze); currentCell = selectCell(pos); currentCell && (currentCell.style.background = 'blue'); DOMStrings.keysCounter.innerHTML = '0'; DOMStrings.progressBar.style.width = '0%'; i && currentCell && (currentCell.innerHTML = ''); },
    populateLevelSelect: (levels, currentLevel) => {
      if (!DOMStrings.levelSelect) {
        const selectContainer = document.createElement('div'); selectContainer.className = 'level-select-container';
        const label = document.createElement('label'); label.textContent = 'Level: ';
        const select = document.createElement('select'); select.className = 'level-select';
        selectContainer.appendChild(label); selectContainer.appendChild(select);
        const difficultySelect = DOMStrings.select.parentElement;
        difficultySelect.parentElement.insertBefore(selectContainer, difficultySelect);
        DOMStrings.levelSelect = select;
      }
      DOMStrings.levelSelect.innerHTML = '';
      levels.forEach(level => {
        const option = document.createElement('option');
        option.value = level;
        option.textContent = `${level.charAt(0).toUpperCase()}${level.slice(1, -1)}: ${level.slice(-1)}`;
        option.selected = level === currentLevel;
        DOMStrings.levelSelect.appendChild(option);
      });
    },
    getLevelSelectValue: () => DOMStrings.levelSelect ? DOMStrings.levelSelect.value : null,
    check: (pos, key, maze) => {
      const currentCell = selectCell(pos);
      const cellValue = maze[pos.x][pos.y];
      return !!currentCell && cellValue !== 1 && !(cellValue === 4 && key.keys === 0);
    },
    clearCurrCell: pos => { currentCell = selectCell(pos); currentCell && (currentCell.removeAttribute('style'), currentCell.innerHTML = ''); },
    arrowChange: dir => { currentCell && dir && (currentCell.innerHTML = `<div style='position: absolute'><div class='arrow' style='position: relative; bottom: 8px; right: 6px'><i class='fas fa-arrow-${dir}'></i></div></div>`); },
    move: pos => { if (currentCell && pos) { let temp = currentCell.innerHTML; currentCell.innerHTML = ''; currentCell.removeAttribute('style'); currentCell = selectCell(pos); currentCell && (currentCell.id === 'keyCell' && (currentCell.id = ''), currentCell.innerHTML = temp, currentCell.style.background = 'blue'); } },
    keyGot: key => { key && key.keys !== undefined && (DOMStrings.keysCounter.innerHTML = key.keys); },
    timeUpdate: (time, timeRate) => { !isNaN(time) && (DOMStrings.progressBar.style.width = Math.min(100, Math.round(time / 3) * timeRate) + '%'); },
    getSelectValue: () => DOMStrings.select.options[DOMStrings.select.selectedIndex].value,
    getDOMStrings: () => DOMStrings,
    toggleTheme: () => { document.body.classList.toggle('dark-theme'); localStorage.setItem('darkTheme', document.body.classList.contains('dark-theme')); },
    loadTheme: () => { localStorage.getItem('darkTheme') === 'true' && document.body.classList.add('dark-theme'); },
  };
})();

// ################ APP CONTROLLER ################

const appController = (function (gameCtrl, UICtrl) {
  let pos, dir, isValid, isBorder, posTemp, appStart = 0, key;
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

  const pauseAnd = fn => { pauseGame(); setTimeout(fn, 100); };

  return {
    start() {
      cleanupSubscriptions(); resumeGame(); gameCtrl.resetMaze(); gameCtrl.init();
      pos = gameCtrl.getPosition();
      UICtrl.init(pos, appStart, gameCtrl.getMazeStructure());
      UICtrl.populateLevelSelect(gameCtrl.getAvailableLevels(), gameCtrl.getCurrentLevel());
      dir = ""; this.difficultySwitch(); time = 0; appStart = 1; setupEventListeners();
    },
    lost: () => { pauseAnd(() => appController.start()); alert("You lost!"); if (posTemp) UICtrl.clearCurrCell(posTemp); },
    win: () => { pauseAnd(() => appController.start()); alert("You won!"); if (posTemp) UICtrl.clearCurrCell(posTemp); },
    difficultySwitch: () => {
      const diff = UICtrl.getSelectValue();
      cleanupSubscriptions();
      diff === "1" ? (timeInterval = 1200, timeRate = 1) :
        diff === "2" ? (timeInterval = 850, timeRate = 1.4) :
          diff === "3" ? (timeInterval = 500, timeRate = 2.4) : null;
      setupGameLoopObservable();
    },
    levelSwitch: () => {
      const level = UICtrl.getLevelSelectValue();
      if (level && gameCtrl.setLevel(level)) { pauseGame(); cleanupSubscriptions(); appController.start(); }
    },
    init: () => { UICtrl.loadTheme(); setupKeyPressObservable(); setupTimerObservable(); appController.start(); },
    toggleTheme: () => UICtrl.toggleTheme(),
  };
})(gameController, UIController);

document.addEventListener("DOMContentLoaded", () => {
  appController.init();
});
