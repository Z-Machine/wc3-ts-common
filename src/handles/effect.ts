import Handle, { IDestroyable } from "./handle";
import type MapPlayer from "./player";
import type Point from "./point";
import type Widget from "./widget";

export default class Effect extends Handle implements IDestroyable {
    protected static override map: WeakMap<effect, Effect>;
    public declare readonly handle: effect;

    public readonly attachWidget?: Widget;
    public readonly attachPointName?: string;

    protected constructor(handle: effect, attachWidget?: Widget, attachPointName?: string) {
        if (Effect.initHandle) {
            super(Effect.initHandle);
            Effect.map.set(this.handle, this);
            return;
        }

        if (handle !== undefined) {
            super(handle);
            Effect.map.set(handle, this);

            this.attachWidget = attachWidget;
            this.attachPointName = attachPointName;
            return;
        }

        error(`Failed to create effect handle.`, 3);
    }

    public override isValid(): this is Effect {
        return GetHandleId(this.handle) !== 0;
    }

    /**
     * @note Will play the effect's death animation.
     */
    public destroy(): void {
        Effect.map.delete(this.handle);
        DestroyEffect(this.handle);
    }

    public get scale() {
        return BlzGetSpecialEffectScale(this.handle);
    }

    public set scale(v: number) {
        BlzSetSpecialEffectScale(this.handle, v);
    }

    /**
     * Warning: asynchronous
     * @async
     */
    public get x() {
        return BlzGetLocalSpecialEffectX(this.handle);
    }

    public set x(v: number) {
        BlzSetSpecialEffectX(this.handle, v);
    }

    /**
     * Warning: asynchronous
     * @async
     */
    public get y() {
        return BlzGetLocalSpecialEffectY(this.handle);
    }

    public set y(v: number) {
        BlzSetSpecialEffectY(this.handle, v);
    }

    /**
     * Warning: asynchronous
     * @async
     */
    public get z() {
        return BlzGetLocalSpecialEffectZ(this.handle);
    }

    public set z(v: number) {
        BlzSetSpecialEffectZ(this.handle, v);
    }

    public addSubAnimation(subAnim: subanimtype) {
        BlzSpecialEffectAddSubAnimation(this.handle, subAnim);
    }

    public clearSubAnimation() {
        BlzSpecialEffectClearSubAnimations(this.handle);
    }

    public playAnimation(animType: animtype) {
        BlzPlaySpecialEffect(this.handle, animType);
    }

    public playWithTimeScale(animType: animtype, timeScale: number) {
        BlzPlaySpecialEffectWithTimeScale(this.handle, animType, timeScale);
    }

    public removeSubAnimation(subAnim: subanimtype) {
        BlzSpecialEffectRemoveSubAnimation(this.handle, subAnim);
    }

    public resetScaleMatrix() {
        BlzResetSpecialEffectMatrix(this.handle);
    }

    public setAlpha(alpha: number) {
        BlzSetSpecialEffectAlpha(this.handle, alpha);
    }

    public setColor(red: number, green: number, blue: number) {
        BlzSetSpecialEffectColor(this.handle, red, green, blue);
    }

    public setColorByPlayer(whichPlayer: MapPlayer) {
        BlzSetSpecialEffectColorByPlayer(this.handle, whichPlayer.handle);
    }

    public setHeight(height: number) {
        BlzSetSpecialEffectHeight(this.handle, height);
    }

    public setOrientation(yaw: number, pitch: number, roll: number) {
        BlzSetSpecialEffectOrientation(this.handle, yaw, pitch, roll);
    }

    public setPitch(pitch: number) {
        BlzSetSpecialEffectPitch(this.handle, pitch);
    }

    public setPoint(p: Point) {
        BlzSetSpecialEffectPositionLoc(this.handle, p.handle);
    }

    public setPosition(x: number, y: number, z: number) {
        BlzSetSpecialEffectPosition(this.handle, x, y, z);
    }

    public setRoll(roll: number) {
        BlzSetSpecialEffectRoll(this.handle, roll);
    }

    public setScaleMatrix(x: number, y: number, z: number) {
        BlzSetSpecialEffectMatrixScale(this.handle, x, y, z);
    }

    public setTime(value: number) {
        BlzSetSpecialEffectTime(this.handle, value);
    }

    public setTimeScale(timeScale: number) {
        BlzSetSpecialEffectTimeScale(this.handle, timeScale);
    }

    public setYaw(y: number) {
        BlzSetSpecialEffectYaw(this.handle, y);
    }

    /**
     * Creates a special effect attached to a widget.
     * @param modelName The path of the model that the effect will use.
     * @param targetWidget The widget to attach the effect to.
     * @param attachPointName The attachment point of the widget where the effect will
     * be placed. Attachment points are points in a model that can be referenced to as
     * areas for effects to be attached, whether it be from a spell or this function.
     * If the attachment point does not exist, it will attach the effect to the model's origin.
     */
    public static fromAttachment(modelName: string, targetWidget: Widget, attachPointName: string) {
        const handle = AddSpecialEffectTarget(modelName, targetWidget.handle, attachPointName);
        if (handle !== undefined) {
            return new Effect(handle, targetWidget, attachPointName);
        }
    }

    /**
     * Creates a spell visual effect at position.
     * ```ts
     * // Create Thunder Clap's caster art effect at [0,0]
     * const clap = Effect.fromSpellId(FourCC("AHtz"), EFFECT_TYPE_CASTER, 0, 0);
     * ```
     */
    public static fromSpellId(abilityId: number, effectType: effecttype, x: number, y: number) {
        const handle = AddSpellEffectById(abilityId, effectType, x, y);
        if (handle !== undefined) {
            return new Effect(handle);
        }
    }

    public static fromSpellString(abilityString: string, effectType: effecttype, x: number, y: number) {
        const handle = AddSpellEffect(abilityString, effectType, x, y);
        if (handle !== undefined) {
            return new Effect(handle);
        }
    }

    public static fromSpellAttachment(
        modelName: string,
        effectType: effecttype,
        targetWidget: Widget,
        attachPointName: string
    ) {
        const handle = AddSpellEffectTarget(modelName, effectType, targetWidget.handle, attachPointName);
        if (handle !== undefined) {
            return new Effect(handle, targetWidget, attachPointName);
        }
    }

    public static fromSpellIdAttachment(
        abilityId: number,
        effectType: effecttype,
        targetWidget: Widget,
        attachPointName: string
    ) {
        const handle = AddSpellEffectTargetById(abilityId, effectType, targetWidget.handle, attachPointName);
        if (handle !== undefined) {
            return new Effect(handle, targetWidget, attachPointName);
        }
    }

    public static fromHandle(handle?: effect) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: effect) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new (Effect as any)() as Effect;
        this.initHandle = undefined;

        return o;
    }
}
