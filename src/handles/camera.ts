import Point from "./point";

export default class Camera {
    protected constructor() {}

    public static set visible(flag: boolean) {
        DisplayCineFilter(flag);
    }

    public static get visible() {
        return IsCineFilterDisplayed();
    }

    /**
     * Return-value for the local players camera only.
     */
    public static get boundMinX() {
        return GetCameraBoundMinX();
    }

    /**
     * Return-value for the local players camera only.
     */
    public static get boundMinY() {
        return GetCameraBoundMinY();
    }

    /**
     * Return-value for the local players camera only.
     */
    public static get boundMaxX() {
        return GetCameraBoundMaxX();
    }

    public static get boundMaxY() {
        return GetCameraBoundMaxY();
    }

    /**
     * Return-value for the local players camera only.
     */
    public static get targetX() {
        return GetCameraTargetPositionX();
    }

    /**
     * Return-value for the local players camera only.
     */
    public static get targetY() {
        return GetCameraTargetPositionY();
    }

    /**
     * Return-value for the local players camera only.
     */
    public static get targetZ() {
        return GetCameraTargetPositionZ();
    }

    /**
     * Return-value for the local players camera only.
     */
    public static get eyeX() {
        return GetCameraEyePositionX();
    }

    /**
     * Return-value for the local players camera only.
     */
    public static get eyeY() {
        return GetCameraEyePositionY();
    }

    /**
     * Return-value for the local players camera only.
     */
    public static get eyeZ() {
        return GetCameraEyePositionZ();
    }

    /**
     * Return-value for the local players camera only.
     */
    public static get eyePoint() {
        return Point.fromHandle(GetCameraEyePositionLoc());
    }

    /**
     * Return-value for the local players camera only.
     */
    public static get targetPoint() {
        return Point.fromHandle(GetCameraTargetPositionLoc());
    }

    /**
     * Changes one of the game camera's options whichField by offset over duration seconds.
     * @param whichField
     * @param offset
     * @param duration
     */
    public static adjustField(whichField: camerafield, offset: number, duration: number) {
        AdjustCameraField(whichField, offset, duration);
    }

    public static endCinematicScene() {
        EndCinematicScene();
    }

    public static forceCinematicSubtitles(flag: boolean) {
        ForceCinematicSubtitles(flag);
    }

    /**
     * Return-value for the local players camera only.
     */
    public static getField(field: camerafield) {
        return GetCameraField(field);
    }

    public static getMargin(whichMargin: number) {
        return GetCameraMargin(whichMargin);
    }

    public static pan(x: number, y: number, zOffsetDest: number | undefined) {
        if (zOffsetDest === undefined) {
            PanCameraTo(x, y);
        } else {
            PanCameraToWithZ(x, y, zOffsetDest);
        }
    }

    public static panTimed(x: number, y: number, duration: number, zOffsetDest: number | undefined) {
        if (zOffsetDest === undefined) {
            PanCameraToTimed(x, y, duration);
        } else {
            PanCameraToTimedWithZ(x, y, zOffsetDest, duration);
        }
    }

    public static reset(duration: number) {
        ResetToGameCamera(duration);
    }

    public static setBounds(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        x3: number,
        y3: number,
        x4: number,
        y4: number
    ) {
        SetCameraBounds(x1, y1, x2, y2, x3, y3, x4, y4);
    }

    public static setCameraOrientController(whichUnit: unit, xOffset: number, yOffset: number) {
        SetCameraOrientController(whichUnit, xOffset, yOffset);
    }

    public static setCineFilterBlendMode(whichMode: blendmode) {
        SetCineFilterBlendMode(whichMode);
    }

    public static setCineFilterDuration(duration: number) {
        SetCineFilterDuration(duration);
    }

    public static setCineFilterEndColor(red: number, green: number, blue: number, alpha: number) {
        SetCineFilterEndColor(red, green, blue, alpha);
    }

    public static setCineFilterEndUV(minU: number, minV: number, maxU: number, maxV: number) {
        SetCineFilterEndUV(minU, minV, maxU, maxV);
    }

    public static setCineFilterStartColor(red: number, green: number, blue: number, alpha: number) {
        SetCineFilterStartColor(red, green, blue, alpha);
    }

    public static setCineFilterStartUV(minU: number, minV: number, maxU: number, maxV: number) {
        SetCineFilterStartUV(minU, minV, maxU, maxV);
    }

    public static setCineFilterTexMapFlags(whichFlags: texmapflags) {
        SetCineFilterTexMapFlags(whichFlags);
    }

    public static setCineFilterTexture(fileName: string) {
        SetCineFilterTexture(fileName);
    }

    public static setCinematicAudio(cinematicAudio: boolean) {
        SetCinematicAudio(cinematicAudio);
    }

    public static setCinematicCamera(cameraModelFile: string) {
        SetCinematicCamera(cameraModelFile);
    }

    public static SetCinematicScene(
        portraitUnitId: number,
        color: playercolor,
        speakerTitle: string,
        text: string,
        sceneDuration: number,
        voiceoverDuration: number
    ) {
        SetCinematicScene(portraitUnitId, color, speakerTitle, text, sceneDuration, voiceoverDuration);
    }

    public static setDepthOfFieldScale(scale: number) {
        CameraSetDepthOfFieldScale(scale);
    }

    public static setField(whichField: camerafield, value: number, duration: number) {
        SetCameraField(whichField, value, duration);
    }

    public static setFocalDistance(distance: number) {
        CameraSetFocalDistance(distance);
    }

    public static setPos(x: number, y: number) {
        SetCameraPosition(x, y);
    }

    public static setRotateMode(x: number, y: number, radiansToSweep: number, duration: number) {
        SetCameraRotateMode(x, y, radiansToSweep, duration);
    }

    public static setSmoothingFactor(factor: number) {
        CameraSetSmoothingFactor(factor);
    }

    public static setSourceNoise(mag: number, velocity: number, vertOnly = false) {
        CameraSetSourceNoiseEx(mag, velocity, vertOnly);
    }

    public static setTargetController(whichUnit: unit, xOffset: number, yOffset: number, inheritOrientation: boolean) {
        SetCameraTargetController(whichUnit, xOffset, yOffset, inheritOrientation);
    }

    public static setTargetNoise(mag: number, velocity: number, vertOnly = false) {
        CameraSetTargetNoiseEx(mag, velocity, vertOnly);
    }

    public static stop() {
        StopCamera();
    }
}
