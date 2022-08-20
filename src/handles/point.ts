import Handle, { IDestroyable } from "./handle";
import type MapPlayer from "./player";

export default class Point extends Handle implements IDestroyable {
    protected static override map: WeakMap<location, Point>;
    public declare readonly handle: location;

    protected constructor(x: number, y: number) {
        if (Point.initHandle) {
            super(Point.initHandle);
            Point.map.set(this.handle, this);
            return;
        }

        if (x === undefined || y === undefined) {
            error(`Point.Constructor missing required parameters.`, 3);
        }

        const handle = Location(x, y);
        if (handle !== undefined) {
            super(handle);
            Point.map.set(handle, this);
            return;
        }

        RemoveLocation(handle);
        error(`Failed to create point handle.`, 3);
    }

    public destroy(): void {
        Point.map.delete(this.handle);
        RemoveLocation(this.handle);
    }

    public override isValid(): this is Point {
        return GetHandleId(this.handle) !== -1;
    }

    public get x() {
        return GetLocationX(this.handle);
    }

    public set x(v: number) {
        MoveLocation(this.handle, v, this.y);
    }

    public get y() {
        return GetLocationY(this.handle);
    }

    public set y(v: number) {
        MoveLocation(this.handle, this.x, v);
    }

    /**
     * This function is asynchronous. The values it returns are not guaranteed synchronous between each player.
     * If you attempt to use it in a synchronous manner, it may cause a desync.
     * @note Reasons for returning different values might be terrain-deformations caused by spells/abilities and different graphic settings.
     * Other reasons could be the rendering state of destructables and visibility differences.
     * @async
     */
    public get z() {
        return GetLocationZ(this.handle);
    }

    public setPosition(x: number, y: number) {
        MoveLocation(this.handle, x, y);
    }

    public static fromPlayerStart(whichPlayer: MapPlayer) {
        return this.fromHandle(GetStartLocationLoc(GetPlayerStartLocation(whichPlayer.handle)));
    }

    public static fromHandle(handle?: location) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: location) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new (Point as any)() as Point;
        this.initHandle = undefined;

        return o;
    }
}
