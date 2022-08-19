import Handle from "./handle";
import Point from "./point";

export default class CameraSetup extends Handle {
    protected static override map: WeakMap<camerasetup, CameraSetup>;
    public declare readonly handle: camerasetup;

    public constructor() {
        if (CameraSetup.initHandle) {
            super(CameraSetup.initHandle);
            CameraSetup.map.set(this.handle, this);
            return;
        }

        const handle = CreateCameraSetup();
        if (handle !== undefined) {
            super(handle);
            CameraSetup.map.set(handle, this);
            return;
        }

        error(`Failed to create camerasetup handle.`, 3);
    }

    public override isValid(): this is CameraSetup {
        return GetHandleId(this.handle) !== 0;
    }

    public static fromHandle(handle?: camerasetup) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: camerasetup) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new CameraSetup();
        this.initHandle = undefined;

        return o;
    }

    /**
     * Returns the target Point of a CameraSetup.
     */
    public get destPoint() {
        return Point.fromHandle(CameraSetupGetDestPositionLoc(this.handle));
    }

    /**
     * Returns the target x-coordinate of a CameraSetup.
     */
    public get destX() {
        return CameraSetupGetDestPositionX(this.handle);
    }

    /**
     * Sets the target x-coordinate of a CameraSetup.
     */
    public set destX(x: number) {
        CameraSetupSetDestPosition(this.handle, x, this.destY, 0);
    }

    /**
     * Returns the target y-coordinate of a CameraSetup.
     */
    public get destY() {
        return CameraSetupGetDestPositionY(this.handle);
    }

    /**
     * Sets the target y-coordinate of a CameraSetup.
     */
    public set destY(y: number) {
        CameraSetupSetDestPosition(this.handle, this.destX, y, 0);
    }

    /**
     * Sets the label of a CameraSetup.
     */
    public set label(label: string) {
        BlzCameraSetupSetLabel(this.handle, label);
    }

    /**
     * Gets the label of a CameraSetup.
     */
    public get label() {
        return BlzCameraSetupGetLabel(this.handle) ?? "";
    }

    /**
     * Applies the CameraSetup, altering the current camera's fields to match those of the camera setup.
     * @param doPan If set to true, it will move the current camera's target coordinates to the
     * camera setup's target coordinates. If false, the camera will not move
     * coordinates, but will still apply the other fields.
     * @param panTimed If set to true, then it will change the camera's properties over the times specified in `CameraSetup.setField`.
     */
    public apply(doPan: boolean, panTimed: boolean) {
        CameraSetupApply(this.handle, doPan, panTimed);
    }

    /**
     * Applies the camerasetup over a certain duration, altering the current camera's fields to match those of the camera setup.
     * @param doPan If set to true, it will move the current camera's target coordinates to the
     * camera setup's target coordinates. If false, the camera will not move
     * coordinates, but will still apply the other fields.
     * @param forceDuration The duration it will take to apply all the camera fields. It will ignore the times set by `CameraSetup.setField`.
     */
    public applyForceDuration(doPan: boolean, forceDuration: number) {
        CameraSetupApplyForceDuration(this.handle, doPan, forceDuration);
    }

    /**
     *
     * @param doPan If set to true, it will move the current camera's target coordinates to the
     * camera setup's target coordinates. If false, the camera will not move
     * coordinates, but will still apply the other fields.
     * @param forcedDuration The duration it will take to apply all the camera fields. It will ignore the times set by `CameraSetup.setField`.
     * @param easeInDuration
     * @param easeOutDuration
     * @param smoothFactor
     */
    public applyForceDurationSmooth(
        doPan: boolean,
        forcedDuration: number,
        easeInDuration: number,
        easeOutDuration: number,
        smoothFactor: number
    ) {
        BlzCameraSetupApplyForceDurationSmooth(
            this.handle,
            doPan,
            forcedDuration,
            easeInDuration,
            easeOutDuration,
            smoothFactor
        );
    }

    /**
     * Applies the CameraSetup over a certain duration with a custom z-offset value,
     * altering the current camera's fields to match those of the camera setup.
     * The z-offset input will override the z-offset specified by `CameraSetup.setField`.
     * @param zDestOffset The camera's z-offset will gradually change to this value over the specified duration.
     * @param forceDuration The duration it will take to apply all the camera fields. It will ignore the times set by `CameraSetup.setField`.
     */
    public applyForceDurationZ(zDestOffset: number, forceDuration: number) {
        CameraSetupApplyForceDurationWithZ(this.handle, zDestOffset, forceDuration);
    }

    /**
     * Applies the CameraSetup with a custom z-offset, altering the current camera's
     * fields to match those of the camera setup. The z-offset input will override
     * the z-offset specified by the CameraSetup through `CameraSetup.setField`.
     * @param zDestOffset The camera's z-offset will gradually change to this value over the specified duration.
     * @bug If a player pauses the game after the CameraSetup has been applied, the z-offset of the game camera will change to the z-offset of the CameraSetup for that player.
     */
    public applyZ(zDestOffset: number) {
        CameraSetupApplyWithZ(this.handle, zDestOffset);
    }

    /**
     * Returns the value of the specified field for a CameraSetup. The angle of attack,
     * field of view, roll, and rotation are all returned in degrees, unlike `Camera.getField`.
     * @param whichField The field of the CameraSetup.
     * @note The angle of attack, field of view, roll, and rotation are all returned in degrees.
     */
    public getField(whichField: camerafield) {
        return CameraSetupGetField(this.handle, whichField);
    }

    /**
     * Sets the target coordinates for a CameraSetup over a duration. The coordinate
     * change will only be applied when `CameraSetup.apply` (or some other variant) is ran.
     * @param x The target x-coordinate.
     * @param y The target y-coordinate.
     * @param duration The coordinates will be applied over this duration once the camera setup is applied.
     */
    public setDestPos(x: number, y: number, duration: number) {
        CameraSetupSetDestPosition(this.handle, x, y, duration);
    }

    /**
     * Assigns a value to the specified field for a CameraSetup. The input angles should be in degrees.
     * @param whichField The field of the CameraSetup.
     * @param value The value to assign to the field.
     * @param duration The duration over which the field will be set. If the duration is greater than 0, the changes will be made gradually once the camera setup is applied.
     */
    public setField(whichField: camerafield, value: number, duration: number) {
        CameraSetupSetField(this.handle, whichField, value, duration);
    }
}
