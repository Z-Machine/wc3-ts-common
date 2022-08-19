import Handle, { IDestroyable } from "./handle";

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

    destroy(): void {
        Point.map.delete(this.handle);
        RemoveLocation(this.handle);
    }

    public override isValid(): this is Point {
        return GetHandleId(this.handle) !== 0;
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
