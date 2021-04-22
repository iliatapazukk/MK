import logs from './modules/logs.js';
import { player1, player2 } from './modules/players.js';
import {
  getRandom,
  actionDate,
  createElm,
  createReloadButton,
  showResultText,
  $arenas
} from './modules/utils.js';
import { HIT, ATTACK } from './modules/battle.js'

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

$arenas.appendChild(createPlayer(player1));
$arenas.appendChild(createPlayer(player2));


const $formFight = document.querySelector('.control')

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

function showResult() {
  if (player1.hp === 0 && player1.hp < player2.hp) {
    $arenas.appendChild(showResultText(player2.name));
    generateLogs('end', player2.name, player1.name)
  } else if (player2.hp === 0 && player2.hp < player1.hp) {
    $arenas.appendChild(showResultText(player1.name));
    generateLogs('end', player1.name, player2.name)
  } else if (player1.hp === 0 && player2.hp === 0) {
    $arenas.appendChild(showResultText());
    generateLogs('draw')
  }

  if (player1.hp === 0 || player2.hp === 0) {
    $randomBtn.disabled = true;
    $form.remove()
    createReloadButton();
  }
}

function playerAttack () {
  const attack = {}
  for (let item of $formFight){
    if(item.checked && item.name === 'hit'){
      attack.value = getRandom(HIT[item.value])
      attack.hit = item.value
    }
    if(item.checked && item.name === 'defence'){
      attack.defence = item.value
    }
    item.checked = false;
  }
  return attack
}

const $chat = document.querySelector('.chat');

function generateLogs(type, player1, player2) {
  let el;
  let text;
  switch (type) {
    case 'hit':
      text = logs[type][getRandom(logs[type].length - 1) - 1].replace(
        '[playerKick]', '<b style="text-transform: uppercase">' + player1.name + '</b>'
      ).replace(
        '[playerDefence]', '<b style="text-transform: uppercase">' + player2.name + '</b>'
      );
      el = '<p><samp style="color: rgba(255,255,255,0.5)">'+actionDate+'</samp>'+' '+text+' '+(-player2.hp)+' '+player1.hp+'</p>';
      break;
    case 'defence':
      logs[type][getRandom(logs[type].length - 1) - 1].replace(
        '[playerKick]', '<b style="text-transform: uppercase">' + player2.name + '</b>'
      ).replace(
        '[playerDefence]', '<b style="text-transform: uppercase">' + player1.name + '</b>'
      )
      el = '<p><samp style="color: rgba(255,255,255,0.5)">'+actionDate+'</samp>'+' '+text+'</p>';
      break;
    case 'start':
      text = logs[type].replace(
        '[time]', '<b style="text-transform: uppercase">' + actionDate + '</b>'
      ).replace(
        '[player1]', '<b style="text-transform: uppercase">' + player1.name + '</b>'
      ).replace(
        '[player2]',
        '<b style="text-transform: uppercase">' + player2.name + '</b>'
      );
      el = '<p>'+text+'</p>';
      break;
    case 'end':
      console.log('end', type)
      text = logs[type][getRandom(logs[type].length - 1)-1].replace(
        '[playerWins]', '<b style="text-transform: uppercase; color: green;">' +player1+ '</b>'
      ).replace('[playerLose]', '<b style="text-transform: uppercase; color: red;">' +player2+ '</b>');
      el = '<p>'+text+'</p>';
      break;
    case 'draw':
      text = logs.draw
      el = '<p>'+text+'</p>';
      break;
    default:
      el = '<p>'+'ничего не поймали'+'</p>';
  }
  $chat.insertAdjacentHTML('afterbegin', el)
}

let started = true
if (started) {
  generateLogs('start', player1, player2);
}

$formFight.addEventListener('submit',  (event) => {
  event.preventDefault();

  started = false
  const enemy = enemyAttack()
  const player = playerAttack()

  if (player1.defence !== enemy.hit){
    player1.changeHP(enemy.value);
    player1.renderHP();
    generateLogs('hit', player2, player1);
  } else {
    generateLogs('defence', player2, player1);
  }

  if (enemy.defence !== player.hit){
    player2.changeHP(player.value);
    player2.renderHP();
    generateLogs('hit', player1, player2);
  } else {
    generateLogs('defence', player1, player2);
  }
  showResult();
})