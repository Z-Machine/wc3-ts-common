import type MapPlayer from "./player";
import Widget from "./widget";

export default class Unit extends Widget {
    protected static override map: WeakMap<handle, Unit>;
    public declare readonly handle: unit;

    /**
     *
     * @param owner required
     * @param unitId required
     * @param x required
     * @param y required
     * @param face defaults to `bj_UNIT_FACING`
     * @param skinId optional
     * @returns
     */
    public constructor(owner?: MapPlayer, unitId?: number, x?: number, y?: number, face?: number, skinId?: number);
    public constructor(owner: MapPlayer, unitId: number, x: number, y: number, face?: number, skinId?: number) {
        if (Unit.initHandle) {
            super(Unit.initHandle);
            return;
        }

        if (owner === undefined || unitId === undefined || x === undefined || y === undefined) {
            error(`Unit.Constructor missing required parameters.`, 3);
        }

        face = bj_UNIT_FACING;

        const handle = skinId
            ? BlzCreateUnitWithSkin(owner.handle, unitId, x, y, face, skinId)
            : CreateUnit(owner?.handle, unitId, x, y, face);
        if (handle) {
            super(handle);
            Unit.map.set(handle, this);
            return;
        }

        error(`Failed to create unit handle.`, 3);
    }

    public override isValid(): boolean {
        return this.handle && GetUnitTypeId(this.handle) !== 0;
    }

    public get name() {
        return GetUnitName(this.handle) ?? "";
    }

    public set name(v: string) {
        BlzSetUnitName(this.handle, v);
    }

    public static fromEvent() {
        return this.fromHandle(GetTriggerUnit());
    }

    public static fromFilter() {
        return this.fromHandle(GetFilterUnit());
    }

    public static fromHandle(handle?: handle) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: handle) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new Unit();
        this.initHandle = undefined;

        return o;
    }

    /**
     * @async
     */
    public static fromLocal() {
        return this.fromHandle(GetLocalPlayer())!;
    }
}
