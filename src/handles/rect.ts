import { AnyFilter, asFilter } from "../types/filter";
import Handle, { IDestroyable } from "./handle";
import type Item from "./item";
import type Point from "./point";
import type Unit from "./unit";

export default class Rectangle extends Handle implements IDestroyable {
    protected static override map: WeakMap<rect, Rectangle>;
    public declare readonly handle: rect;

    public constructor(minX: number, minY: number, maxX: number, maxY: number) {
        if (Rectangle.initHandle) {
            super(Rectangle.initHandle);
            Rectangle.map.set(this.handle, this);
            return;
        }

        if (minX === undefined || minY === undefined || maxX === undefined || maxY === undefined) {
            error(`Rectangle.Constructor missing required parameters.`, 3);
        }

        const handle = Rect(minX, minY, maxX, maxY);
        if (handle !== undefined) {
            super(handle);
            Rectangle.map.set(handle, this);
            return;
        }

        error(`Failed to create rect handle.`, 3);
    }

    public override isValid(): this is Rectangle {
        return GetHandleId(this.handle) !== 0;
    }

    public destroy(): void {
        Rectangle.map.delete(this.handle);
        RemoveRect(this.handle);
    }

    public get centerX() {
        return GetRectCenterX(this.handle);
    }

    public get centerY() {
        return GetRectCenterY(this.handle);
    }

    public get maxX() {
        return GetRectMaxX(this.handle);
    }

    public get maxY() {
        return GetRectMaxY(this.handle);
    }

    public get minX() {
        return GetRectMinX(this.handle);
    }

    public get minY() {
        return GetRectMinY(this.handle);
    }

    public hasXY(x: number, y: number) {
        return RectContainsCoords(this.handle, x, y);
    }

    public hasUnit(whichUnit: Unit) {
        return RectContainsUnit(this.handle, whichUnit.handle);
    }

    public hasItem(whichItem: Item) {
        return RectContainsItem(whichItem.handle, this.handle);
    }

    public hasPoint(whichPoint: Point) {
        return RectContainsLoc(this.handle, whichPoint.handle);
    }

    public enumDestructables(filter: AnyFilter, actionFunc: () => void) {
        EnumDestructablesInRect(this.handle, asFilter(filter), actionFunc);
    }

    public enumItems(filter: AnyFilter, actionFunc: () => void) {
        EnumItemsInRect(this.handle, asFilter(filter), actionFunc);
    }

    public move(newCenterX: number, newCenterY: number) {
        MoveRectTo(this.handle, newCenterX, newCenterY);
    }

    public movePoint(newCenterPoint: Point) {
        MoveRectToLoc(this.handle, newCenterPoint.handle);
    }

    public setRect(minX: number, minY: number, maxX: number, maxY: number) {
        SetRect(this.handle, minX, minY, maxX, maxY);
    }

    public setRectFromPoint(min: Point, max: Point) {
        SetRectFromLoc(this.handle, min.handle, max.handle);
    }

    public setDoodadAnimation(doodadId: number, animName: string, animRandom: boolean = false) {
        SetDoodadAnimationRect(this.handle, doodadId, animName, animRandom);
    }

    public static fromPoint(min: Point, max: Point) {
        return this.fromHandle(RectFromLoc(min.handle, max.handle));
    }

    /**
     * @returns full map bounds, including unplayable borders, in world coordinates.
     */
    public static getWorldBounds() {
        return this.fromHandle(GetWorldBounds());
    }

    public static fromHandle(handle?: rect) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: rect) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new (Rectangle as any)() as Rectangle;
        this.initHandle = undefined;

        return o;
    }
}
