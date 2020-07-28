let $userSiteList = $('.userSiteList .siteList')
let $repositorySiteList = $('.repository .siteList')
render()

function render() {
  window.userSiteList = localStorage.getItem('userSiteList')
  let defaultSiteList = [
    { name: 'github', link: 'github.com' },
    { name: '掘金', link: 'juejin.im' },
    { name: 'learnku', link: 'learnku.com' },
    { name: '开源中国', link: 'oschina.net' },
    { name: 'IBM', link: 'developer.ibm.com' },
    { name: 'w3c', link: 'w3.org' },
    { name: 'iconfont', link: 'iconfont.cn' },
    { name: 'JSBIN', link: 'jsbin.com' },
  ]
  if (window.userSiteList === null) {
    userSiteList = defaultSiteList
    save()
  } else {
    userSiteList = JSON.parse(userSiteList)
  }
  $userSiteList.find('.site').remove()
  $repositorySiteList.find('.site').remove()
  userSiteList.forEach((site, index) => {
    addToUserList(site, index)
  })
}

$('#repositoryBtn').on('click', () => {
  let $repository = $('#repository')
  if ($repository.hasClass('hide')) {
    $repository.removeClass('hide')
  } else {
    $repository.addClass('hide')
  }
})
$('.repository')
  .find('#cencelBtn')
  .on('click', () => {
    $('#repositoryBtn').click()
  })
$('#addSite').on('click', () => {
  let $dialog = $('#dialogAdd')
  $dialog.removeClass('hide')
})
console.log($('#addSiteBtn'))
$('#addSiteBtn').on('click', () => {
  let site = {
    name: $('#siteNameInput').val(),
    link: simplifyUrl($('#siteLinkInput').val()),
  }
  userSiteList.push(site)
  save()
  render()
  $('#repositoryBtn').click()
})
$('#cancelBtn').on('click', () => {
  let $dialog = $('.dialog')
  $dialog.addClass('hide')
})
$('.saveBtn').on('click', () => {
  let names = Array.from($(`.repository .siteList input[name='name']`)).map(
    (name) => {
      return name.value
    }
  )
  let links = Array.from($(`.repository .siteList input[name='link']`)).map(
    (link) => {
      return simplifyUrl(link.value)
    }
  )
  userSiteList = []
  names.forEach((name, index) => {
    userSiteList.push({
      name,
      link: links[index],
    })
  })
  save()
  render()
  $('#repositoryBtn').click()
})
$('.siteList').on('click', (e) => {
  let x = e.target
  while (x.matches('.icon') === false) {
    if (x.matches('.siteList')) {
      x = null
      break
    }
    x = x.parentNode
  }
  x && deleteSite(x)
})

function deleteSite(e) {
  userSiteList.splice(e.dataset.index, 1)
  save()
  render()
  $('#repositoryBtn').click()
}
function simplifyUrl(url) {
  return url.replace('https://', '').replace('http://', '').replace(/\/.*/, '')
}
function addToUserList(site, index) {
  let $lastLi = $userSiteList.find('li.last')
  let $site = $(`<li class="site">
          <a href="//${site.link}">
            <img class="logo" src="//${site.link}/favicon.ico" alt="${site.name[0]}"></img>
            <div class="name">${site.name}</div>
          </a>
        </li>`)
  $site.insertBefore($lastLi)
  site = $(`
            <div class="site" >
              <img class="logo" src="//${site.link}/favicon.ico" alt="${site.name[0]}"></img>
              <input type="text" value="${site.name}" name="name">
              <input type="text" value="${site.link}" name="link">
              
              <svg class="icon icon-delete" aria-hidden="true" data-index="${index}">
                  <use xlink:href="#icon-delete"></use>
              </svg>
            </div>`)
  $repositorySiteList.append(site)
}
function save() {
  localStorage.setItem('userSiteList', JSON.stringify(userSiteList))
}
