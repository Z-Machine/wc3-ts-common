import Widget from "./widget";

export default class Item extends Widget {
    protected static override map: WeakMap<item, Item>;
    public declare readonly handle: item;

    public constructor(itemId: number, x: number, y: number, skinId?: number) {
        if (Item.initHandle) {
            super(Item.initHandle);
            return;
        }

        if (itemId === undefined || x === undefined || y === undefined) {
            error(`Item.Constructor missing required parameters.`, 3);
        }

        const handle = skinId === undefined ? CreateItem(itemId, x, y) : BlzCreateItemWithSkin(itemId, x, y, skinId);
        if (handle !== undefined) {
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
        o = new (Item as any)() as Item;
        this.initHandle = undefined;

        return o;
    }
}
