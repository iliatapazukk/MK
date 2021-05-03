import logs from '../modules/logs.js';
import Player from './players.js';
import {
  getRandom,
  actionDate,
  createElm,
  createReloadButton,
  showResultText,
  $arenas
} from '../modules/utils.js';
import { HIT, ATTACK } from '../modules/battle.js'

class Game{
  getPlayers = async () => {
  const body = fetch('https://reactmarathon-api.herokuapp.com/api/mk/players').then(response => response.json());
  return body;
  }
  start = async () => {
    const players = await this.getPlayers();

    const p1 = players[getRandom(players.length) - 1]
    const p2 = players[getRandom(players.length) - 1]

    console.log(p1, p2);

    const player1 = new Player({
      ...p1,
      player: 1,
      rootSelector: 'arenas'
    })
    const player2 = new Player({
      ...p2,
      player: 2,
      rootSelector: 'arenas'
    })

    const $formFight = document.querySelector('.control')
    // init attack
    const enemyAttack = () => {
      const hit = ATTACK[getRandom(3) - 1]
      const defence = ATTACK[getRandom(3) - 1]
      return {
        value: getRandom(HIT[hit]),
        hit,
        defence,
      }
    }
    const playerAttack = () => {
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
    //make a logs
    const $chat = document.querySelector('.chat');
    const getTextLog = (type, player1Name, player2Name) => {
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
    const generateLogs = (type, player1, player2, valueAttack) => {
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
    //make a fight
    const $randomBtn = document.querySelector('.buttonWrap .button');
    const $form = document.querySelector('.control');
    //show result
    const showResult = () => {
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
    player1.createPlayer();
    player2.createPlayer();
    generateLogs('start', player1, player2);

  }
}

export default Game;