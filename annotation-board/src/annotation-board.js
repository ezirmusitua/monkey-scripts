const elements = require('./element');
const request = require('./snippet.service');

class AnnotationBoard {
    constructor() {
        this.request = request;
        this.container = new elements.Container();
        this.textarea = new elements.Textarea();
        this.saveBtn = new elements.Button();
        this.saveBtn.listenClick(() => {
            Selection.copyToClipboard(this.textarea);
            request.save({
                link: window.location.href,
                raw_content: this.textarea.value(),
            });
            this.hide();
        });
        this.container.appendChild([this.textarea, this.saveBtn]);
        this.container.appendTo(document.body);
        this.isShowing = false;
    }

    show() {
        this.textarea.appendSelection();
        this.container.updatePosition();
        this.isShowing = true;
    }

    shouldShow() {
        const isEmptySelection = !!JMUL.Element.getSelection();
        return !this.isShowing && isEmptySelection;
    }

    hide() {
        this.isShowing = false;
        this.container.setStyle('display', 'none');
    }

    shouldHide(event) {
        const target = event && event.target;
        if (!target && this.iShowing) {
            return true;
        } else {
            const inContainer = elements.Container.isContainer(target.id);
            const inTextarea = elements.Textarea.isTextarea(target.id);
            const inButton = elements.Button.isButton(target.id);
            return !inContainer && !inTextarea && !inButton && this.isShowing;
        }
    }
}

module.exports = AnnotationBoard;