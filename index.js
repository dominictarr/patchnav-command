var h = require('hyperscript')
var HyperNav = require('hyper-nav')
var HyperScroll = require('hyperscroll')
var URL = require('url')
var fs = require('fs')
var path = require('path')
var SuggestBox = require('suggest-box')

function ObvMap (obv, map) {
  return function (fn) {
    if(fn) return obv(function (v) {
      fn(map(v))
    })
    else
      return map(obv())
  }
}

exports.gives = {
  nav: { screen: true, goto: true },
  suggest: { search: true }
}
exports.needs = {
  app: {
    view: 'first',
    menu: 'map'
  },
  suggest: {search: 'first'}
}

exports.create = function (api) {
  var nav

  return {
    nav: {
      screen: function () {
        var menu = api.app.menu().filter(Boolean)
        var input = h('input', {onchange: function (ev) {
          nav.push(input.value.trim())
        }})
        var header = h('div.command__header', input)
        SuggestBox(input, function (word, cb) {
          var fn = api.suggest.search(word)
          if(!fn) return cb()
          fn(word, cb)
        })

        nav = HyperNav(function (href) {
            //TODO, handle 404s
            var content = api.app.view(href)
            if(content) return HyperScroll(content)
          },
          function (nav) {
            return header
          },
          HyperScroll(api.app.view(menu[0])) //open the first view
        )

        window.onclick = function (ev) {
          var href, target = ev.target
          while (target && !(href = target.getAttribute('href')))
            target = target.parentNode

          ev.preventDefault()
          //TODO: make path more generic
          if(href) {
            nav.push(href)
          }
        }

      nav.className = 'patchnav'

        nav.appendChild(
          h('style', {innerText: fs.readFileSync(path.join(__dirname, 'style.css'))})
        )

        return nav
      },
      goto: function (link, opts) {
        nav.push(link)
      }
    },
    suggest: { search: function (word) {
      var menu = api.app.menu().filter(Boolean).filter(function (e) {
        return e.substring(0, word.length) == word
      })
      if(menu.length)
        return function (word, cb) {
          cb(null, menu.map(function (e) { return {title: e, value: e} }))
        }
    }}
  }
}

