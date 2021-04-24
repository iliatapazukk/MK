export const getRandom = (num) => Math.ceil(Math.random() * num)

//
const date = new Date();
export const actionDate = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
//
export const createElm = (tag, className) => {
  const $tag = document.createElement(tag);
  if (className){
    $tag.classList.add(className);
  }
  return $tag;
}
//
export const $arenas = document.querySelector('.arenas');
//
export const createReloadButton = () => {
  const $reloadBtnWrapper = createElm('div', 'reloadWrap');
  const $reloadBtn = createElm('button', 'button');
  $reloadBtn.innerText = 'Reload';

  $reloadBtn.addEventListener('click', () => {
    window.location.reload()
  })

  $reloadBtnWrapper.appendChild($reloadBtn);
  $arenas.appendChild($reloadBtnWrapper)
}
//
export const showResultText = (name) => {
  const $winsTitle = createElm('div', 'loseTitle');
  if (name) {
    $winsTitle.innerText = `${name} wins`
  } else {
    $winsTitle.innerText = `draw`
  }
  return $winsTitle;
}
