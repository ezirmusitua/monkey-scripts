const { Sites } = require('./sites');

(function () {
    Sites.forEach(site => {
        site.start(window.location.href);
    });
})();