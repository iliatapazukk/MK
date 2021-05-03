import {createElm} from '../modules/utils.js';

class Player{
  constructor(props) {
    this.name = props.name;
    this.hp = props.hp;
    this.img = props.img;
    this.player = props.player;
    this.selector = `player${this.player}`;
    this.rootSelector = props.rootSelector;
  }
  elHP = () => {
    return document.querySelector(`.player${this.player} .life`);
  }
  renderHP = () => {
    this.elHP().style.width = this.hp + '%';
  }
  changeHP = (changeHP) => {
    this.hp -= changeHP;
    if (this.hp <= 0) {
      this.hp = 0
    }
    return this.hp;
  }

  //create player
  createPlayer = () => {
    const $player = createElm('div', this.selector)
    const $progressbar = createElm('div', 'progressbar')
    const $character = createElm('div', 'character')
    const $characterImg = document.createElement('img')
    $characterImg.setAttribute('src', this.img)

    $character.appendChild($characterImg);
    $player.appendChild($progressbar);
    $player.appendChild($character);

    const $life = createElm('div', 'life');
    $life.style.width = `${this.hp}%`;

    const $name = createElm('div', 'name');
    $name.innerText = this.name;

    $progressbar.appendChild($life);
    $progressbar.appendChild($name);

    const $root = document.querySelector(`.${this.rootSelector}`)
    $root.appendChild($player)
    return $player;
  }

}

export default Player;