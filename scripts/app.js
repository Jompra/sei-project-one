function init() {
  //Dom Elements
  const grid = document.querySelector('.grid')
  const homeGrid = document.querySelector('.homes')
  const scoreCard = document.querySelector('#score')
  const startlives = 5
  const cells = []
  const homes = []
  let livesRemaining = startlives

  //Grid Variables
  const height = 15
  const width = 15


  //Points Increment Variables
  const jumpPoints = 10
  const homePoints = 50

  //Speed Multipliers
  let speedMultiplier = 1

  //Character Sprite Variables
  let x = 7
  let y = 14
  let scoreTally = 0
  let furthestJump = 0

  //Obstacle and Home Variables
  // TODO: find a better way of generating Zombie Initializer Lists. Harder Levels should have more!!!
  // TODO: Get all zombies for level 1 set
  //Obstacle co-ordinates arrays
  const safeCells = [1, 4, 7, 10, 13]
  const initZombie = [[12, 3], [12, 7], [12, 11], [12, 13], [12, 8], [11, 7], [10, 7]]
  const initTrain = [[6, 3], [6, 2], [6, 1], [6, 10], [6, 9], [6, 8], [4, 3], [4, 2], [4, 1], [4, 10], [4, 9], [4, 8], [2, 3], [2, 2], [2, 1], [2, 10], [2, 9], [2, 8], [5, 5], [5, 6], [5, 7], [5, 8], [5, 12], [5, 13], [5, 14], [5, 0], [3, 5], [3, 6], [3, 7], [3, 8], [3, 12], [3, 13], [3, 14], [3, 0]]
  const sprite = {
    position: [x, y],
    initialize: function () {
      if (livesRemaining > 0) {
        x = 7
        y = 14
        cells[y][x].classList.remove('sprite')
        cells[y][x].classList.add('sprite')
      } else {
        endGame()
      }

    },
    up: function () {
      if (y === 0) return
      cells[y][x].style.backgroundImage = ''
      cells[y][x].classList.remove('sprite')
      y--
      cells[y][x].classList.add('sprite')
      cells[y][x].style.backgroundImage = 'url(./assets/pupper_spr_fwd.png)'
      scoreStepIncrease()
    },
    left: function () {
      if (x === 0) return
      cells[y][x].style.backgroundImage = ''
      cells[y][x].classList.remove('sprite')
      x--
      cells[y][x].classList.add('sprite')
      cells[y][x].style.backgroundImage = 'url(./assets/pupper_spr_left.png)'
    },
    right: function () {
      if (x === width - 1) return
      cells[y][x].style.backgroundImage = ''
      cells[y][x].classList.remove('sprite')
      x++
      cells[y][x].classList.add('sprite')
      cells[y][x].style.backgroundImage = 'url(./assets/pupper_spr_right.png)'
    },
    down: function () {
      if (y === height - 1) return
      cells[y][x].style.backgroundImage = ''
      cells[y][x].classList.remove('sprite')
      y++
      cells[y][x].classList.add('sprite')
      cells[y][x].style.backgroundImage = 'url(./assets/pupper_spr_bwd.png)'
    }
  }



  //Functions
  // Randomises zombie Sprite number (get different zombie sprites each reload)
  //TODO make random number correct multiplier depending on number of sprites also refactor this so Math.Random is only called once!


  //Adding Event Listeners

  // Creates individual grid cells then fires initial Character sprite positioning

  function createCells() {
    for (let i = 0; i < height; i++) {
      const row = []
      for (let j = 0; j < width; j++) {
        const cell = document.createElement('div')
        grid.appendChild(cell)
        cell.textContent = `${i}-${j}`
        row.push(cell)
      }
      cells.push(row)
    }
    console.log(cells)
  }
  function createHomes() {
    for (let i = 0; i < 5; i++) {
      const home = document.createElement('div')
      homeGrid.appendChild(home)
      home.textContent = `home ${i}`
      homes.push(home)
      home.style.backgroundImage = 'url(./assets/safe.png)'
    }
  }
  createHomes()
  createCells() //TODO <==== Remove this and initiate on click of start button
  sprite.initialize()
  //Draws and advances trains depending on even/odd rows

  //TODO Work Out why even number rows cant have back to back trains
  //TODO ensure trains are getting correct images

  function advanceEvenRowTrains(arr) {
    for (let i = 0; i < arr.length; i++) {
      cells[initTrain[i][0]][initTrain[i][1]].classList.remove('train')
      if (initTrain[i][0] % 2 === 0 && initTrain[i][1] === width - 1) {
        detectOnTrain(i)
        initTrain[i][1] = 0
      } else if (initTrain[i][0] % 2 === 0) {
        detectOnTrain(i)
        initTrain[i][1]++
      }
      cells[initTrain[i][0]][initTrain[i][1]].classList.add('train')



    }
  }

  function advanceOddRowTrains(arr) {

    for (let i = 0; i < arr.length; i++) {
      cells[initTrain[i][0]][initTrain[i][1]].classList.remove('train')
      if (initTrain[i][0] % 2 !== 0 && initTrain[i][1] === 0) {
        detectOnTrain(i)
        initTrain[i][1] = width - 1
      } else if (initTrain[i][0] % 2 !== 0) {
        detectOnTrain(i)
        initTrain[i][1]--
      }
      cells[initTrain[i][0]][initTrain[i][1]].classList.add('train')
    }
  }

  setInterval(() => {
    advanceEvenRowTrains(initTrain)
  }, 1000 * speedMultiplier)

  setInterval(() => {
    advanceOddRowTrains(initTrain)
  }, 750 * speedMultiplier)

  function detectOnTrain(i) {
    if (y === initTrain[i][0] && x === initTrain[i][1]) {

      console.log('on train')
      if (y % 2 === 0) {
        sprite.right()
      } else {
        sprite.left()
      }
    }
  }

  // gets player 1's key presses from Arrow key Dpad
  window.onkeyup = function (event) {
    switch (event.keyCode) {
      case 37:
        sprite.left()
        // moveLeft()
        detectCollision()
        break
      case 38:
        sprite.up()
        // moveUp()
        detectCollision()
        detectSafe()
        detectOnTrain()
        break
      case 39:
        sprite.right()
        // moveRight()
        detectCollision()
        break
      case 40:
        sprite.down()
        // moveDown()
        detectCollision()
        break
    }
  }

  function randomizeZombies() {
    for (let i = 0; i <= initZombie.length - 1; i++) {
      const sprite = Math.ceil(Math.random() * 4)
      initZombie[i].push(sprite)
    }
  }

  randomizeZombies() // TODO Make this happen at a more appropriate time

  // Increments the furthest jump variable only if the sprite is advancing further than it has previously
  // Also increments score variable by Jump Points and pushes score to score span in HTML
  // ? Was a challenge to work out as I wanted to keep true to the original scoring system 
  function scoreStepIncrease() {
    if (height - y - 1 > furthestJump) {
      furthestJump++
      displayScore(jumpPoints)
    }
  }

  function displayScore(increment) {
    scoreTally += increment
    scoreCard.textContent = scoreTally
  }


  //* Deals with obstical Movement

  //Takes values in initZombie array and places them on the grid, also inc/decrements x value based on even/odd y value 
  function advanceZombies() {
    for (let i = 0; i < initZombie.length; i++) {
      let direction = ''
      cells[initZombie[i][0]][initZombie[i][1]].classList.remove('zombie')
      cells[initZombie[i][0]][initZombie[i][1]].style.backgroundImage = ''
      if (initZombie[i][0] % 2 === 0 && initZombie[i][1] === width - 1) {
        initZombie[i][1] = 0
        direction = 'R'
      } else if (initZombie[i][0] % 2 === 0) {
        direction = 'R'
        initZombie[i][1]++
      } else if (initZombie[i][0] % 2 !== 0 && initZombie[i][1] === 0) {
        initZombie[i][1] = width - 1
        direction = 'L'
      } else {
        initZombie[i][1]--
        direction = 'L'
      }

      cells[initZombie[i][0]][initZombie[i][1]].classList.add('zombie')
      cells[initZombie[i][0]][initZombie[i][1]].style.backgroundImage = `url(../assets/zombies/${direction}_${initZombie[i][2]}.png)`
    }
    detectCollision()
  }



  //calls the advance zombies in 1 second increments
  //TODO: link speed multiplier to level dificulty
  setInterval(() => {
    advanceZombies(initZombie)
  }, 500)

  //detects whether the sprite has colided with a cell containing class zombie or a cell on tracks that doesn't contain class train
  function detectCollision() {
    if (y > 7) {
      if (cells[y][x].classList.contains('zombie')) {
        console.log(`x=${x} y=${y}`)
        cells[y][x].classList.remove('sprite')
        x = 7
        y = height - 1
        sprite.initialize()
        livesRemaining--
        console.log(livesRemaining)
      }
    } else if (y < 7 && y > 1) {
      if (!cells[y][x].classList.contains('train')) {
        console.log('SPLASH')
        cells[y][x].style.backgroundImage = ''
        cells[y][x].classList.remove('sprite')
        sprite.initialize()
        livesRemaining--
        console.log(livesRemaining)
      }

    }



  }
  function detectSafe() {
    console.log('ran detectSafe')
    if (x === 1 && y === 1) {
      homes[0].style.backgroundImage = 'url(./assets/safe_active.png)'
      sprite.initialize()
      displayScore(homePoints)
      furthestJump = 0
    } else if (x === 4 && y === 1) {
      homes[1].style.backgroundImage = 'url(./assets/safe_active.png)'
      sprite.initialize()
      displayScore(homePoints)
      furthestJump = 0
    } else if (x === 7 && y === 1) {
      homes[2].style.backgroundImage = 'url(./assets/safe_active.png)'
      sprite.initialize()
      displayScore(homePoints)
      furthestJump = 0
    } else if (x === 10 && y === 1) {
      homes[3].style.backgroundImage = 'url(./assets/safe_active.png)'
      sprite.initialize()
      displayScore(homePoints)
      furthestJump = 0
    } else if (x === 13 && y === 1) {
      homes[4].style.backgroundImage = 'url(./assets/safe_active.png)'
      sprite.initialize()
      displayScore(homePoints)
      furthestJump = 0
    }
  }
}
window.addEventListener('DOMContentLoaded', init)