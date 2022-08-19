import Handle, { IDestroyable } from "./handle";

export default class MultiboardItem extends Handle implements IDestroyable {
    protected static override map: WeakMap<multiboarditem, MultiboardItem>;
    public declare readonly handle: multiboarditem;

    protected constructor(handle: multiboarditem) {
        if (MultiboardItem.initHandle) {
            super(MultiboardItem.initHandle);
            return;
        }

        if (handle !== undefined) {
            super(handle);
            MultiboardItem.map.set(handle, this);
            return;
        }

        error(`Failed to create multiboarditem handle.`, 3);
    }

    public override isValid(): this is MultiboardItem {
        //TODO: test if this works
        return GetHandleId(this.handle) !== -1;
    }

    public destroy() {
        MultiboardReleaseItem(this.handle);
        MultiboardItem.map.delete(this.handle);
    }

    public static fromHandle(handle?: multiboarditem) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: multiboarditem) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new (MultiboardItem as any)() as MultiboardItem;
        this.initHandle = undefined;

        return o;
    }
}
