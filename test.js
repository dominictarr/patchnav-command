

var h = require('hyperscript')

document.body.appendChild(h('div',
  h('input'),
  h('textarea'),
  h('ol',
    h('li', {attrs: {tabindex: "0"}}, 'one'),
    h('li', {attrs: {tabindex: "0"}}, 'two'),
    h('li', {attrs: {tabindex: "0"}}, 'three'),
    h('li', {attrs: {tabindex: "0"}}, 'four')
  )
))

window.onkeydown = function (ev) {
  console.log(ev.target, ev.keyCode)
}
window.onclick = function (ev) {
  ev.target.focus()
//  console.log(ev.target, ev.keyCode)
}


