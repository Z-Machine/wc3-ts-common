import Handle, { IDestroyable } from "./handle";
import type Rectangle from "./rect";

export default class WeatherEffect extends Handle implements IDestroyable {
    protected static override map: WeakMap<weathereffect, WeatherEffect>;
    public declare readonly handle: weathereffect;

    /**
     * Adds a weather effect.
     * @param where The rect to apply the WeatherEffect to.
     * @param effectId Which effect to apply.
     * @note To understand more about weather effects nature, I advise to read
     * Ammorth's article about weather effects: [http://www.wc3c.net/showthread.php?t=91176](https://web.archive.org/web/20180130202056/http://www.wc3c.net/showthread.php?t=91176).
     * @note To get an idea on how to add your own weather effects, you may read
     * CryoniC's article about custom weather effects: [http://www.wc3c.net/showthread.php?t=67949](https://web.archive.org/web/20180507060112/http://www.wc3c.net/showthread.php?t=67949).
     */
    public constructor(where: Rectangle, effectId: number) {
        if (WeatherEffect.initHandle) {
            super(WeatherEffect.initHandle);
            return;
        }

        if (where === undefined || effectId === undefined) {
            error(`WeatherEffect.Constructor missing required parameters.`, 3);
        }

        const handle = AddWeatherEffect(where.handle, effectId);
        if (handle) {
            super(handle);
            WeatherEffect.map.set(handle, this);
            return;
        }

        error(`Failed to create weathereffect handle.`, 3);
    }

    public override isValid(): this is WeatherEffect {
        return GetHandleId(this.handle) !== 0;
    }

    public destroy(): void {
        WeatherEffect.map.delete(this.handle);
        RemoveWeatherEffect(this.handle);
    }

    public enable(flag: boolean) {
        EnableWeatherEffect(this.handle, flag);
    }

    public static fromHandle(handle?: weathereffect) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: weathereffect) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new (WeatherEffect as any)() as WeatherEffect;
        this.initHandle = undefined;

        return o;
    }
}
