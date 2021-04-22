export const player1 = {
  player: 1,
  name: 'sonya',
  hp: 100,
  elHP,
  changeHP,
  renderHP,
}
export const player2 = {
  player: 2,
  name: 'subzero',
  hp: 100,
  elHP,
  changeHP,
  renderHP,
}

function elHP(){
  return document.querySelector('.player' + this.player + ' .life');
}

function renderHP(){
  this.elHP().style.width = this.hp + '%';
}

function changeHP(changeHP) {
  this.hp -= changeHP;
  if (this.hp <= 0) {
    this.hp = 0
  }
  return this.hp;
}


