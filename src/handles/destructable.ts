import { IDestroyable } from "./handle";
import Widget from "./widget";

export default class Destructable extends Widget implements IDestroyable {
    protected static override map: WeakMap<destructable, Destructable>;
    public declare readonly handle: destructable;

    public constructor(
        objectId: number,
        x: number,
        y: number,
        z: number | undefined,
        face: number,
        scale: number,
        variation: number,
        skinId?: number
    ) {
        if (Destructable.initHandle) {
            super(Destructable.initHandle);
            Destructable.map.set(this.handle, this);
            return;
        }

        if (
            objectId === undefined ||
            x === undefined ||
            y === undefined ||
            face === undefined ||
            scale === undefined ||
            variation === undefined
        ) {
            error(`Destructable.Constructor missing required parameters.`, 3);
        }

        let handle: destructable | undefined;
        if (z === undefined) {
            handle =
                skinId === undefined
                    ? CreateDestructable(objectId, x, y, face, scale, variation)
                    : BlzCreateDestructableWithSkin(objectId, x, y, face, scale, variation, skinId);
        } else {
            handle =
                skinId === undefined
                    ? CreateDestructableZ(objectId, x, y, z, face, scale, variation)
                    : BlzCreateDestructableZWithSkin(objectId, x, y, z, face, scale, variation, skinId);
        }

        if (handle) {
            super(handle);
            Destructable.map.set(handle, this);
            return;
        }

        error(`Failed to create destructable handle.`, 3);
    }

    public override isValid(): this is Destructable {
        return GetHandleId(this.handle) !== 0;
    }

    public destroy(): void {
        Destructable.map.delete(this.handle);
        RemoveDestructable(this.handle);
    }

    public get name() {
        return GetDestructableName(this.handle) ?? "";
    }

    public override get life() {
        return GetDestructableLife(this.handle);
    }

    public override set life(v: number) {
        SetDestructableLife(this.handle, v);
    }

    public get maxLife() {
        return GetDestructableMaxLife(this.handle);
    }

    public set maxLife(v: number) {
        SetDestructableMaxLife(this.handle, v);
    }

    public override get x() {
        return GetDestructableX(this.handle);
    }

    public override get y() {
        return GetDestructableY(this.handle);
    }

    public static fromEvent() {
        return this.fromHandle(GetDyingDestructable());
    }

    public static fromEnum() {
        return this.fromHandle(GetEnumDestructable());
    }

    public static fromHandle(handle?: destructable) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: destructable) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new (Destructable as any)() as Destructable;
        this.initHandle = undefined;

        return o;
    }
}
