import Handle, { IDestroyable } from "./handle";
import type MapPlayer from "./player";

// TODO: add example usage.
export default class Dialog extends Handle implements IDestroyable {
    protected static override map: WeakMap<handle, Dialog>;
    public declare readonly handle: dialog;

    public constructor() {
        if (Dialog.initHandle) {
            super(Dialog.initHandle);
            Dialog.map.set(this.handle, this);
            return;
        }

        const handle = DialogCreate();

        if (handle !== undefined) {
            super(handle);
            Dialog.map.set(handle, this);
            return;
        }

        error(`Failed to create dialog handle.`, 3);
    }

    public override isValid(): this is Dialog {
        return GetHandleId(this.handle) !== 0;
    }

    public destroy(): void {
        Dialog.map.delete(this.handle);
        DialogDestroy(this.handle);
    }

    public addButton(text: string, hotkey = 0, quit = false, score = false) {
        return new DialogButton(this, text, hotkey, quit, score);
    }

    public clear() {
        DialogClear(this.handle);
    }

    /**
     * @note Dialogs can not be shown at map-init. Use a wait or a zero-timer to display as soon as possible.
     */
    public display(whichPlayer: MapPlayer, flag: boolean) {
        DialogDisplay(whichPlayer.handle, this.handle, flag);
    }

    public setMessage(whichMessage: string) {
        DialogSetMessage(this.handle, whichMessage);
    }

    public static fromEvent() {
        return this.fromHandle(GetClickedDialog());
    }

    public static fromHandle(handle?: dialog) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: dialog) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new Dialog();
        this.initHandle = undefined;

        return o;
    }
}

export class DialogButton extends Handle {
    protected static override map: WeakMap<handle, DialogButton>;
    public declare readonly handle: button;

    /**
     * @param whichDialog required
     * @param text required
     * @param hotkey optional
     * @param quit optional
     * @param score optional
     */
    public constructor(whichDialog?: Dialog, text?: string, hotkey?: number, quit?: boolean, score?: boolean);
    public constructor(
        whichDialog: Dialog,
        text: string,
        hotkey: number = 0,
        quit: boolean = false,
        score: boolean = false
    ) {
        if (DialogButton.initHandle) {
            super(DialogButton.initHandle);
            DialogButton.map.set(this.handle, this);
            return;
        }

        if (whichDialog === undefined || text === undefined) {
            error(`DialogButton.Constructor missing required parameters.`, 3);
        }

        const handle = quit
            ? DialogAddButton(whichDialog.handle, text, hotkey)
            : DialogAddQuitButton(whichDialog.handle, score, text, hotkey);

        if (handle !== undefined) {
            super(handle);
            DialogButton.map.set(handle, this);
            return;
        }

        error(`Failed to create button handle.`, 3);
    }

    public override isValid(): this is Dialog {
        return GetHandleId(this.handle) !== 0;
    }

    public static fromEvent() {
        return this.fromHandle(GetClickedButton());
    }

    public static fromHandle(handle?: button) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: button) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new DialogButton();
        this.initHandle = undefined;

        return o;
    }
}