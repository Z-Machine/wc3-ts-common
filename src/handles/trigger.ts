import Handle, { IDestroyable } from "./handle";

export default class Trigger extends Handle implements IDestroyable {
    protected static override map: WeakMap<handle, Trigger>;
    public declare readonly handle: trigger;

    public constructor() {
        if (Trigger.initHandle) {
            super(Trigger.initHandle);
            return;
        }

        const handle = CreateTrigger();
        if (handle !== undefined) {
            super(handle);
            Trigger.map.set(handle, this);
            return;
        }

        error(`Failed to create trigger handle.`, 3);
    }

    // TODO: Check if this works.
    public override isValid(): this is Trigger {
        return GetHandleId(this.handle) !== 0;
    }

    public destroy(): void {
        this.disable();
        Trigger.map.delete(this.handle);
        DestroyTrigger(this.handle);
    }

    public disable() {
        DisableTrigger(this.handle);
    }

    public enable() {
        EnableTrigger(this.handle);
    }

    public static fromEvent() {
        return this.fromHandle(GetTriggeringTrigger());
    }

    public static fromHandle(handle?: trigger) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: trigger) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new (Trigger as any)() as Trigger;
        this.initHandle = undefined;

        return o;
    }
}
