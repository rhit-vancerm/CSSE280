/** namespace. */
var rhit = rhit || {};

rhit.getRandomInt = function (min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

rhit.PageController = class {
	constructor() {
		this.game = new rhit.Game();

		const buttons = document.querySelectorAll(".game-button");
		for (const button of buttons) {
			button.onclick = (event) => {
				const buttonIndex = parseInt(button.dataset.buttonIndex);
				this.game.pressedButtonAtIndex(buttonIndex);
				this.updateView();
			};
		}
		document.querySelector("#newGameButton").onclick = (event) => {
			this.game = new rhit.Game();
			this.updateView();
		};

		this.updateView();
	}

	updateView() {
		const buttons = document.querySelectorAll(".game-button");
		buttons.forEach((button, index) => {
			button.innerHTML = this.game.getMarkAtIndex(index);
			button.style.backgroundColor = this.game.getColorAtIndex(index);
			button.style.color = this.game.getTextColorAtIndex(index);
		});
		if (this.game.state == rhit.Game.State.INITIAL)
			document.querySelector("#gameText").innerHTML = this.game.state;
		else if (this.game.state == rhit.Game.State.WIN)
			document.querySelector("#gameText").innerHTML = `You have won in ${this.game.getMoves()} moves`;
		else
			document.querySelector("#gameText").innerHTML = `You have taken ${this.game.getMoves()} moves so far`;
	}
};

rhit.Game = class {

	static btnState = {
		ON: "1",
		OFF: "0",
	}

	static State = {
		WIN: `You have won`,
		ONGOING: `You have taken`,
		INITIAL: "Make the buttons match",
	}

	constructor() {
		this.state = rhit.Game.State.INITIAL;
		this.moves = 0;
		this.board = [];
		for (let k = 0; k < 7; k++) {
			var bstate;
			if (rhit.getRandomInt(0, 1) == 1) {
				bstate = rhit.Game.btnState.ON;
			} else {
				bstate = rhit.Game.btnState.OFF;
			}
			this.board.push(bstate);
		}
	}

	pressedButtonAtIndex(buttonIndex) {

		if (this.state == rhit.Game.State.WIN) {
			return;
		}

		this.moves++;

		if (buttonIndex == 0) {
			this.swapButtonState(buttonIndex);
			this.swapButtonState(buttonIndex + 1);
		} else if (buttonIndex == 6) {
			this.swapButtonState(buttonIndex);
			this.swapButtonState(buttonIndex - 1);
		} else {
			this.swapButtonState(buttonIndex);
			this.swapButtonState(buttonIndex + 1);
			this.swapButtonState(buttonIndex - 1);
		}

		this.state = rhit.Game.State.ONGOING;

		this._checkForGameOver();

	}

	swapButtonState(buttonIndex) {
		if (this.board[buttonIndex] == rhit.Game.btnState.ON) {
			this.board[buttonIndex] = rhit.Game.btnState.OFF;
		} else {
			this.board[buttonIndex] = rhit.Game.btnState.ON;
		}
	}

	_checkForGameOver() {

		let winCount = 0;

		for (let i = 0; i < 7; i++) {
			if (this.board[i] == rhit.Game.btnState.ON) {
				winCount++;
			} else {
				winCount--;
			}

		}

		if (winCount == 7 || winCount == -7) {
			this.state = rhit.Game.State.WIN;
		}

	}

	getMarkAtIndex(buttonIndex) {
		return this.board[buttonIndex];
	}

	getColorAtIndex(buttonIndex) {
		if (this.board[buttonIndex] == "0") {
			return "#333333";
		}
		return "#F6BE00";
	}

	getTextColorAtIndex(buttonIndex) {
		if (this.board[buttonIndex] == "1") {
			return "black";
		}
		return "white";
	}

	getMoves() {
		return this.moves;
	}

	getState() {
		return this.state;
	}
};

/* Main */
rhit.main = function () {
	console.log("Ready");

	new rhit.PageController();

};

rhit.main();