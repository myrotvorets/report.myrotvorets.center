// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (!HTMLFormElement.prototype.reportValidity) {
    HTMLFormElement.prototype.reportValidity = function (): boolean {
        if (this.checkValidity()) {
            return true;
        }

        const btn = document.createElement('button');
        this.appendChild(btn);
        btn.click();
        this.removeChild(btn);
        return false;
    };
}
