import Handle, { IDestroyable } from "./handle";
import MapPlayer from "./player";
import type Rectangle from "./rect";

export class FogModifier extends Handle implements IDestroyable {
    protected static override map: WeakMap<handle, FogModifier>;
    public declare readonly handle: fogmodifier;

    protected constructor(handle?: fogmodifier) {
        if (FogModifier.initHandle) {
            super(FogModifier.initHandle);
            FogModifier.map.set(this.handle, this);
            return;
        }

        if (handle !== undefined) {
            super(handle);
            FogModifier.map.set(handle, this);
            return;
        }

        error(`Failed to create fogmodifier handle.`, 3);
    }

    public override isValid(): this is FogModifier {
        return GetHandleId(this.handle) !== 0;
    }

    public destroy(): void {
        FogModifier.map.delete(this.handle);
        DestroyFogModifier(this.handle);
    }

    public start() {
        FogModifierStart(this.handle);
    }

    public stop() {
        FogModifierStop(this.handle);
    }

    /**
     * @param whichPlayer
     * @param whichState Determines what type of fog the area is being modified to.
     * @param x The x-coordinate where the fog modifier begins.
     * @param y The y-coordinate where the fog modifier begins.
     * @param radius Determines the extent that the fog travels (expanding from the coordinates ( centerx , centery )).
     * @param useSharedVision Determines whether or not the fog modifier will be applied to allied players with shared vision.
     * @param afterUnits Will determine whether or not units in that area will be masked by the fog.
     * If it is set to true and the fogstate is masked, it will hide all the units in the fog modifier's radius and mask the area.
     * If set to false, it will only mask the areas that are not visible to the units.
     */
    public static fromRadius(
        whichPlayer: MapPlayer,
        whichState: fogstate,
        x: number,
        y: number,
        radius: number,
        useSharedVision: boolean = true,
        afterUnits = true
    ) {
        const handle = CreateFogModifierRadius(
            whichPlayer.handle,
            whichState,
            x,
            y,
            radius,
            useSharedVision,
            afterUnits
        );

        if (handle !== undefined) {
            return new FogModifier(handle);
        }
    }

    public static fromRect(
        whichPlayer: MapPlayer,
        whichState: fogstate,
        where: Rectangle,
        useSharedVision: boolean = true,
        afterUnits: boolean = true
    ) {
        const handle = CreateFogModifierRect(whichPlayer.handle, whichState, where.handle, useSharedVision, afterUnits);
        if (handle !== undefined) {
            return new FogModifier(handle);
        }
    }

    public static fromHandle(handle?: fogmodifier) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: fogmodifier) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new FogModifier();
        this.initHandle = undefined;

        return o;
    }
}
