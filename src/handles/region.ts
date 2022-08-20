import Handle, { IDestroyable } from "./handle";
import type Point from "./point";
import type Rectangle from "./rect";
import type Unit from "./unit";

export default class Region extends Handle implements IDestroyable {
    protected static override map: WeakMap<region, Region>;
    public declare readonly handle: region;

    constructor() {
        if (Region.initHandle) {
            super(Region.initHandle);
            Region.map.set(this.handle, this);
            return;
        }

        const handle = CreateRegion();
        if (handle !== undefined) {
            super(handle);
            Region.map.set(handle, this);
            return;
        }

        error(`Failed to create region handle.`, 3);
    }

    public override isValid(): this is Region {
        return GetHandleId(this.handle) !== 0;
    }

    public destroy() {
        Region.map.delete(this.handle);
        RemoveRegion(this.handle);
    }

    public addCell(x: number, y: number) {
        RegionAddCell(this.handle, x, y);
    }

    public addCellPoint(whichPoint: Point) {
        RegionAddCellAtLoc(this.handle, whichPoint.handle);
    }

    public addRect(whichRect: Rectangle) {
        RegionAddRect(this.handle, whichRect.handle);
    }

    public clearCell(x: number, y: number) {
        RegionClearCell(this.handle, x, y);
    }

    public clearCellPoint(whichPoint: Point) {
        RegionClearCellAtLoc(this.handle, whichPoint.handle);
    }

    public clearRect(r: Rectangle) {
        RegionClearRect(this.handle, r.handle);
    }

    public containsCoords(x: number, y: number) {
        return IsPointInRegion(this.handle, x, y);
    }

    public containsPoint(whichPoint: Point) {
        IsLocationInRegion(this.handle, whichPoint.handle);
    }

    public containsUnit(whichUnit: Unit) {
        return IsUnitInRegion(this.handle, whichUnit.handle);
    }

    public static fromEvent() {
        return this.fromHandle(GetTriggeringRegion());
    }

    public static fromHandle(handle?: region) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: region) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new (Region as any)() as Region;
        this.initHandle = undefined;

        return o;
    }
}
