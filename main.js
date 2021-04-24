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

function createPlayer({player, name, hp}){
  const $player = createElm('div', `player${player}`)
  const $progressbar = createElm('div', 'progressbar')
  const $character = createElm('div', 'character')
  const $characterImg = document.createElement('img')
  $characterImg.setAttribute('src', `http://reactmarathon-api.herokuapp.com/assets/${name}.gif`)

  $character.appendChild($characterImg);
  $player.appendChild($progressbar);
  $player.appendChild($character);

  const $life = createElm('div', 'life');
  $life.style.width = `${hp}%`;

  const $name = createElm('div', 'name');
  $name.innerText = name;

  $progressbar.appendChild($life);
  $progressbar.appendChild($name);

  return $player;
}

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
    generateLogs('end', player2, player1)
  } else if (player2.hp === 0 && player2.hp < player1.hp) {
    $arenas.appendChild(showResultText(player1.name));
    generateLogs('end', player1, player2)
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

function getTextLog(type, player1Name, player2Name){
  switch (type) {
    case 'start':
      return logs[type]
        .replace('[time]', `<b style="text-transform: uppercase">${actionDate}</b>`)
        .replace('[player1]', `<b style="text-transform: uppercase">${player1Name}</b>`)
        .replace('[player2]',`<b style="text-transform: uppercase">${player2Name}</b>`);
      break;
    case 'hit':
      return logs[type][getRandom(logs[type].length - 1) - 1]
        .replace('[playerKick]', `<b style="text-transform: uppercase">${player1Name}</b>`)
        .replace('[playerDefence]', `<b style="text-transform: uppercase">${player2Name}</b>`);
      break;
    case 'defence':
      return logs[type][getRandom(logs[type].length - 1) - 1]
        .replace('[playerKick]', `<b style="text-transform: uppercase">${player2Name}</b>`)
        .replace('[playerDefence]', `<b style="text-transform: uppercase"> ${player1Name}</b>`)
      break;
    case 'end':
      return logs[type][getRandom(logs[type].length - 1)-1].replace(
        '[playerWins]', `<b style="text-transform: uppercase; color: green;">${player1Name}</b>`
      ).replace('[playerLose]', `<b style="text-transform: uppercase; color: red;">${player2Name}</b>`);
      break;
    case 'draw':
      return logs.draw
      break;
    default:
      return 'ничего не поймали'
  }
}

function generateLogs(type, player1, player2, valueAttack) {
  let text = getTextLog(type, player1.name, player2.name)

  switch (type){
    case 'hit':
      text = `<samp style="color: rgba(255,255,255,0.5)">${actionDate}</samp> 
              ${text}
              <samp style="color: rgba(255,255,255,0.5)">-${valueAttack} [${player2.hp}/100]</samp>`
      break;
    case 'defence':
      text = `<samp style="color: rgba(255,255,255,0.5)">${actionDate}</samp> ${text}`
      break;
    case 'end':
    case 'draw':
      text = `<samp style="color: rgba(255,255,255,0.5)">${actionDate}</samp> ${text}`
      break;
  }

  const el = `<p>${text}</p>`;
  $chat.insertAdjacentHTML('afterbegin', el)
}

$formFight.addEventListener('submit',  (event) => {
  event.preventDefault();

  const enemy = enemyAttack()
  const player = playerAttack()

  if (player1.defence !== enemy.hit){
    player1.changeHP(enemy.value);
    player1.renderHP();
    generateLogs('hit', player2, player1, enemy.value);
  } else {
    generateLogs('defence', player2, player1);
  }

  if (enemy.defence !== player.hit){
    player2.changeHP(player.value);
    player2.renderHP();
    generateLogs('hit', player1, player2, player.value);
  } else {
    generateLogs('defence', player1, player2);
  }
  showResult();
})

const init = () => {
  generateLogs('start', player1, player2);
  $arenas.appendChild(createPlayer(player1));
  $arenas.appendChild(createPlayer(player2));
}

init();