export default class Controller {
  constructor(model, view, sound) {
    this.model = model;
    this.view = view;
    this.sound = sound;

    this.intervalId = null;
    this.isPlaying = false;

    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
    document.addEventListener("click", this.handleClick.bind(this));

    this.view.renderStartScreen();
  }

  // для обновления игры раз в секунду
  update() {
    this.model.movePieceDown();
    this.updateView();
  }

  updateView() {
    const state = this.model.getState();
    if (state.isGameOver) {
      this.view.renderEndScreen(state);
    } else if (!this.isPlaying) {
      this.view.renderPauseScreen();
    } else {
      this.view.renderMainScreen(state);
    }
  }

  //выйти из режима паузы
  play() {
    this.isPlaying = true;
    this.startTimer();
    this.updateView();
  }

  // поставить игру на паузу
  pause() {
    this.isPlaying = false;
    this.model.playSoundIndepended("pause");
    this.stopTimer();
    this.updateView();
  }

  reset() {
    this.model.reset();
    this.model.playMusic(this.model.getState().isMusicOn);
    this.play();
  }

  startTimer() {
    const speed = 1000 - this.model.getState().level * 100;

    if (!this.intervalId) {
      this.intervalId = setInterval(
        () => {
          this.update();
        },
        speed > 0 ? speed : 100
      );
    }
  }

  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  //обработчик клавиатуры
  handleKeyDown({ code }) {
    const { isSoundOn, isMusicOn, isGameOver } = this.model.getState();

    switch (code) {
      case "KeyP": // Key P -> play/pause
        if (isGameOver) {
          this.reset();
          this.model.playMusic(isMusicOn);
        } else if (this.isPlaying) {
          this.model.pauseMusic(isMusicOn);
          this.pause();
        } else {
          this.model.playMusic(isMusicOn);
          this.play();
        }
        break;
      case "KeyM": // Key M -> music
        if (this.isPlaying && isMusicOn) {
          localStorage.setItem("isMusicOn", false);
          this.model.pauseMusic();
        } else if (this.isPlaying) {
          localStorage.setItem("isMusicOn", true);
          this.model.playMusic();
        }
        break;
      case "KeyS": // Key S -> sound
        if (this.isPlaying && isSoundOn) {
          localStorage.setItem("isSoundOn", false);
        } else if (this.isPlaying) {
          localStorage.setItem("isSoundOn", true);
        }
        break;
      case "ArrowLeft": // left arrow
        if (this.isPlaying) {
          this.model.movePieceLeft();
          this.updateView();
        }
        break;
      case "ArrowUp": // up arrow -> rotate
        if (this.isPlaying) {
          this.model.rotatePiece();
          this.updateView();
        }
        break;
      case "ArrowRight": // right arrow
        if (this.isPlaying) {
          this.model.movePieceRight();
          this.updateView();
        }
        break;
      case "ArrowDown": // down arrow
        if (this.isPlaying) {
          this.stopTimer();
          this.model.movePieceDown();
          this.updateView();
        }
        break;
    }
  }

  handleKeyUp({ code }) {
    switch (code) {
      case "ArrowDown": // down arrow
        if (this.isPlaying) {
          this.startTimer();
        }
        break;
    }
  }

  //обработчик события мыши
  handleClick({ target }) {
    const { isSoundOn, isMusicOn, isGameOver } = this.model.getState();
    const keyId = target.getAttribute("id");

    switch (keyId) {
      case "keyStart":
        if (isGameOver) {
          this.model.playMusic(isMusicOn);
          this.reset();
        } else if (this.isPlaying) {
          this.model.pauseMusic(isMusicOn);
          this.pause();
        } else {
          this.model.playMusic(isMusicOn);
          this.play();
        }
        break;
      case "keyMusic":
        if (this.isPlaying && isMusicOn) {
          localStorage.setItem("isMusicOn", false);
          this.model.pauseMusic();
        } else if (this.isPlaying) {
          localStorage.setItem("isMusicOn", true);
          this.model.playMusic();
        }
        break;
      case "keySound":
        if (this.isPlaying && isSoundOn) {
          localStorage.setItem("isSoundOn", false);
        } else if (this.isPlaying) {
          localStorage.setItem("isSoundOn", true);
        }
        break;
      case "keyLeft":
        if (this.isPlaying) {
          this.model.movePieceLeft();
          this.updateView();
        }
        break;
      case "keyUp":
        if (this.isPlaying) {
          this.model.rotatePiece();
          this.updateView();
        }
        break;
      case "keyRight": // right arrow
        if (this.isPlaying) {
          this.model.movePieceRight();
          this.updateView();
        }
        break;
      case "keyDown": // down arrow
        if (this.isPlaying) {
          this.model.movePieceDown();
          this.updateView();
        }
        break;
    }
  }
}
