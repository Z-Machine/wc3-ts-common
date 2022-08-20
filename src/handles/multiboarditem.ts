import Handle, { IDestroyable } from "./handle";
import Multiboard from "./multiboard";

export default class MultiboardItem extends Handle implements IDestroyable {
    protected static override map: WeakMap<multiboarditem, MultiboardItem>;
    public declare readonly handle: multiboarditem;

    protected constructor(board: Multiboard, x: number, y: number) {
        if (MultiboardItem.initHandle) {
            super(MultiboardItem.initHandle);
            return;
        }

        const handle = MultiboardGetItem(board.handle, x - 1, y - 1);
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

    public setIcon(icon: string) {
        MultiboardSetItemIcon(this.handle, icon);
    }

    public setStyle(showValue: boolean, showIcon: boolean) {
        MultiboardSetItemStyle(this.handle, showValue, showIcon);
    }

    public setValue(value: string) {
        MultiboardSetItemValue(this.handle, value);
    }

    public setValueColor(red: number, green: number, blue: number, alpha: number) {
        MultiboardSetItemValueColor(this.handle, red, green, blue, alpha);
    }

    public setWidth(width: number) {
        MultiboardSetItemWidth(this.handle, width);
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
