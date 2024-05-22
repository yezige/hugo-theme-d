import {
  setFancybox,
  setToggle,
  loadComments,
  delEmptyThtd,
  setHeaderHide,
  setLightDarkSwitch,
  startProgress,
  setProgress,
  setReadProgress,
  getReadProgress,
  set18Prompt,
  setPassword
} from '/js/util.js'

document.addEventListener('DOMContentLoaded', function () {
  setLightDarkSwitch()
  getReadProgress()
  setHeaderHide()
  setProgress()
  delEmptyThtd()
  setFancybox()
  setToggle()
  // 跳转时加载顶部进度条
  for (const row of document.querySelectorAll('a')) {
    row.addEventListener('click', function () {
      startProgress()
    })
  }

  set18Prompt(['bazong']).then((res) => {
    setPassword()
  })
})

window.loadComments = loadComments
