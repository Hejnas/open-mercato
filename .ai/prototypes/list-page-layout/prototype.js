(function () {
  'use strict'

  var CONTENT_CAP = 1536
  var SIDEBAR = 240
  var TOTAL = 312
  var OPTIONS = ['opt-width', 'opt-pager', 'opt-shadows']

  var firstNames = ['Maja', 'Oskar', 'Lena', 'Tomas', 'Ines', 'Felix', 'Nora', 'Emil', 'Clara', 'Jonas', 'Alma', 'Viktor', 'Ida', 'Hugo', 'Elsa', 'Leon', 'Sofia', 'Anton', 'Mila', 'Karl']
  var lastNames = ['Lindqvist', 'Berg', 'Novak', 'Ferreira', 'Holm', 'Kowalczyk', 'Brandt', 'Moreau', 'Sato', 'Okafor', 'Varga', 'Nilsen', 'Duarte', 'Keller', 'Ricci', 'Larsen', 'Haas', 'Dumont', 'Ortega', 'Weiss']
  var statuses = [['Active', 'badge-success'], ['Inactive', 'badge-neutral'], ['Prospect', 'badge-info'], ['At risk', 'badge-warning']]
  var stages = ['Lead', 'Qualified', 'Customer', 'Champion', 'Churned']
  var sources = ['Website', 'Referral', 'Trade show', 'Outbound', 'Partner']
  var owners = ['Anna Kowal', 'Ben Ortiz', 'Chloe Martin', 'Dev Patel']
  var titles = ['Head of Procurement', 'Operations Manager', 'CFO', 'Buyer', 'IT Director', 'Office Manager']
  var departments = ['Procurement', 'Operations', 'Finance', 'IT', 'Administration']
  var seniorities = ['Junior', 'Mid', 'Senior', 'Lead', 'Executive']
  var zones = ['Europe/Warsaw', 'Europe/Berlin', 'Europe/Lisbon', 'America/New_York', 'Asia/Tokyo']

  function pick(list, index) { return list[index % list.length] }

  function formatDate(offsetDays) {
    var date = new Date(Date.UTC(2026, 10, 27 + offsetDays))
    return date.toISOString().slice(0, 10)
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]
    })
  }

  function buildRow(index) {
    var first = pick(firstNames, index * 7 + 3)
    var last = pick(lastNames, index * 3 + 1)
    var status = pick(statuses, index)
    var initials = first.charAt(0) + last.charAt(0)
    var cells = [
      '<td class="col-select pin-left"><button type="button" class="check" role="checkbox" aria-checked="false" aria-label="Select ' + escapeHtml(first + ' ' + last) + '"><svg><use href="#ic-check"/></svg></button></td>',
      '<td class="pin-left-2"><span class="cell-name"><span class="avatar avatar-sm">' + initials + '</span>' + escapeHtml(first + ' ' + last) + '</span></td>',
      '<td>' + escapeHtml((first + '.' + last).toLowerCase()) + '@example.com</td>',
      '<td><span class="badge ' + status[1] + '"><span class="dot"></span>' + status[0] + '</span></td>',
      '<td>' + pick(stages, index * 2) + '</td>',
      '<td class="num">' + formatDate((index % 9) + 1) + '</td>',
      '<td class="num">' + formatDate(-(index * 5 + 12)) + '</td>',
      '<td>' + pick(sources, index) + '</td>',
      '<td>' + pick(owners, index * 3) + '</td>',
      '<td>' + pick(titles, index) + '</td>',
      '<td>' + pick(departments, index * 2 + 1) + '</td>',
      '<td>' + pick(seniorities, index) + '</td>',
      '<td>' + pick(zones, index * 3) + '</td>',
      '<td class="col-actions pin-right"><button type="button" class="btn btn-ghost btn-icon btn-sm" aria-label="Row actions"><svg><use href="#ic-more"/></svg></button></td>',
    ]
    return '<tr>' + cells.join('') + '</tr>'
  }

  var rowsBody = document.getElementById('rows')
  var pageSize = document.getElementById('page-size')
  var resultCount = document.getElementById('result-count')
  var scroller = document.getElementById('dt-scroll')
  var widthStat = document.getElementById('width-stat')
  var app = document.getElementById('app')

  function renderRows() {
    var size = Number(pageSize.value)
    var total = size === 3 ? 3 : TOTAL
    var html = ''
    for (var index = 0; index < size; index += 1) html += buildRow(index)
    rowsBody.innerHTML = html
    resultCount.textContent = 'Showing 1 to ' + size + ' of ' + total + ' results'
    updateShadows()
  }

  function updateShadows() {
    var maxScroll = scroller.scrollWidth - scroller.clientWidth
    scroller.classList.toggle('is-scrolled', scroller.scrollLeft > 0)
    scroller.classList.toggle('has-more', maxScroll - scroller.scrollLeft > 1)
  }

  function updateWidthStat() {
    var viewport = window.innerWidth
    var available = Math.max(viewport - (viewport >= 1024 ? SIDEBAR : 0), 0)
    var isList = app.classList.contains('view-list')
    var capped = !(isList && document.body.classList.contains('opt-width'))
    var used = capped ? Math.min(available, CONTENT_CAP) : available
    var unused = available > 0 ? Math.round(((available - used) / available) * 100) : 0
    widthStat.innerHTML = 'Window <b>' + viewport + ' px</b> · content <b>' + used + ' px</b><br>Unused width: <b>' + unused + '%</b>' +
      (available <= CONTENT_CAP ? '<br>Below ~1780 px the cap is not visible.' : '')
  }

  function syncModeButtons() {
    var allOn = OPTIONS.every(function (name) { return document.body.classList.contains(name) })
    var allOff = OPTIONS.every(function (name) { return !document.body.classList.contains(name) })
    document.querySelectorAll('[data-mode]').forEach(function (button) {
      var selected = (button.getAttribute('data-mode') === 'after' && allOn) || (button.getAttribute('data-mode') === 'before' && allOff)
      button.setAttribute('aria-selected', selected ? 'true' : 'false')
    })
  }

  function setOption(name, enabled) {
    document.body.classList.toggle(name, enabled)
    var toggle = document.querySelector('[data-opt="' + name + '"]')
    if (toggle) toggle.setAttribute('aria-checked', enabled ? 'true' : 'false')
  }

  function refresh() {
    syncModeButtons()
    updateWidthStat()
    updateShadows()
    writeHash()
  }

  function writeHash() {
    var active = OPTIONS.filter(function (name) { return document.body.classList.contains(name) })
    var hash = active.length === OPTIONS.length ? 'after' : active.length === 0 ? 'before' : active.join(',')
    if (window.history && window.history.replaceState) window.history.replaceState(null, '', '#' + hash)
  }

  function readHash() {
    var hash = window.location.hash.replace('#', '')
    if (!hash) return
    var enabled = hash === 'after' ? OPTIONS : hash === 'before' ? [] : hash.split(',')
    OPTIONS.forEach(function (name) { setOption(name, enabled.indexOf(name) !== -1) })
  }

  function setScreen(view) {
    var isList = view === 'list'
    app.classList.toggle('view-list', isList)
    app.classList.toggle('view-form', !isList)
    document.getElementById('view-list').hidden = !isList
    document.getElementById('view-form').hidden = isList
    document.getElementById('crumb-here').textContent = isList ? 'People' : 'Maja Lindqvist'
    document.getElementById('screen').value = view
    window.scrollTo(0, 0)
    refresh()
  }

  document.querySelectorAll('[data-mode]').forEach(function (button) {
    button.addEventListener('click', function () {
      var enabled = button.getAttribute('data-mode') === 'after'
      OPTIONS.forEach(function (name) { setOption(name, enabled) })
      refresh()
    })
  })

  document.querySelectorAll('[data-opt]').forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var name = toggle.getAttribute('data-opt')
      setOption(name, !document.body.classList.contains(name))
      refresh()
    })
  })

  document.getElementById('t-banner').addEventListener('click', function (event) {
    var banner = document.getElementById('banner')
    banner.hidden = !banner.hidden
    event.currentTarget.setAttribute('aria-checked', banner.hidden ? 'false' : 'true')
  })

  document.getElementById('t-theme').addEventListener('click', function (event) {
    var dark = document.documentElement.classList.toggle('dark')
    event.currentTarget.setAttribute('aria-checked', dark ? 'true' : 'false')
  })

  document.getElementById('screen').addEventListener('change', function (event) { setScreen(event.target.value) })
  document.querySelectorAll('[data-view]').forEach(function (element) {
    element.addEventListener('click', function () { setScreen(element.getAttribute('data-view')) })
  })
  rowsBody.addEventListener('click', function (event) {
    var name = event.target.closest('.cell-name')
    if (name) setScreen('form')
  })

  var collapseButton = document.getElementById('proposal-collapse')
  function setCollapsed(collapsed) {
    document.getElementById('proposal').classList.toggle('is-collapsed', collapsed)
    collapseButton.textContent = collapsed ? 'Show' : 'Hide'
    collapseButton.setAttribute('aria-expanded', collapsed ? 'false' : 'true')
  }
  collapseButton.addEventListener('click', function () {
    setCollapsed(!document.getElementById('proposal').classList.contains('is-collapsed'))
  })
  if (window.innerWidth < 1024) setCollapsed(true)

  document.addEventListener('click', function (event) {
    var check = event.target.closest('.check')
    if (!check) return
    var checked = check.getAttribute('aria-checked') !== 'true'
    if (check.closest('thead')) {
      document.querySelectorAll('.dt-table .check').forEach(function (box) { box.setAttribute('aria-checked', checked ? 'true' : 'false') })
    } else {
      check.setAttribute('aria-checked', checked ? 'true' : 'false')
    }
  })

  pageSize.addEventListener('change', renderRows)
  scroller.addEventListener('scroll', updateShadows, { passive: true })
  window.addEventListener('resize', function () { updateWidthStat(); updateShadows() })

  readHash()
  renderRows()
  refresh()
})()
