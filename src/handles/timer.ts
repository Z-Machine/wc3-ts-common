import Handle, { IDestroyable } from "./handle";

export default class Timer extends Handle implements IDestroyable {
    protected static override map: WeakMap<timer, Timer>;
    public declare readonly handle: timer;

    public constructor() {
        if (Timer.initHandle) {
            super(Timer.initHandle);
            return;
        }

        const handle = CreateTimer();
        if (handle !== undefined) {
            super(handle);
            Timer.map.set(handle, this);
            return;
        }

        error(`Failed to create timer handle.`, 3);
    }

    // TODO: Check if this works.
    public override isValid(): this is Timer {
        return GetHandleId(this.handle) !== 0;
    }

    public destroy(): void {
        this.pause();
        Timer.map.delete(this.handle);
        DestroyTimer(this.handle);
    }

    public get elapsed(): number {
        return TimerGetElapsed(this.handle);
    }

    /**
     * @bug This might not return the correct value if the timer was paused and restarted at one point. See http://www.wc3c.net/showthread.php?t=95756.
     */
    public get remaining(): number {
        return TimerGetRemaining(this.handle);
    }

    public get timeout(): number {
        return TimerGetTimeout(this.handle);
    }

    public pause() {
        PauseTimer(this.handle);
    }

    public resume() {
        ResumeTimer(this.handle);
    }

    public start(timeout: number, periodic: boolean, handlerFunc: () => void) {
        TimerStart(this.handle, timeout, periodic, handlerFunc);
    }

    /**
     * @bug Might crash the game if called when there is no expired timer.
     */
    public static fromExpired() {
        return this.fromHandle(GetExpiredTimer());
    }

    public static fromHandle(handle?: timer) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: timer) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new Timer();
        this.initHandle = undefined;

        return o;
    }
}
