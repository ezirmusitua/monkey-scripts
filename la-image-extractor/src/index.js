(function () {
  const href = window.location.href
  const isHitomi = /hitomi/gi.test(href)
  // prepare str2Paste
  let [imgSrcSelector, titleSelector] = ['.tag-list-img', 'h1']
  if (isHitomi) {
    imgSrcSelector = '.img-url'
    titleSelector = 'title'
  }
  let srcs = Array.from(document.querySelectorAll(imgSrcSelector))
  let title = document.querySelector(titleSelector).innerText
  if (isHitomi) {
    title = title.split(' | ')[0]
    const magic = parseInt(window.location.href.split('/').slice(-1)[0][1]) % 2
    if (Number.isNaN(magic)) {
      srcs = []
    } else {
      srcs = srcs.map(s => s.innerText.replace('//g.hitomi.la', `https://${String.fromCharCode(magic + 97)}a.hitomi.la`))
    }
  } else {
    srcs = srcs.map(s => s.src.replace('//tn', '//i').split('.').slice(0, 4).join('.'))
  }
  const str2paste = `${title}\n${srcs.join('\n')}${'\n = ='.repeat(20)}`
  // create button to click
  const btn = document.createElement('div')
  btn.innerText = 'Copy Sources'
  btn.style.textAlign = 'center'
  btn.style.width = '120px'
  btn.style.lineHeight = '40px'
  btn.style.backgroundColor = 'skyblue'
  btn.style.color = 'white'
  btn.style.cursor = 'pointer'
  btn.style.borderRadius = '8px'
  btn.style.boxShadow = '0px 0px 8px 4px rgba(0, 0, 0, .2)'
  btn.style.position = 'fixed'
  btn.style.right = '80px'
  btn.style.bottom = '80px'
  document.body.appendChild(btn)
  // bind copy event
  btn.addEventListener('click', () => {
    const el = document.createElement('textarea')
    el.value = str2paste
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  })
})()
