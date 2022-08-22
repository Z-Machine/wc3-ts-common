import Handle, { IDestroyable } from "./handle";
import type Unit from "./unit";

export default class TextTag extends Handle implements IDestroyable {
    protected static override map: WeakMap<texttag, TextTag>;
    public declare readonly handle: texttag;

    public constructor() {
        if (TextTag.initHandle) {
            super(TextTag.initHandle);
            return;
        }

        const handle = CreateTextTag();
        if (handle) {
            super(handle);
            TextTag.map.set(handle, this);
            return;
        }

        error(`Failed to create texttag handle.`, 3);
    }

    public override isValid(): this is TextTag {
        return GetHandleId(this.handle) !== 0;
    }

    public destroy(): void {
        TextTag.map.delete(this.handle);
        DestroyTextTag(this.handle);
    }

    public setAge(value: number) {
        SetTextTagAge(this.handle, value);
    }

    public setColor(red: number, green: number, blue: number, alpha: number) {
        SetTextTagColor(this.handle, red, green, blue, alpha);
    }

    public setFadepoint(value: number) {
        SetTextTagFadepoint(this.handle, value);
    }

    public setLifespan(value: number) {
        SetTextTagLifespan(this.handle, value);
    }

    public setPermanent(flag: boolean) {
        SetTextTagPermanent(this.handle, flag);
    }

    public setPos(x: number, y: number, heightOffset: number) {
        SetTextTagPos(this.handle, x, y, heightOffset);
    }

    public setPosUnit(whichUnit: Unit, heightOffset: number) {
        SetTextTagPosUnit(this.handle, whichUnit.handle, heightOffset);
    }

    public setSuspended(flag: boolean) {
        SetTextTagSuspended(this.handle, flag);
    }

    public setText(text: string, height: number, adjustHeight = false) {
        if (adjustHeight) {
            height *= 0.0023;
        }
        SetTextTagText(this.handle, text, height);
    }

    public setVelocity(xvel: number, yvel: number) {
        SetTextTagVelocity(this.handle, xvel, yvel);
    }

    public setVelocityAngle(speed: number, angle: number) {
        const vel = (speed * 0.071) / 128;
        this.setVelocity(vel * Cos(angle * bj_DEGTORAD), vel * Sin(angle * bj_DEGTORAD));
    }

    public setVisible(flag: boolean) {
        SetTextTagVisibility(this.handle, flag);
    }

    public static fromHandle(handle?: texttag) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: texttag) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new (TextTag as any)() as TextTag;
        this.initHandle = undefined;

        return o;
    }
}
