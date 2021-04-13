function createElm(tag, className){
  const $tag = document.createElement(tag);
  if (className){
    $tag.classList.add(className);
  }
  return $tag;
}

function createPlayer(playerObj){
  const $player = createElm('div', `player${playerObj.player}`)
  const $progressbar = createElm('div', 'progressbar')
  const $character = createElm('div', 'character')
  const $characterImg = document.createElement('img')
  $characterImg.setAttribute('src', `http://reactmarathon-api.herokuapp.com/assets/${playerObj.name}.gif`)

  $character.appendChild($characterImg);
  $player.appendChild($progressbar);
  $player.appendChild($character);

  const $life = createElm('div', 'life');
  $life.style.width = `${playerObj.hp}%`;

  const $name = createElm('div', 'name');
  $name.innerText = playerObj.name;

  $progressbar.appendChild($life);
  $progressbar.appendChild($name);

  return $player;
}

const $arenas = document.querySelector('.arenas');

function elHP(){
  return document.querySelector('.player' + this.player + ' .life');
}


function getRandom(num) {
  return Math.ceil(Math.random() * num);
}

function renderHP(){
  this.elHP().style.width = this.hp + '%';
}

function changeHP(changeHP) {
  this.hp -= changeHP;
  if (this.hp <= 0) {
    this.hp = 0
    console.log('HP ZERO', this.hp)
  }
  return this.hp;
}


const player1 = {
  player: 1,
  name: 'sonya',
  hp: 100,
  elHP: elHP,
  changeHP: changeHP,
  renderHP: renderHP,
}
const player2 = {
  player: 2,
  name: 'subzero',
  hp: 100,
  elHP: elHP,
  changeHP: changeHP,
  renderHP: renderHP,
}

$arenas.appendChild(createPlayer(player1));
$arenas.appendChild(createPlayer(player2));

function showResultText(name){
 const $winsTitle = createElm('div', 'loseTitle');
 if (name) {
   $winsTitle.innerText = `${name} wins`
 } else {
   $winsTitle.innerText = `draw`
 }
 return $winsTitle;
}

const $randomBtn = document.querySelector('.button');

$randomBtn.addEventListener('click', function() {
  player1.changeHP(getRandom(20))
  player2.changeHP(getRandom(20))
  player1.renderHP();
  player2.renderHP();

  if (player1.hp === 0 || player2.hp === 0) { $randomBtn.disabled = true }

  if (player1.hp === 0 && player1.hp < player2.hp) {
    $arenas.appendChild(showResultText(player2.name));
  } else if (player2.hp === 0 && player2.hp < player1.hp) {
    $arenas.appendChild(showResultText(player1.name));
  } else if (player1.hp === 0 && player2.hp === 0) {
    $arenas.appendChild(showResultText());
  }

})
