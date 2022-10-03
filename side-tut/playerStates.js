const states = {
  IDLE: 0,
  RUNNING: 1,
  JUMPING: 2,
};

class State {
  constructor(state) {
    this.state = state;
  }
}

export class Idle extends State {
  constructor(player) {
    super('IDLE');
    this.player = player;
  }
  enter() {}
  handleInput(input) {}
}
