import Handle from "./handle";

/**
 * Should you really be using these?
 */
export default class Trackable extends Handle {
    protected static override map: WeakMap<handle, Trackable>;
    public declare readonly handle: trackable;

    public constructor(modelPath: string, x: number, y: number, facing: number) {
        if (Trackable.initHandle) {
            super(Trackable.initHandle);
            return;
        }

        if (modelPath === undefined || x === undefined || y === undefined || facing === undefined) {
            error(`Trackable.Constructor missing required parameters.`, 3);
        }

        const handle = CreateTrackable(modelPath, x, y, facing);
        if (handle) {
            super(handle);
            Trackable.map.set(handle, this);
            return;
        }

        error(`Failed to create trackable handle.`, 3);
    }

    public override isValid(): this is Trackable {
        return GetHandleId(this.handle) !== 0;
    }

    public static fromEvent() {
        return this.fromHandle(GetTriggeringTrackable());
    }

    public static fromHandle(handle?: handle) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: handle) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new (Trackable as any)() as Trackable;
        this.initHandle = undefined;

        return o;
    }
}
