import Handle from "./handle";

export default abstract class Widget extends Handle {
    public declare readonly handle: widget;

    public get life() {
        return GetWidgetLife(this.handle);
    }

    public set life(v: number) {
        SetWidgetLife(this.handle, v);
    }

    public get x() {
        return GetWidgetX(this.handle);
    }

    public get y() {
        return GetWidgetY(this.handle);
    }

    public static fromTrigger() {
        return this.fromHandle(GetTriggerWidget());
    }

    public static fromHandle(handle?: handle) {
        return handle ? (this.getObject(handle) as Widget) : undefined;
    }
}
