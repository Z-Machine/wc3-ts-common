import Handle, { IDestroyable } from "./handle";
import type Timer from "./timer";

export default class TimerDialog extends Handle implements IDestroyable {
    protected static override map: WeakMap<handle, TimerDialog>;
    public declare readonly handle: timerdialog;

    protected constructor(handle?: timerdialog) {
        if (TimerDialog.initHandle) {
            super(TimerDialog.initHandle);
            return;
        }

        if (handle !== undefined) {
            super(handle);
            TimerDialog.map.set(handle, this);
            return;
        }

        error(`Failed to create timerdialog handle.`, 3);
    }

    // TODO: Check if this works.
    public override isValid(): this is TimerDialog {
        return GetHandleId(this.handle) !== 0;
    }

    public destroy(): void {
        TimerDialog.map.delete(this.handle);
        DestroyTimerDialog(this.handle);
    }

    public get display() {
        return IsTimerDialogDisplayed(this.handle);
    }

    public set display(display: boolean) {
        TimerDialogDisplay(this.handle, display);
    }

    public setSpeed(speedMultFactor: number) {
        TimerDialogSetSpeed(this.handle, speedMultFactor);
    }

    public setTimeRemaining(value: number) {
        TimerDialogSetRealTimeRemaining(this.handle, value);
    }

    public setTitle(title: string) {
        TimerDialogSetTitle(this.handle, title);
    }

    /**
     * Sets the timer-dialogs color.
     * @param red An integer from 0-255 determining the amount of red color.
     * @param green An integer from 0-255 determining the amount of green color.
     * @param blue An integer from 0-255 determining the amount of blue color.
     * @param alpha An integer from 0-255 determining the amount of alpha.
     */
    public setTitleColor(red: number, green: number, blue: number, alpha: number) {
        TimerDialogSetTitleColor(this.handle, red, green, blue, alpha);
    }

    /**
     * Sets the timer-dialogs time color.
     * @param red An integer from 0-255 determining the amount of red color.
     * @param green An integer from 0-255 determining the amount of green color.
     * @param blue An integer from 0-255 determining the amount of blue color.
     * @param alpha An integer from 0-255 determining the amount of alpha.
     */
    public setTimeColor(red: number, green: number, blue: number, alpha: number) {
        TimerDialogSetTimeColor(this.handle, red, green, blue, alpha);
    }

    public static fromTimer(whichTimer: Timer) {
        const handle = CreateTimerDialog(whichTimer.handle);
        if (handle !== undefined) {
            return new TimerDialog(handle);
        }
    }

    public static fromHandle(handle?: timerdialog) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: timerdialog) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new TimerDialog();
        this.initHandle = undefined;

        return o;
    }
}
