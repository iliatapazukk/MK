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

const player1 = {
  player: 1,
  name: 'sonya',
  hp: 100
}
const player2 = {
  player: 2,
  name: 'subzero',
  hp: 100
}

const $arenas = document.querySelector('.arenas');
$arenas.appendChild(createPlayer(player1));
$arenas.appendChild(createPlayer(player2));

function playerWins(name){
 const $winsTitle = createElm('div', 'loseTitle');
 $winsTitle.innerText = `${name} wins`
 return $winsTitle;
}

const $randomBtn = document.querySelector('.button');

function changeHP(player) {
  const $playerLife = document.querySelector(`.player${player.player} .life`)
  player.hp -= Math.ceil(Math.random() * 40);
  if (player.hp <= 0) {
    player.hp = 0
    $randomBtn.disabled = true
  }
  $playerLife.style.width = player.hp + '%';
}


$randomBtn.addEventListener('click', () => {
  changeHP(player1)
  changeHP(player2)

  if (player1.hp <= 0) {
    $arenas.appendChild(playerWins(player2.name));
  } else if (player2.hp <= 0) {
    $arenas.appendChild(playerWins(player1.name));
  }

})

