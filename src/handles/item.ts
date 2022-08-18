import Widget from "./widget";

export default class Item extends Widget {
    protected static override map: WeakMap<handle, Item>;
    public declare readonly handle: item;

    /**
     * @param itemId required
     * @param x required
     * @param y required
     * @param skinId optional
     */
    public constructor(itemId?: number, x?: number, y?: number, skinId?: number);
    public constructor(itemId: number, x: number, y: number, skinId?: number) {
        if (Item.initHandle) {
            super(Item.initHandle);
            return;
        }

        if (itemId === undefined || x === undefined || y === undefined) {
            error(`Item.Constructor missing required parameters.`, 3);
        }

        const handle = skinId ? BlzCreateItemWithSkin(itemId, x, y, skinId) : CreateItem(itemId, x, y);
        if (handle) {
            super(handle);
            Item.map.set(handle, this);
            return;
        }

        error(`Failed to create item handle.`, 3);
    }

    // TODO: Check if this works.
    public override isValid(): this is Item {
        return GetItemTypeId(this.handle) !== 0;
    }

    public get name() {
        return GetItemName(this.handle) ?? "";
    }

    public set name(v: string) {
        BlzSetItemName(this.handle, v);
    }

    public static fromEvent() {
        return this.fromHandle(GetManipulatedItem());
    }

    public static fromFilter() {
        return this.fromHandle(GetFilterItem());
    }

    public static fromHandle(handle?: item) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: item) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new Item();
        this.initHandle = undefined;

        return o;
    }
}
