const mainState = {
  addPipe: function () {
    const pipeHolePosition = game.rnd.between(50, 430 - this.pipeHole);

    const upperPipe = this.pipes.create(320, pipeHolePosition - 460,('purplePipe'));
    game.physics.arcade.enable(upperPipe);
    upperPipe.body.velocity.x = -this.birdSpeed;
    upperPipe.events.onOutOfBounds.add((pipe) => {
      pipe.destroy();
    });

    const lowerPipe = this.pipes.create(320, pipeHolePosition + this.pipeHole, 'purplePipe');
    game.physics.arcade.enable(lowerPipe);
    lowerPipe.body.velocity.x = -this.birdSpeed;
    lowerPipe.events.onOutOfBounds.add((pipe) => {
      pipe.destroy();
    });

    this.birdJustCrossedPipes = false;
  },

  /*colourShiftR: function () {
    this.bird = game.add.sprite(x, y, 'redBird');
  },

var redShift;
var yellowShift;
var greenShift;
var purpleShift;*/

  create: function () {
    game.stage.backgroundColor = '#87CEEB';
    game.stage.disableVisibilityChange = true;

    this.bird = game.add.sprite(80, 40, 'bird');
    this.bird.anchor.set(0.5);
    this.birdSpeed = 200;
    this.birdFlapPower = 450;
    this.birdJustCrossedPipes = false;
    game.physics.arcade.enable(this.bird);
    this.bird.body.gravity.y = 950;
    //this.bird.body.collideWorldBounds = true;

    /* (Rejected Code) redShift = game.input.keyboard.addKey(Phaser.Keyboard.S);
    redShift.onDown.this.bird = 'redBird';*/

    this.flapSound = game.add.audio('flap');

    this.pipes = game.add.group();
    this.pipeHole = 120;
    this.addPipe();

    game.physics.enable(Phaser.Physics.ARCADE);

    //this.ground = game.add.sprite(0, game.height * 0.9, "ground");
    //this.ground.body.immovable = true;
    //game.physics.arcade.enable(this.ground);

    this.score = 0;
    this.scoreText = game.add.text(100, 20, '0', { font: '40px Impact', fill: '#ffffff' });

    this.highScore = localStorage.getItem('HighScore');
    if (this.highScore == null) {
      localStorage.setItem('HighScore', 0);
      this.highScore = 0;
    }
    this.highScoreText = game.add.text(240, 20, this.highScore, {font: '40px Impact', fill: '#ffffff'});

    game.input.onDown.add(this.flap, this);
    game.time.events.loop(2000, this.addPipe, this);
  },

  die: function () {
    game.state.start('finalscore');
    console.log(this.score, this.highScore);
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('HighScore', this.highScore);
    }
  },

  flap: function () {
    this.flapSound.play();
    this.bird.body.velocity.y = -this.birdFlapPower;

  },

  preload: function () {
    game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.load.audio('flap', 'assets/jump.mp3');
    game.load.image('ground', 'assets/ground.png');
    game.load.image('greenPipe', 'assets/greenPipe.png');
    game.load.image('redPipe', 'assets/redPipe.png');
    game.load.image('yellowPipe', 'assets/yellowPipe.png');
    game.load.image('purplePipe', 'assets/purplePipe.png');
    game.load.image('bird', 'assets/bird.png');
    game.load.image('greenBird', 'assets/greenBird.png');
    game.load.image('redBird', 'assets/redBird.png');
    game.load.image('purpleBird', 'assets/purpleBird.png');
    game.load.image('startingPoint', 'assets/startingPoint.png');
    //game.load.image('lab', 'assets/lab.png');
  },

  update: function () {
    //game.physics.arcade.overlap(this.bird, this.pipes, this.die, null, this);
    if (this.bird.y > game.height) {
      this.die();
    }
    this.pipes.forEach((pipe) => {
      if (this.birdJustCrossedPipes === false && pipe.alive && pipe.x + pipe.width < this.bird.x) {
        this.birdJustCrossedPipes = true;
        this.updateScore();
      }
    });
    game.physics.arcade.collide(this.bird, this.pipes);
  },

  updateScore: function () {
    this.score = this.score + 1;
    this.scoreText.text = `${this.score}`;
  }

};

const finalscoreState = {
  preload: function () {
    game.load.image('finalscore', 'assets/finalscoreState.png');
  },
  create: function () {
    const finalscoreImg = game.cache.getImage('finalscore');
    game.add.sprite(
      0,
      0,
      'finalscore');
    game.input.onDown.add(() => { game.state.start('main'); });
    game.add.text(47, 260, 'Click to Try Again!', {font: '35px Impact', fill: '#ffffff' });
  }

};

const game = new Phaser.Game(350, 490);
game.state.add('main', mainState);
game.state.add('finalscore', finalscoreState);
game.state.start('main');
