const { Sites } = require('./sites');

(function () {
    Sites.reduce((res, site) => {
        site.start(window.location.href);
    });
})();