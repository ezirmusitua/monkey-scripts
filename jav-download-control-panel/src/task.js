class Task {
    constructor(name = '') {
        this.name = name;
    }

    setName(name) {
        this.name = name;
    }

    setPanelParent(el) {
        this.panelParent = el;
    }

    setProgressBarParent(el) {
        this.progressBarParent = el;
    }

    setMagnent(magnent) {
        this.magnent = magnent;
    }

    static calcScore(ttRes) {
        return ttRes.reduce((best, magnet) => {
            const current = {
                link: magnet.link,
                score: (magnet.sCount || 0) * 10 + (magnet.cCount || 0) * 5 + (magnet.lCount || 0) * 2,
                size: parseInt(magnet.size.slice(0, -2), 10) * (magnet.size.indexOf('GB') > -1 ? 1000 : 1),
            };
            if (current.score < best.score) return best;
            if (current.score > best.score) return current;
            if (current.size < best.size) return best;
            return current;
        }, {link: '', score: 0, size: 0});
    }

    static joinName(tasks) {
        return tasks.reduce((res, t) => res += t.name + ';', '');
    }

    static fromSingleElem(elem) {
        const task = new Task();
        task.setName(elem.children[0].children[0].children[0].children[1].textContent);
        task.setPanelParent(elem);
        task.setProgressBarParent(elem.children[0].children[0].children[0].children[1]);
    }

    static fromListElem(elem) {
        const task = new Task();
        task.setName(elem.children[0].children[0].textContent);
        task.setPanelParent(elem);
        task.setProgressBarParent(elem.children[0].children[0]);
        return task;
    }

    static fromHomeElem(elem) {
        const task = new Task();
        task.setName(elem.children[0].textContent);
        task.setPanelParent(elem);
        task.setProgressBarParent(elem.children[0]);
        return task;
    }
}

module.exports = {Task};