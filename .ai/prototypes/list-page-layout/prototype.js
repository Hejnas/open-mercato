(function () {
  'use strict'

  var CONTENT_CAP = 1536
  var TOTAL = 312
  var OPTIONS = ['opt-width', 'opt-pager', 'opt-shadows', 'opt-footer', 'opt-select', 'opt-frameless']
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
    html += '<th class="col-filler" aria-hidden="true"></th><th class="col-actions pin-right">Actions</th>'
    document.getElementById('head-row').innerHTML = html
  }

  function person(index) {
    var first = pick(firstNames, index)
    var last = pick(lastNames, index + Math.floor(index / 20) * 7)
    return { first: first, last: last, email: (first + '.' + last).toLowerCase() + '@' + pick(domains, index), title: pick(titles, index) }
  }

  function fillForm(index) {
    var data = person(index)
    document.getElementById('f-first').value = data.first
    document.getElementById('f-last').value = data.last
    document.getElementById('f-email').value = data.email
    document.getElementById('f-job').value = data.title
    VIEWS.form.crumb = data.first + ' ' + data.last
  }

  function buildRow(index) {
    var first = pick(firstNames, index)
    var last = pick(lastNames, index + Math.floor(index / 20) * 7)
    var status = pick(statuses, index)
    var full = first + ' ' + last
    return '<tr>' +
      '<td class="col-select"><button type="button" class="check" role="checkbox" aria-checked="false" aria-label="Select ' + full + '"><svg><use href="#ic-check"/></svg></button></td>' +
      '<td class="pin-left"><div class="cell"><a class="cell-name" href="#" data-open-form="' + index + '">' + full + '</a></div></td>' +
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
      '<td class="col-filler" aria-hidden="true"></td><td class="col-actions pin-right"><button type="button" class="btn btn-ghost btn-icon btn-sm" aria-label="Row actions"><svg><use href="#ic-more"/></svg></button></td>' +
      '</tr>'
  }

  var rowsBody = document.getElementById('rows')
  var pageSize = document.getElementById('page-size')
  var resultCount = document.getElementById('result-count')
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

  function updateScrollerShadows(element) {
    var maxScroll = element.scrollWidth - element.clientWidth
    element.classList.toggle('is-scrolled', element.scrollLeft > 0)
    element.classList.toggle('has-more', maxScroll - element.scrollLeft > 1)
  }

  function updateShadows() {
    document.querySelectorAll('.dt-scroll').forEach(updateScrollerShadows)
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

  var DEFAULT_SIM_WIDTH = 2560
  var showBanner = false
  var currentView = 'list'
  var initialView = 'list'

  function setSwitch(id, on) {
    document.getElementById(id).setAttribute('aria-checked', on ? 'true' : 'false')
  }

  function setTheme(dark) {
    document.documentElement.classList.toggle('dark', dark)
    setSwitch('t-theme', dark)
  }

  function setDemo(demo) {
    document.body.classList.toggle('demo-mode', demo)
    setSwitch('t-demo', demo)
  }

  function setBanner(show) {
    showBanner = show
    setSwitch('t-banner', show)
    placeBanner()
  }

  function writeHash() {
    var active = OPTIONS.filter(function (name) { return document.body.classList.contains(name) })
    var parts = [active.length === OPTIONS.length ? 'after' : active.length === 0 ? 'before' : active.join(',')]
    if (currentView !== 'list') parts.push('view=' + currentView)
    if (document.documentElement.classList.contains('dark')) parts.push('theme=dark')
    if (document.body.classList.contains('demo-mode')) parts.push('demo=1')
    if (showBanner) parts.push('alert=1')
    if (simWidth !== DEFAULT_SIM_WIDTH) parts.push('screen=' + simWidth)
    if (app.classList.contains('sidebar-collapsed')) parts.push('sidebar=collapsed')
    if (window.history && window.history.replaceState) window.history.replaceState(null, '', '#' + parts.join('&'))
  }

  function readHash() {
    var raw = window.location.hash.replace('#', '')
    if (!raw) return
    var parts = raw.split('&')
    var params = {}
    parts.forEach(function (part) {
      var separator = part.indexOf('=')
      if (separator > 0) params[part.slice(0, separator)] = decodeURIComponent(part.slice(separator + 1))
    })
    if (parts[0].indexOf('=') === -1) {
      var enabled = parts[0] === 'after' ? OPTIONS : parts[0] === 'before' ? [] : parts[0].split(',')
      OPTIONS.forEach(function (name) { setOption(name, enabled.indexOf(name) !== -1) })
    }
    if (params.theme === 'dark') setTheme(true)
    if (params.demo === '1') setDemo(true)
    if (params.alert === '1') { showBanner = true; setSwitch('t-banner', true) }
    if (params.screen !== undefined) {
      simWidth = Number(params.screen) || 0
      document.getElementById('sim-width').value = String(simWidth)
    }
    if (params.sidebar === 'collapsed') app.classList.add('sidebar-collapsed')
    if (params.view && VIEWS[params.view]) initialView = params.view
  }

  function refresh() {
    syncModeButtons()
    updateWidthStat()
    updateShadows()
    writeHash()
  }

  function placeBanner() {
    var config = VIEWS[currentView] || VIEWS.list
    var banner = document.getElementById('banner')
    var main = document.getElementById(config.main)
    if (banner.parentNode !== main) main.insertBefore(banner, main.firstChild)
    banner.hidden = !showBanner
  }

  var VIEWS = {
    list: { main: 'view-list', crumb: 'People', tableOnly: true, nav: 'list' },
    deals: { main: 'view-deals', crumb: 'Deals', tableOnly: true, nav: 'deals' },
    roles: { main: 'view-roles', crumb: 'Team roles', tableOnly: true, nav: 'roles' },
    form: { main: 'view-form', crumb: 'Mia Johnson', tableOnly: false, nav: 'list' },
    overview: { main: 'view-overview', crumb: 'Sales overview', tableOnly: false, nav: 'overview' },
  }

  function setScreen(view) {
    var config = VIEWS[view] || VIEWS.list
    app.classList.toggle('view-list', config.tableOnly)
    Object.keys(VIEWS).forEach(function (key) {
      document.getElementById(VIEWS[key].main).hidden = VIEWS[key].main !== config.main
    })
    document.querySelectorAll('.nav-item[data-view]').forEach(function (item) {
      var active = item.getAttribute('data-view') === config.nav
      item.classList.toggle('active', active)
      if (active) item.setAttribute('aria-current', 'page')
      else item.removeAttribute('aria-current')
    })
    document.querySelectorAll('.view-nav [data-view]').forEach(function (item) {
      if (item.getAttribute('data-view') === view) item.setAttribute('aria-current', 'page')
      else item.removeAttribute('aria-current')
    })
    currentView = view
    placeBanner()
    document.getElementById('crumb-here').textContent = config.crumb
    window.scrollTo(0, 0)
    refresh()
  }

  function buildDeals() {
    var columns = ['Title', 'Status', 'Pipeline stage', 'Pipeline', 'Value', 'Probability', 'Expected close', 'Owner', 'Companies', 'People', 'Updated', 'Competitive risk', 'Seats']
    var head = '<th class="col-select"><button type="button" class="check" role="checkbox" aria-checked="false" aria-label="Select all"><svg><use href="#ic-check"/></svg></button></th>'
    columns.forEach(function (label, index) {
      head += '<th' + (index === 0 ? ' class="pin-left"' : '') + '><span class="th-sort">' + label +
        '<svg aria-hidden="true"><use href="#ic-chevrons-up-down"/></svg></span><span class="th-resize" aria-hidden="true"></span></th>'
    })
    head += '<th class="col-filler" aria-hidden="true"></th><th class="col-actions pin-right">Actions</th>'
    document.getElementById('deals-head').innerHTML = head
    var titles = ['Cedar Creek Retreat Expansion', 'Sunset Lofts Battery Upgrade', 'Wanderstay Boutique Renovation', 'Blue Harbor Grocers Pilot Program', 'Redwood Residences Solar Rollout', 'Midwest Outfitters Expansion', 'Northwind Fleet Charging', 'Harborview Analytics Renewal', 'Copperleaf Studio Fit-out', 'Brightside Warehouse Retrofit']
    var statuses = [['Lost', 'badge-error'], ['Open', 'badge-info'], ['In progress', 'badge-warning'], ['Won', 'badge-success'], ['In progress', 'badge-warning'], ['Open', 'badge-info']]
    var stages = ['Lost', 'Offering', 'Sales qualified lead', 'Won', 'Negotiations', 'Opportunity']
    var probabilities = ['0%', '40%', '65%', '100%', '55%', '35%']
    var closes = [['8/27/2026', 'Lost'], ['1/9/2027', 'next month'], ['12/10/2026', 'in 2 weeks'], ['10/11/2026', 'Won'], ['12/20/2026', 'in 3 weeks'], ['3/5/2027', 'in 3 months']]
    var companies = ['Copperleaf Design Co.', 'Brightside Solar', 'Harborview Analytics', 'Northwind Traders']
    var people = ['TB', 'MJ DC', 'AP', 'LO NH', 'TB MJ']
    var risks = ['high', 'medium', 'low']
    var html = ''
    for (var index = 0; index < 100; index += 1) {
      var status = pick(statuses, index)
      var close = pick(closes, index)
      html += '<tr>' +
        '<td class="col-select"><button type="button" class="check" role="checkbox" aria-checked="false" aria-label="Select deal"><svg><use href="#ic-check"/></svg></button></td>' +
        '<td class="pin-left"><div class="cell cell-title"><span class="title-icon"><svg><use href="#ic-briefcase"/></svg></span><a class="cell-name" href="#">' + pick(titles, index) + (index >= titles.length ? ' ' + (Math.floor(index / titles.length) + 1) : '') + '</a></div></td>' +
        cell('<span class="badge ' + status[1] + '"><span class="dot"></span>' + status[0] + '</span>') +
        cell(pick(stages, index)) +
        cell('Default Pipeline') +
        cell('<span class="cell-two"><span>' + (80 + (index * 37) % 140) + ',000</span><small>USD</small></span>') +
        cell(pick(probabilities, index)) +
        cell('<span class="cell-two"><span>' + close[0] + '</span><small>' + close[1] + '</small></span>') +
        cell(none()) +
        cell('<span class="pill">' + pick(companies, index) + '</span>') +
        cell('<span class="initials">' + pick(people, index).split(' ').map(function (name) { return '<span>' + name + '</span>' }).join('') + '</span>') +
        cell(formatDate(-(index % 5))) +
        cell(pick(risks, index)) +
        cell(String(4 + (index * 3) % 20)) +
        '<td class="col-filler" aria-hidden="true"></td><td class="col-actions pin-right"><button type="button" class="btn btn-ghost btn-icon btn-sm" aria-label="Row actions"><svg><use href="#ic-more"/></svg></button></td>' +
        '</tr>'
    }
    document.getElementById('deals-rows').innerHTML = html
  }

  function buildStaticTables() {
    var roles = [
      ['Account executive', 'Owns new business deals from first call to signature', 6],
      ['Sales manager', 'Reviews pipeline and approves discounts', 2],
      ['Customer success', 'Onboards new customers and runs quarterly reviews', 4],
      ['Support agent', 'Handles tickets and warranty claims', 5],
      ['Field technician', 'Installs and services equipment on site', 8],
      ['Warehouse lead', 'Plans picking and outbound shipments', 2],
      ['Finance', 'Invoices, payments and credit limits', 3],
      ['Marketing', 'Campaigns, events and lead sources', 3],
      ['Procurement', 'Supplier orders and price lists', 2],
      ['Administrator', 'Users, roles and system settings', 1],
      ['Partner manager', 'Reseller onboarding and referrals', 2],
      ['Intern', 'Read-only access to customers and deals', 4],
    ]
    document.getElementById('roles-rows').innerHTML = roles.map(function (role) {
      return '<tr><td><div class="cell"><a class="cell-name" href="#">' + role[0] + '</a></div></td><td><div class="cell">' + role[1] +
        '</div></td><td class="num">' + role[2] + '</td><td class="col-filler" aria-hidden="true"></td><td class="col-actions"><button type="button" class="btn btn-ghost btn-icon btn-sm" aria-label="Row actions"><svg><use href="#ic-more"/></svg></button></td></tr>'
    }).join('')
    var accounts = [['Brightside Solar', 'Anna Kowal', '10/12/2026'], ['Copperleaf Design', 'Dev Patel', '10/30/2026'], ['Harborview Analytics', 'Ben Ortiz', '11/2/2026'], ['Northwind Traders', 'Chloe Martin', '11/9/2026']]
    document.getElementById('overview-accounts').innerHTML = accounts.map(function (row) {
      return '<tr><td>' + row[0] + '</td><td>' + row[1] + '</td><td class="num">' + row[2] + '</td></tr>'
    }).join('')
    var deals = [['Sunset Lofts Battery Upgrade', 'Offering', '82,000 USD', '12/24/2026'], ['Redwood Solar Rollout', 'Negotiations', '185,000 USD', '12/4/2026'], ['Wanderstay Renovation', 'Qualified', '145,000 USD', '11/24/2026'], ['Midwest Outfitters Expansion', 'Opportunity', '210,000 USD', '12/17/2026']]
    document.getElementById('overview-deals').innerHTML = deals.map(function (row) {
      return '<tr><td>' + row[0] + '</td><td><span class="pill pill-secondary">' + row[1] + '</span></td><td class="num">' + row[2] + '</td><td class="num">' + row[3] + '</td></tr>'
    }).join('')
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

  document.getElementById('t-banner').addEventListener('click', function () {
    setBanner(!showBanner)
    refresh()
  })

  document.getElementById('t-demo').addEventListener('click', function () {
    setDemo(!document.body.classList.contains('demo-mode'))
    refresh()
  })

  document.getElementById('t-theme').addEventListener('click', function () {
    setTheme(!document.documentElement.classList.contains('dark'))
    refresh()
  })

  document.addEventListener('click', function (event) {
    var range = event.target.closest('.kpi-range button')
    if (range) {
      range.parentNode.querySelectorAll('button').forEach(function (button) {
        button.setAttribute('aria-selected', button === range ? 'true' : 'false')
      })
    }
    var link = event.target.closest('a[href="#"]')
    if (link) event.preventDefault()
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

  document.querySelectorAll('[data-view]').forEach(function (element) {
    element.addEventListener('click', function () { setScreen(element.getAttribute('data-view')) })
  })
  rowsBody.addEventListener('click', function (event) {
    var link = event.target.closest('[data-open-form]')
    if (link) {
      event.preventDefault()
      fillForm(Number(link.getAttribute('data-open-form')))
      setScreen('form')
    }
  })

  var panelBody = document.querySelector('.proposal-body')
  var panelFade = document.getElementById('proposal-fade')
  function updatePanelFade() {
    panelFade.hidden = panelBody.scrollHeight - panelBody.clientHeight - panelBody.scrollTop <= 1
  }
  panelBody.addEventListener('scroll', updatePanelFade, { passive: true })
  window.addEventListener('resize', updatePanelFade)

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
      check.closest('table').querySelectorAll('.check').forEach(function (box) { box.setAttribute('aria-checked', checked ? 'true' : 'false') })
    } else {
      check.setAttribute('aria-checked', checked ? 'true' : 'false')
    }
  })

  var MIN_COLUMN_WIDTH = 60
  var columnWidths = new WeakMap()

  function styleColumn(table, index, width) {
    var value = width ? width + 'px' : ''
    var inner = width ? Math.max(width - 32, 0) + 'px' : ''
    Array.prototype.forEach.call(table.rows, function (row) {
      var cell = row.cells[index]
      if (!cell) return
      cell.style.width = value
      cell.style.minWidth = value
      cell.style.maxWidth = value
      var content = cell.querySelector('.cell, .th-sort')
      if (content) {
        content.style.maxWidth = inner
        content.style.overflow = width ? 'hidden' : ''
      }
    })
  }

  function applyColumnWidths(table) {
    var widths = columnWidths.get(table)
    if (!widths) return
    Object.keys(widths).forEach(function (index) { styleColumn(table, Number(index), widths[index]) })
  }

  document.addEventListener('pointerdown', function (event) {
    var handle = event.target.closest('.th-resize')
    if (!handle) return
    event.preventDefault()
    var headerCell = handle.closest('th')
    var table = headerCell.closest('table')
    var index = headerCell.cellIndex
    var startX = event.clientX
    var startWidth = headerCell.offsetWidth
    var zoom = parseFloat(getComputedStyle(app).zoom) || 1
    var widths = columnWidths.get(table) || {}
    columnWidths.set(table, widths)
    handle.setPointerCapture(event.pointerId)
    document.body.classList.add('is-resizing')
    function onMove(moveEvent) {
      var width = Math.max(MIN_COLUMN_WIDTH, Math.round(startWidth + (moveEvent.clientX - startX) / zoom))
      widths[index] = width
      styleColumn(table, index, width)
      updateShadows()
    }
    function onUp() {
      handle.removeEventListener('pointermove', onMove)
      handle.removeEventListener('pointerup', onUp)
      handle.removeEventListener('pointercancel', onUp)
      document.body.classList.remove('is-resizing')
    }
    handle.addEventListener('pointermove', onMove)
    handle.addEventListener('pointerup', onUp)
    handle.addEventListener('pointercancel', onUp)
  })

  document.addEventListener('dblclick', function (event) {
    var handle = event.target.closest('.th-resize')
    if (!handle) return
    var headerCell = handle.closest('th')
    var table = headerCell.closest('table')
    var widths = columnWidths.get(table)
    if (widths) delete widths[headerCell.cellIndex]
    styleColumn(table, headerCell.cellIndex, 0)
    updateShadows()
  })

  pageSize.addEventListener('change', function () {
    renderRows()
    applyColumnWidths(document.querySelector('#view-list .dt-table'))
  })
  document.addEventListener('scroll', function (event) {
    if (event.target.classList && event.target.classList.contains('dt-scroll')) updateScrollerShadows(event.target)
  }, { capture: true, passive: true })
  window.addEventListener('resize', function () { applySimulation(); updateWidthStat(); updateShadows() })

  buildHead()
  buildStaticTables()
  buildDeals()
  readHash()
  applySimulation()
  renderRows()
  setScreen(initialView)
  updatePanelFade()
})()
