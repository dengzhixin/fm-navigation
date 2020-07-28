// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"d6sW":[function(require,module,exports) {
var $userSiteList = $('.userSiteList .siteList');
var $repositorySiteList = $('.repository .siteList');
render();

function render() {
  window.userSiteList = localStorage.getItem('userSiteList');
  var defaultSiteList = [{
    name: 'github',
    link: 'github.com'
  }, {
    name: '掘金',
    link: 'juejin.im'
  }, {
    name: 'learnku',
    link: 'learnku.com'
  }, {
    name: '开源中国',
    link: 'oschina.net'
  }, {
    name: 'IBM',
    link: 'developer.ibm.com'
  }, {
    name: 'w3c',
    link: 'w3.org'
  }, {
    name: 'JSBIN',
    link: 'jsbin.com'
  }];

  if (window.userSiteList === null) {
    userSiteList = defaultSiteList;
    save();
  } else {
    userSiteList = JSON.parse(userSiteList);
  }

  $userSiteList.find('.site').remove();
  $repositorySiteList.find('.site').remove();
  userSiteList.forEach(function (site, index) {
    addToUserList(site, index);
  });
}

$('#repositoryBtn').on('click', function () {
  var $repository = $('#repository');

  if ($repository.hasClass('hide')) {
    $repository.removeClass('hide');
  } else {
    $repository.addClass('hide');
  }
});
$('.repository').find('#cencelBtn').on('click', function () {
  $('#repositoryBtn').click();
});
$('#addSite').on('click', function () {
  var $dialog = $('#dialogAdd');
  $dialog.removeClass('hide');
});
console.log($('#addSiteBtn'));
$('#addSiteBtn').on('click', function () {
  var site = {
    name: $('#siteNameInput').val(),
    link: simplifyUrl($('#siteLinkInput').val())
  };
  userSiteList.push(site);
  save();
  render();
  $('#repositoryBtn').click();
});
$('#cancelBtn').on('click', function () {
  var $dialog = $('.dialog');
  $dialog.addClass('hide');
});
$('.saveBtn').on('click', function () {
  var names = Array.from($(".repository .siteList input[name='name']")).map(function (name) {
    return name.value;
  });
  var links = Array.from($(".repository .siteList input[name='link']")).map(function (link) {
    return simplifyUrl(link.value);
  });
  userSiteList = [];
  names.forEach(function (name, index) {
    userSiteList.push({
      name: name,
      link: links[index]
    });
  });
  save();
  render();
  $('#repositoryBtn').click();
});
$('.siteList').on('click', function (e) {
  var x = e.target;

  while (x.matches('.icon') === false) {
    if (x.matches('.siteList')) {
      x = null;
      break;
    }

    x = x.parentNode;
  }

  x && deleteSite(x);
});

function deleteSite(e) {
  userSiteList.splice(e.dataset.index, 1);
  save();
  render();
  $('#repositoryBtn').click();
}

function simplifyUrl(url) {
  return url.replace('https://', '').replace('http://', '').replace(/\/.*/, '');
}

function addToUserList(site, index) {
  var $lastLi = $userSiteList.find('li.last');
  var $site = $("<li class=\"site\">\n          <a href=\"//".concat(site.link, "\">\n            <img class=\"logo\" src=\"//").concat(site.link, "/favicon.ico\" alt=\"").concat(site.name[0], "\"></img>\n            <div class=\"name\">").concat(site.name, "</div>\n          </a>\n        </li>"));
  $site.insertBefore($lastLi);
  site = $("\n            <div class=\"site\" >\n              <img class=\"logo\" src=\"//".concat(site.link, "/favicon.ico\" alt=\"").concat(site.name[0], "\"></img>\n              <input type=\"text\" value=\"").concat(site.name, "\" name=\"name\">\n              <input type=\"text\" value=\"").concat(site.link, "\" name=\"link\">\n              \n              <svg class=\"icon icon-delete\" aria-hidden=\"true\" data-index=\"").concat(index, "\">\n                  <use xlink:href=\"#icon-delete\"></use>\n              </svg>\n            </div>"));
  $repositorySiteList.append(site);
}

function save() {
  localStorage.setItem('userSiteList', JSON.stringify(userSiteList));
}
},{}]},{},["d6sW"], null)
//# sourceMappingURL=main.b6d11a24.js.map