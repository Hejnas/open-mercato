(function () {
  'use strict'

  var CONTENT_CAP = 1536
  var TOTAL = 312
  var OPTIONS = ['opt-width', 'opt-pager', 'opt-shadows', 'opt-footer', 'opt-select']
  var simWidth = 2560

  var COLUMNS = ['Name', 'Email', 'Status', 'Lifecycle stage', 'Next interaction', 'Created', 'Source', 'Owner', 'Job title', 'Department', 'Seniority', 'Timezone']
  var firstNames = ['Mia', 'Taylor', 'Daniel', 'Lena', 'Arjun', 'Naomi', 'Oskar', 'Ines', 'Felix', 'Nora', 'Emil', 'Clara', 'Jonas', 'Alma', 'Viktor', 'Ida', 'Hugo', 'Elsa', 'Leon', 'Sofia']
  var lastNames = ['Johnson', 'Brooks', 'Cho', 'Ortiz', 'Patel', 'Harris', 'Lindqvist', 'Berg', 'Novak', 'Ferreira', 'Holm', 'Brandt', 'Moreau', 'Sato', 'Okafor', 'Varga', 'Nilsen', 'Duarte', 'Keller', 'Ricci']
  var domains = ['brightsidesolar.com', 'copperleaf.design', 'harborviewanalytics.com', 'northwindtraders.example']
  var statuses = [['Active', 'dot-success'], ['Active', 'dot-success'], ['Inactive', 'dot-neutral'], ['Prospect', 'dot-info'], ['At risk', 'dot-warning']]
  var stages = ['Customer', 'Interested customer', 'Lead', 'Qualified', 'Champion']
  var sources = ['Partner referral', 'Customer referral', 'Cold outreach', 'Conference / Event', 'Website']
  var owners = ['Anna Kowal', 'Ben Ortiz', 'Chloe Martin', 'Dev Patel']
  var titles = ['Head of Procurement', 'Operations Manager', 'CFO', 'Buyer', 'IT Director', 'Office Manager']
  var departments = ['Procurement', 'Operations', 'Finance', 'IT', 'Administration']
  var seniorities = ['Junior', 'Mid', 'Senior', 'Lead', 'Executive']
  var zones = ['Europe/Warsaw', 'Europe/Berlin', 'Europe/Lisbon', 'America/New_York', 'Asia/Tokyo']

  function pick(list, index) { return list[index % list.length] }

  function formatDate(offsetDays) {
    var date = new Date(Date.UTC(2026, 10, 5 + offsetDays))
    return (date.getUTCMonth() + 1) + '/' + date.getUTCDate() + '/' + date.getUTCFullYear()
  }

  function cell(html) { return '<td><div class="cell">' + html + '</div></td>' }
  function pill(text) { return '<span class="pill pill-secondary">' + text + '</span>' }
  function none() { return '<span class="empty-value">None</span>' }

  function buildHead() {
    var html = '<th class="col-select"><button type="button" class="check" role="checkbox" aria-checked="false" aria-label="Select all"><svg><use href="#ic-check"/></svg></button></th>'
    COLUMNS.forEach(function (label, index) {
      html += '<th' + (index === 0 ? ' class="pin-left"' : '') + '><span class="th-sort">' + label +
        '<svg aria-hidden="true"><use href="#ic-chevrons-up-down"/></svg></span><span class="th-resize" aria-hidden="true"></span></th>'
    })
    html += '<th class="col-actions pin-right">Actions</th>'
    document.getElementById('head-row').innerHTML = html
  }

  function buildRow(index) {
    var first = pick(firstNames, index)
    var last = pick(lastNames, index + Math.floor(index / 20) * 7)
    var status = pick(statuses, index)
    var full = first + ' ' + last
    return '<tr>' +
      '<td class="col-select"><button type="button" class="check" role="checkbox" aria-checked="false" aria-label="Select ' + full + '"><svg><use href="#ic-check"/></svg></button></td>' +
      '<td class="pin-left"><div class="cell"><a class="cell-name" href="#" data-open-form>' + full + '</a></div></td>' +
      cell((first + '.' + last).toLowerCase() + '@' + pick(domains, index)) +
      cell('<span class="pill"><span class="dot ' + status[1] + '"></span>' + status[0] + '</span>') +
      cell(pill(pick(stages, index))) +
      cell(index % 3 === 0 ? formatDate((index % 9) + 20) : none()) +
      cell(formatDate(-(index % 7))) +
      cell(pill(pick(sources, index))) +
      cell(pick(owners, index * 3)) +
      cell(pick(titles, index)) +
      cell(pick(departments, index * 2 + 1)) +
      cell(pick(seniorities, index)) +
      cell(pick(zones, index * 3)) +
      '<td class="col-actions pin-right"><button type="button" class="btn btn-ghost btn-icon btn-sm" aria-label="Row actions"><svg><use href="#ic-more"/></svg></button></td>' +
      '</tr>'
  }

  var rowsBody = document.getElementById('rows')
  var pageSize = document.getElementById('page-size')
  var resultCount = document.getElementById('result-count')
  var scroller = document.getElementById('dt-scroll')
  var widthStat = document.getElementById('width-stat')
  var app = document.getElementById('app')

  function renderRows() {
    var size = Number(pageSize.value)
    var total = size === 6 ? 6 : TOTAL
    var html = ''
    for (var index = 0; index < size; index += 1) html += buildRow(index)
    rowsBody.innerHTML = html
    resultCount.textContent = 'Showing 1 to ' + size + ' of ' + total + ' results in 0.4s'
    document.querySelectorAll('.page-more').forEach(function (button) { button.hidden = total <= size })
    updateShadows()
  }

  function updateShadows() {
    var maxScroll = scroller.scrollWidth - scroller.clientWidth
    scroller.classList.toggle('is-scrolled', scroller.scrollLeft > 0)
    scroller.classList.toggle('has-more', maxScroll - scroller.scrollLeft > 1)
  }

  function availableWidth() {
    var panel = window.innerWidth >= 1024 ? document.getElementById('proposal').offsetWidth : 0
    return window.innerWidth - panel
  }

  function applySimulation() {
    var available = availableWidth()
    var simulated = simWidth > available && window.innerWidth >= 1024
    var zoom = simulated ? available / simWidth : 1
    document.body.classList.toggle('is-simulated', simulated)
    document.documentElement.style.setProperty('--sim-width', String(simWidth))
    document.documentElement.style.setProperty('--sim-zoom', String(zoom))
    document.documentElement.style.setProperty('--app-height', simulated ? (window.innerHeight / zoom) + 'px' : '100svh')
  }

  function effectiveWidth() {
    return document.body.classList.contains('is-simulated') ? simWidth : availableWidth()
  }

  function updateWidthStat() {
    var viewport = effectiveWidth()
    var sidebar = viewport >= 1024 ? document.querySelector('.sidebar').offsetWidth : 0
    var available = Math.max(Math.round(viewport - sidebar), 0)
    var isList = app.classList.contains('view-list')
    var capped = !(isList && document.body.classList.contains('opt-width'))
    var used = capped ? Math.min(available, CONTENT_CAP) : available
    var unused = available > 0 ? Math.round(((available - used) / available) * 100) : 0
    var label = document.body.classList.contains('is-simulated') ? 'Simulated screen' : 'Mockup area'
    widthStat.innerHTML = label + ' <b>' + viewport + ' px</b> · content <b>' + used + ' px</b><br>Unused width: <b>' + unused + '%</b>' +
      (available <= CONTENT_CAP ? '<br>The cap shows on windows wider than ~' + Math.round(CONTENT_CAP + sidebar) + ' px.' : '')
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

  function refresh() {
    syncModeButtons()
    updateWidthStat()
    updateShadows()
    writeHash()
  }

  function setScreen(view) {
    var isList = view === 'list'
    app.classList.toggle('view-list', isList)
    app.classList.toggle('view-form', !isList)
    document.getElementById('view-list').hidden = !isList
    document.getElementById('view-form').hidden = isList
    document.getElementById('crumb-here').textContent = isList ? 'People' : 'Mia Johnson'
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

  document.getElementById('sidebar-toggle').addEventListener('click', function () {
    app.classList.toggle('sidebar-collapsed')
    refresh()
  })

  document.getElementById('sim-width').addEventListener('change', function (event) {
    simWidth = Number(event.target.value) || 0
    applySimulation()
    refresh()
  })

  document.getElementById('screen').addEventListener('change', function (event) { setScreen(event.target.value) })
  document.querySelectorAll('[data-view]').forEach(function (element) {
    element.addEventListener('click', function () { setScreen(element.getAttribute('data-view')) })
  })
  rowsBody.addEventListener('click', function (event) {
    if (event.target.closest('[data-open-form]')) {
      event.preventDefault()
      setScreen('form')
    }
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
  window.addEventListener('resize', function () { applySimulation(); updateWidthStat(); updateShadows() })

  buildHead()
  applySimulation()
  readHash()
  renderRows()
  refresh()
})()
