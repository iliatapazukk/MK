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
  elHP,
  changeHP,
  renderHP,
}
const player2 = {
  player: 2,
  name: 'subzero',
  hp: 100,
  elHP,
  changeHP,
  renderHP,
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

const $formFight = document.querySelector('.control')

const HIT = {
  head: 30,
  body: 25,
  foot: 20,
}
const ATTACK = ['head', 'body', 'foot'];

function createReloadButton() {
  const $reloadBtnWrapper = createElm('div', 'reloadWrap');
  const $reloadBtn = createElm('button', 'button');
  $reloadBtn.innerText = 'Reload';

  $reloadBtn.addEventListener('click', () => {
    window.location.reload()
  })

  $reloadBtnWrapper.appendChild($reloadBtn);
  $arenas.appendChild($reloadBtnWrapper)
}

function enemyAttack () {
  const hit = ATTACK[getRandom(3) - 1]
  const defence = ATTACK[getRandom(3) - 1]
  return {
    value: getRandom(HIT[hit]),
    hit,
    defence,
  }
}

const $randomBtn = document.querySelector('.buttonWrap .button');
const $form = document.querySelector('.control');

function hitBlock(hit, defence, damage){
  if (hit === defence){
    console.log('!!! BLOCK')
    return 0
  } else {
    console.log('!!! DAMAGE')
    return damage
  }
}

$formFight.addEventListener('submit', function (event){
  event.preventDefault();
  const enemy = enemyAttack()
  const attack = {}
  for (let item of $formFight){
    if(item.checked && item.name === 'hit'){
      attack.value = getRandom(HIT[item.value])
      attack.hit = item.value
    }
    if(item.checked && item.name === 'defence'){
      attack.defence = item.value
    }
    // item.checked = false;
  }

  if (player1.hp === 0 || player2.hp === 0) {
    $randomBtn.disabled = true;
    $form.remove()
    createReloadButton();
  }

  if (player1.hp === 0 && player1.hp < player2.hp) {
    $arenas.appendChild(showResultText(player2.name));
  } else if (player2.hp === 0 && player2.hp < player1.hp) {
    $arenas.appendChild(showResultText(player1.name));
  } else if (player1.hp === 0 && player2.hp === 0) {
    $arenas.appendChild(showResultText());
  }

  player1.changeHP(hitBlock(attack.hit, enemy.defence, attack.value))
  player2.changeHP(hitBlock(enemy.hit, attack.defence, enemy.value))

  player1.renderHP();
  player2.renderHP();

  // console.log('!!! attack', attack)
  // console.log('!!! enemy', enemy)

})