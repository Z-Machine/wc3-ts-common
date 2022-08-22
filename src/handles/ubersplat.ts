import Handle, { IDestroyable } from "./handle";

/**
 * Should you really be using these?
 */
export default class Ubersplat extends Handle implements IDestroyable {
    protected static override map: WeakMap<ubersplat, Ubersplat>;
    public declare readonly handle: ubersplat;

    public constructor(
        x: number,
        y: number,
        name: string,
        red: number,
        green: number,
        blue: number,
        alpha: number,
        forcePaused: boolean,
        noBirthTime: boolean
    ) {
        if (Ubersplat.initHandle) {
            super(Ubersplat.initHandle);
            return;
        }

        if (
            x === undefined ||
            y === undefined ||
            name === undefined ||
            red === undefined ||
            green === undefined ||
            blue === undefined ||
            alpha === undefined ||
            forcePaused === undefined ||
            noBirthTime === undefined
        ) {
            error(`Ubersplat.Constructor missing required parameters.`, 3);
        }

        const handle = CreateUbersplat(x, y, name, red, green, blue, alpha, forcePaused, noBirthTime);
        if (handle) {
            super(handle);
            Ubersplat.map.set(handle, this);
            return;
        }

        error(`Failed to create ubersplat handle.`, 3);
    }

    public override isValid(): this is Ubersplat {
        return GetHandleId(this.handle) !== 0;
    }

    public destroy(): void {
        Ubersplat.map.delete(this.handle);
        DestroyUbersplat(this.handle);
    }

    /**
     * @bug Does nothing.
     */
    public finish() {
        FinishUbersplat(this.handle);
    }

    public render(flag: boolean, always = false) {
        if (always) {
            SetUbersplatRenderAlways(this.handle, flag);
        } else {
            SetUbersplatRender(this.handle, flag);
        }
    }

    /**
     * @bug Does nothing.
     */
    public reset() {
        ResetUbersplat(this.handle);
    }

    public show(flag: boolean) {
        ShowUbersplat(this.handle, flag);
    }

    public static fromHandle(handle?: ubersplat) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: ubersplat) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new (Ubersplat as any)() as Ubersplat;
        this.initHandle = undefined;

        return o;
    }
}
