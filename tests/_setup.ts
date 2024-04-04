import { jest } from '@jest/globals';

global.jest = jest;

HTMLDialogElement.prototype.show = jest.fn(function mock(
    this: HTMLDialogElement
) {
    this.open = true;
});

HTMLDialogElement.prototype.showModal = jest.fn(function mock(
    this: HTMLDialogElement
) {
    this.open = true;
    this.addEventListener("blur", () => {
        this.close();
    });
});

HTMLDialogElement.prototype.close = jest.fn(function mock(
    this: HTMLDialogElement
) {
    this.open = false;
    this.dispatchEvent(new Event("close"));
});
