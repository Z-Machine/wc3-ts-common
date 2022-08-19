import Handle, { IDestroyable } from "./handle";

export default class Multiboard extends Handle implements IDestroyable {
    protected static override map: WeakMap<multiboard, Multiboard>;
    public declare readonly handle: multiboard;

    public constructor() {
        if (Multiboard.initHandle) {
            super(Multiboard.initHandle);
            return;
        }

        const handle = CreateMultiboard();
        if (handle !== undefined) {
            super(handle);
            Multiboard.map.set(handle, this);
            return;
        }

        error(`Failed to create multiboard handle.`, 3);
    }

    public override isValid(): this is Multiboard {
        //TODO: test if this works
        return GetHandleId(this.handle) !== -1;
    }

    public destroy() {
        DestroyMultiboard(this.handle);
        Multiboard.map.delete(this.handle);
    }

    public static fromHandle(handle?: multiboard) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: multiboard) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new (Multiboard as any)() as Multiboard;
        this.initHandle = undefined;

        return o;
    }
}
