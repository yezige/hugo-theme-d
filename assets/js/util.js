import { docCookies } from './cookie.js'
import md5 from './md5.js'

const setFancybox = function() {
  if (!CONFIG.fancybox) {
    return false
  }
  document.querySelectorAll('.content :not(a) > img, .content > img').forEach((element) => {
    var $image = $(element)
    var imageLink = $image.attr('data-src') || $image.attr('src')
    var $imageWrapLink = $image.wrap(`<a class="fancybox fancybox.image" href="${imageLink}" itemscope itemtype="http://schema.org/ImageObject" itemprop="url"></a>`).parent('a')
    if ($image.is('.post-gallery img')) {
      $imageWrapLink.attr('data-fancybox', 'gallery').attr('rel', 'gallery')
    } else if ($image.is('.group-picture img')) {
      $imageWrapLink.attr('data-fancybox', 'group').attr('rel', 'group')
    } else {
      $imageWrapLink.attr('data-fancybox', 'default').attr('rel', 'default')
    }

    var imageTitle = $image.attr('title') || $image.attr('alt')
    if (imageTitle) {
      $imageWrapLink.append(`<p class="image-caption">${imageTitle}</p>`)
      // Make sure img title tag will show correctly in fancybox
      $imageWrapLink.attr('title', imageTitle).attr('data-caption', imageTitle)
    }

    if ($image.hasClass('inline')) {
      $imageWrapLink.addClass('inline')
    }
    if ($image.hasClass('center')) {
      $imageWrapLink.addClass('center')
    }
    if ($image.hasClass('right')) {
      $imageWrapLink.addClass('right')
    }
    if ($image.attr('width')) {
      $imageWrapLink.attr('width', $image.attr('width'))
    }
  })

  $.fancybox.defaults.hash = false
  $('.fancybox').fancybox({
    loop: true,
    helpers: {
      overlay: {
        locked: false
      }
    }
  })
}

const setToggle = function() {
  const menuToggle = document.querySelector('.toggle')
  const menu = document.querySelector('.menu')
  const header = document.querySelector('.showbody header')

  menuToggle.addEventListener('click', (e) => {
    menuToggle.classList.toggle('active')
    menu.classList.toggle('active')
    header.classList.toggle('active')
  })
  header.addEventListener('click', (e) => {
    e.stopPropagation()
  })
  document.addEventListener('click', () => {
    menuToggle.classList.remove('active')
    menu.classList.remove('active')
    header.classList.remove('active')
  })
}

const loadComments = function(element, callback) {
  if (!element) {
    callback()
    return
  }
  let intersectionObserver = new IntersectionObserver((entries, observer) => {
    let entry = entries[0]
    if (entry.isIntersecting) {
      callback()
      observer.disconnect()
    }
  })
  intersectionObserver.observe(element)
  return intersectionObserver
}

const delEmptyThtd = function() {
  document.querySelectorAll('thead th').forEach((element) => {
    var $th = $(element)
    if ($th.html() == '') {
      $th.remove()
    }
  })
}

// 顶部加载进度
const startProgress = async function() {
  if (document.body.clientWidth < 1024) {
    return false
  }
  NProgress.start()
  await timeout(2000)
  NProgress.done()
}
const doneProgress = function() {
  NProgress.done()
}
const setProgress = async function() {
  if (document.body.clientWidth < 1024) {
    return false
  }
  NProgress.configure({ showSpinner: false })
  NProgress.start()
  window.addEventListener('load', function() {
    NProgress.done()
  })
  await timeout(2000)
  NProgress.done()
}

const timeout = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}
const setHeaderHide = function() {
  // 间距
  const space = 100
  var lastScroll = window.pageYOffset || document.documentElement.scrollTop
  window.onscroll = function(e) {
    let currScroll = window.pageYOffset || document.documentElement.scrollTop
    let header = document.querySelector('header')
    let lightDarkSwitch = document.querySelector('.light-dark-switch')

    // 滚动条向上移动时，显示header和lightDarkSwitch
    if (currScroll <= lastScroll) {
      header.style.marginTop = '0'
      lightDarkSwitch.style.marginRight = '0'
    } else {
      header.style.marginTop = '-10rem'
      lightDarkSwitch.style.marginRight = '-100rem'
    }

    // 每到达间距更新一次lastScroll
    if (currScroll - lastScroll >= space || lastScroll - currScroll >= space) {
      lastScroll = currScroll
    }
  }
}

// 设置下载选项设置
const setCookie = function(key, value, end, path) {
  docCookies.setItem(key, JSON.stringify(value), end, path)
}

// 企取得下载选项设置
const getCookie = function(key) {
  const value = docCookies.getItem(key) || '{}'
  return JSON.parse(value)
}

const setLightDarkSwitch = function() {
  const switch_box = document.querySelector('.light-dark-switch .switch-box')
  // 显示选项事件
  switch_box.addEventListener('click', function() {
    switch_box.classList.add('active')
  })
  switch_box.addEventListener('mouseover', function() {
    switch_box.classList.add('active')
  })
  switch_box.addEventListener('mouseout', function() {
    switch_box.classList.remove('active')
  })

  // 设置切换主题点击事件
  for (const row of switch_box.querySelectorAll('.switch-item')) {
    const html = document.querySelector('html')
    row.addEventListener('click', function(e) {
      e.stopPropagation()
      const value = row.getAttribute('data-value')
      // 切换按钮选中状态
      row.parentNode.childNodes.forEach(function(element) {
        element.classList && element.classList.remove('active')
      })
      row.classList.add('active')

      // 切换主题
      html.classList.value = ''
      html.classList.add(value)

      // set cookie
      setCookie('light-dark-switch', { value: value }, false, '/')
    })
  }

  // 设置cookie中的值
  const light_dark_switch = getCookie('light-dark-switch')
  if (light_dark_switch && light_dark_switch.value) {
    switch_box.querySelector('.switch-item[data-value="' + light_dark_switch.value + '"]').click()
  }
}

const setEles = function(dom, query, callback) {
  dom = dom || document
  callback = callback || function() {}
  dom.querySelectorAll(query).forEach((res) => {
    callback(res)
  })
}

// 保存进度到cookie
const setReadProgress = function() {
  setInterval(() => {
    setCookie('progress', { value: document.documentElement.scrollTop }, 30 * 24 * 3600, document.location.pathname)
  }, 5000)
}

const getReadProgress = function() {
  const progress = getCookie('progress')
  if (progress.value) {
    window.scrollTo(0, progress.value)
  }
}

const showMask = function(data) {
  let conf = {
    title: '提示',
    content: '',
    ok: '确认',
    cancle: '关闭',
    callback_ok: function() {},
    callback_cancle: function() {}
  }
  conf = Object.assign(conf, data)

  const html = `<div class="mask_box" style="display: none;" id="mask_box">
  <div class="mask"></div>
  <div class="mask_panel">
    <div class="mask_body">
      <div class="mask_title">${conf.title}</div>
      <div class="mask_content">${conf.content}</div>
    </div>
    <div class="mask_footer">
      <div class="mask_btn">${conf.ok}</div>
      <div class="mask_btn_cancle">${conf.cancle}</div>
    </div>
  </div>
</div>`
  if (!document.getElementById('mask_box')) {
    const mask = document.createElement('div')
    mask.innerHTML = html
    document.querySelector('body').append(mask)
    // mask 事件
    mask.querySelector('.mask_box .mask_btn').addEventListener('click', (e) => {
      if (conf.callback_ok()) {
        hideMask(e.target)
      }
    })
    mask.querySelector('.mask_box .mask_btn_cancle').addEventListener('click', (e) => {
      hideMask(e.target, conf.callback_cancle)
    })
  }
  const el = document.getElementById('mask_box')
  el.style.display = 'block'
}

const showPassword = function(data) {
  let conf = {
    title: '请输入密码',
    ok: '确认',
    cancle: '关闭',
    callback_ok: function() {},
    callback_cancle: function() {}
  }
  conf = Object.assign(conf, data)

  const html = `<div class="mask_box" style="display: none;" id="mask_password">
  <div class="mask"></div>
  <div class="mask_panel">
    <div class="mask_body">
      <div class="mask_title">${conf.title}</div>
      <div class="mask_content">
        <div class="input_box">
          <!-- 假的，只用来唤起输入法输入，监听事件等 -->
          <div class="_input">
            <input class="_input_tel" type="tel">
          </div>
          <span class="input_block" id="input_block_0"></span>
          <span class="input_block" id="input_block_1"></span>
          <span class="input_block" id="input_block_2"></span>
          <span class="input_block" id="input_block_3"></span>
        </div>
        <div class="error"></div>
      </div>
    </div>
    <div class="mask_footer">
      <div class="mask_btn">${conf.ok}</div>
      <div class="mask_btn_cancle">${conf.cancle}</div>
    </div>
  </div>
</div>`
  if (!document.getElementById('mask_password')) {
    const mask = document.createElement('div')
    mask.innerHTML = html
    document.querySelector('body').append(mask)
    // mask 事件
    mask.querySelector('.mask_box .mask_btn').addEventListener('click', (e) => {
      if (conf.callback_ok()) {
        hideMask(e.target)
      }
    })
    mask.querySelector('.mask_box .mask_btn_cancle').addEventListener('click', (e) => {
      hideMask(e.target, conf.callback_cancle)
    })

    // 设置假input事件
    setEles(mask, '.input_box ._input_tel', (ele) => {
      // 输入文字时展示到方块处
      ele.addEventListener('input', (e) => {
        const block = mask.querySelector('.input_box .input_block.active')
        ele.focus()

        // 输入数字操作
        if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].indexOf(e.data) === -1) {
          return false
        }
        setEles(mask, '.input_box .input_block.active', (ele) => {
          ele.innerHTML = e.data
        })
        const next = block.nextElementSibling

        if (!next || !next.classList.contains('input_block')) {
          return false
        }
        setEles(mask, '.input_box .input_block', (ele) => {
          ele.classList.remove('active')
        })
        next.classList.add('active')
      })

      // 删除操作
      ele.addEventListener('keyup', (e) => {
        const block = mask.querySelector('.input_box .input_block.active')
        ele.focus()

        // 删除操作
        if (e.key == 'Backspace') {
          // 清空方块内容
          setEles(mask, '.input_box .input_block.active', (ele) => {
            ele.innerHTML = ''
          })
          const next = block.previousElementSibling
          if (!next || !next.classList.contains('input_block')) {
            return false
          }
          setEles(mask, '.input_box .input_block', (ele) => {
            ele.classList.remove('active')
          })
          next.classList.add('active')
        }
      })
    })
    // 方块点击事件
    setEles(mask, '.input_box .input_block', (ele) => {
      ele.addEventListener('click', (e) => {
        const curr_block = e.currentTarget
        const _input = mask.querySelector('.input_box ._input_tel')
        // 闪动光标
        setEles(mask, '.input_box .input_block', (ele) => {
          ele.classList.remove('active')
        })
        curr_block.classList.add('active')
        // 唤起输入法
        _input.focus()
      })
    })
  }
  const el = document.getElementById('mask_password')
  el.style.display = 'block'
}

const hideMask = function(e, callback) {
  callback = callback || function() {}
  let el = e ? e.closest('.mask_box') : document.querySelector('.mask_box')
  el.style.display = 'none'
  callback()
}

const set18Prompt = function(paths) {
  return new Promise((resolve, reject) => {
    paths = paths || []
    let match = false
    for (let path of paths) {
      if (decodeURI(location.href).match(new RegExp(path))) {
        match = true
        break
      }
    }
    if (!match) {
      return resolve()
    }
    const prompt_18 = getCookie('prompt_18')
    if (!prompt_18.value) {
      showMask({
        title: '可能包含成人内容',
        content: '未成年人需在监护人陪同下阅读，否则请关闭页面。',
        ok: '我已满 18 周岁',
        cancle: '关闭',
        callback_ok: function() {
          setCookie('prompt_18', { value: true }, false, document.location.pathname)
          resolve()
          return true
        },
        callback_cancle: function() {
          history.back()
        }
      })
    }
  })
}

const setPassword = function() {
  return new Promise((resolve, reject) => {
    if (typeof password == 'undefined') {
      return resolve()
    }
    const pass_cookie = getCookie('password')
    if (pass_cookie.value && pass_cookie.value == password) {
      return resolve()
    }
    showPassword({
      title: '站长自用请输入密码',
      ok: '确认',
      cancle: '关闭',
      callback_ok: function() {
        const error_ele = document.querySelector('#mask_password .error')
        let pass_ele = document.querySelector('.input_box').innerText.replaceAll('\n', '')
        if (!pass_ele) {
          error_ele.innerHTML = '密码不能为空'
          return false
        }
        const pass_value = md5(pass_ele)
        if (password != pass_value) {
          error_ele.innerHTML = '密码错误'
          return false
        }
        error_ele.innerHTML = ''
        setCookie('password', { value: pass_value }, false, document.location.pathname)
        resolve()
        return true
      },
      callback_cancle: function() {
        history.back()
      }
    })
  })
}

export {
  setFancybox,
  setToggle,
  loadComments,
  delEmptyThtd,
  startProgress,
  doneProgress,
  setProgress,
  timeout,
  setHeaderHide,
  setLightDarkSwitch,
  setReadProgress,
  getReadProgress,
  set18Prompt,
  setPassword
}
