// const player1 = {
//   name: 'player1',
//   hp: 100,
//   img: 'string',
//   weapon: [
//     'revolver',
//     'branch',
//     'stone',
//   ],
//   attack: () => {
//     console.log(player1.name + ' ' + 'Fight...')
//   }
// }
// console.log(player1)
let createElm;
createElm = () => document.createElement('div')

function createPlayer(id, name, life){
  const $player1 = createElm()
  $player1.classList.add(id)

  const $progressbar = createElm()
  $progressbar.classList.add('progressbar')

  const $character = createElm()
  $character.classList.add('character')

  const $characterImg = document.createElement('img')
  $characterImg.setAttribute('src', `http://reactmarathon-api.herokuapp.com/assets/${name}.gif`)

  $character.appendChild($characterImg)

  $player1.appendChild($progressbar)
  $player1.appendChild($character)

  const $life = createElm()
  $life.classList.add('life')
  $life.style.width = `${life}%`;

  const $name = createElm()
  $name.classList.add('name')
  $name.innerText = name

  $progressbar.appendChild($life)
  $progressbar.appendChild($name)

  const $root = document.querySelector('.arenas')
  $root.appendChild($player1)
}
const player1 = {id: 'player1', name: 'sonya', life: 50}
const player2 = {id: 'player2', name: 'subzero', life: 80}

createPlayer(player1.id, player1.name, player1.life);
createPlayer(player2.id, player2.name, player2.life);
