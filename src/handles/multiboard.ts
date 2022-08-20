import Handle, { IDestroyable } from "./handle";
import MultiboardItem from "./multiboarditem";

export default class Multiboard extends Handle implements IDestroyable {
    protected static override map: WeakMap<multiboard, Multiboard>;
    public declare readonly handle: multiboard;

    /**
     * @bug Do not use this in a global initialisation as it crashes the game there.
     */
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

    public get columns() {
        return MultiboardGetColumnCount(this.handle);
    }

    public set columns(v: number) {
        MultiboardSetColumnCount(this.handle, v);
    }

    public get rows() {
        return MultiboardGetRowCount(this.handle);
    }

    /**
     * @bug It is only safe to change the row count by one. Use multiple calls for bigger values.
     */
    public set rows(v: number) {
        MultiboardSetRowCount(this.handle, v);
    }

    public get display() {
        return IsMultiboardDisplayed(this.handle);
    }

    /**
     * @note Multiboards can not be shown at map-init. Use a wait or a zero-timer to display as soon as possible.
     */
    public set display(b: boolean) {
        MultiboardDisplay(this.handle, b);
    }

    /**
     * @async
     */
    public get minimize() {
        return IsMultiboardMinimized(this.handle);
    }

    /**
     * @async
     */
    public set minimize(b: boolean) {
        MultiboardMinimize(this.handle, b);
    }

    public get title() {
        return MultiboardGetTitleText(this.handle) ?? "";
    }

    public set title(v: string) {
        MultiboardSetTitleText(this.handle, v);
    }

    public clear() {
        MultiboardClear(this.handle);
    }

    public getItem(x: number, y: number) {
        return MultiboardItem.fromMultiboard(this, x, y);
    }

    public setItemIcons(icon: string) {
        MultiboardSetItemsIcon(this.handle, icon);
    }

    public setItemsStyle(showValue: boolean, showIcons: boolean) {
        MultiboardSetItemsStyle(this.handle, showValue, showIcons);
    }

    public setItemsValue(value: string) {
        MultiboardSetItemsValue(this.handle, value);
    }

    public setItemsValueColor(red: number, green: number, blue: number, alpha: number) {
        MultiboardSetItemsValueColor(this.handle, red, green, blue, alpha);
    }

    public setItemsWidth(width: number) {
        MultiboardSetItemsWidth(this.handle, width);
    }

    public setTitleTextColor(red: number, green: number, blue: number, alpha: number) {
        MultiboardSetTitleTextColor(this.handle, red, green, blue, alpha);
    }

    /**
     * Meant to unequivocally suspend display of existing and subsequently displayed multiboards.
     */
    public static suppressDisplay(flag: boolean) {
        MultiboardSuppressDisplay(flag);
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
