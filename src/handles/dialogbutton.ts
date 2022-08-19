import type Dialog from "./dialog";
import Handle from "./handle";

export default class DialogButton extends Handle {
    protected static override map: WeakMap<handle, DialogButton>;
    public declare readonly handle: button;

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
        o = new (DialogButton as any)() as DialogButton;
        this.initHandle = undefined;

        return o;
    }
}
