import Handle from "./handle";

export default class Sound extends Handle {
    protected static override map: WeakMap<sound, Sound>;
    public declare readonly handle: sound;

    public constructor(
        fileName: string,
        looping: boolean,
        is3D: boolean,
        stopWhenOutOfRange: boolean,
        fadeInRate: number,
        fadeOutRate: number,
        eaxSetting: string
    ) {
        if (Sound.initHandle) {
            super(Sound.initHandle);
            Sound.map.set(this.handle, this);
            return;
        }

        if (
            fileName === undefined ||
            looping === undefined ||
            is3D === undefined ||
            stopWhenOutOfRange === undefined ||
            fadeInRate === undefined ||
            fadeOutRate === undefined ||
            eaxSetting === undefined
        ) {
            error(`Sound.Constructor missing required parameters.`, 3);
        }

        const handle = CreateSound(fileName, looping, is3D, stopWhenOutOfRange, fadeInRate, fadeOutRate, eaxSetting);
        if (handle !== undefined) {
            super(handle);
            Sound.map.set(handle, this);
            return;
        }

        error(`Failed to create Ability handle.`, 3);
    }

    public override isValid(): this is Sound {
        return GetHandleId(this.handle) !== -1;
    }

    public get dialogueSpeakerNameKey() {
        return GetDialogueSpeakerNameKey(this.handle) ?? "";
    }

    public set dialogueSpeakerNameKey(speakerName: string) {
        SetDialogueSpeakerNameKey(this.handle, speakerName);
    }

    public get dialogueTextKey() {
        return GetDialogueTextKey(this.handle) ?? "";
    }

    public set dialogueTextKey(dialogueText: string) {
        SetDialogueTextKey(this.handle, dialogueText);
    }

    public get duration() {
        return GetSoundDuration(this.handle);
    }

    public set duration(duration: number) {
        SetSoundDuration(this.handle, duration);
    }

    public get loading() {
        return GetSoundIsLoading(this.handle);
    }

    public get playing() {
        return GetSoundIsPlaying(this.handle);
    }

    public set playing(b: boolean) {
        b ? StartSound(this.handle) : StopSound(this.handle, false, true);
    }

    public killWhenDone() {
        KillSoundWhenDone(this.handle);
    }

    public registerStacked(byPosition: boolean, rectWidth: number, rectHeight: number) {
        RegisterStackedSound(this.handle, byPosition, rectWidth, rectHeight);
    }

    public unregisterStacked(byPosition: boolean, rectWidth: number, rectHeight: number) {
        UnregisterStackedSound(this.handle, byPosition, rectWidth, rectHeight);
    }

    public setChannel(channel: number) {
        SetSoundDistanceCutoff(this.handle, channel);
    }

    /**
     * @note This call is only valid if the sound was created with 3d enabled
     */
    public setConeAngles(inside: number, outside: number, outsideVolume: number) {
        SetSoundConeAngles(this.handle, inside, outside, outsideVolume);
    }

    /**
     * @note This call is only valid if the sound was created with 3d enabled
     */
    public setConeOrientation(x: number, y: number, z: number) {
        SetSoundConeOrientation(this.handle, x, y, z);
    }

    public setDistanceCutoff(cutoff: number) {
        SetSoundDistanceCutoff(this.handle, cutoff);
    }

    /**
     * @note This call is only valid if the sound was created with 3d enabled
     */
    public setDistances(minDist: number, maxDist: number) {
        SetSoundDistances(this.handle, minDist, maxDist);
    }

    public setFacialAnimationFilepath(animationSetFilepath: string) {
        SetSoundFacialAnimationSetFilepath(this.handle, animationSetFilepath);
    }

    public setFacialAnimationGroupLabel(groupLabel: string) {
        SetSoundFacialAnimationGroupLabel(this.handle, groupLabel);
    }

    public setFacialAnimationLabel(animationLabel: string) {
        SetSoundFacialAnimationLabel(this.handle, animationLabel);
    }

    /**
     * pplies default settings to the sound.
     * @param soundLabel The label out of one of the SLK-files, whose settings should be used, e.g. values like volume, pitch, pitch variance, priority, channel, min distance, max distance, distance cutoff or eax.
     */
    public setParamsFromLabel(soundLabel: string) {
        SetSoundParamsFromLabel(this.handle, soundLabel);
    }

    /**
     * Tones the pitch of the sound, default value is 1.
     * Increasing it you get the chipmunk version and the sound becomes shorter, when decremented the sound becomes low-pitched and longer.
     * @param pitch
     * @bug This native has very weird behaviour.
     * See [this](http://www.hiveworkshop.com/threads/setsoundpitch-weirdness.215743/#post-2145419) for an explanation
     * and [this](http://www.hiveworkshop.com/threads/snippet-rapidsound.258991/#post-2611724) for a non-bugged implementation.
     */
    public setPitch(pitch: number) {
        if (this.playing || this.loading) {
            SetSoundPitch(this.handle, 1 / this._lastPitch);
            SetSoundPitch(this.handle, pitch);
            this._lastPitch = pitch;
            return;
        }

        if (pitch === 1) pitch = 1.0001;

        SetSoundPitch(this.handle, pitch);
        this._lastPitch = pitch;
    }

    /** @internal */
    protected _lastPitch: number = 1;

    /**
     * Must be called immediately after starting the sound
     * @param millisecs
     */
    public setPlayPosition(millisecs: number) {
        SetSoundPlayPosition(this.handle, millisecs);
    }

    /**
     * @note This call is only valid if the sound was created with 3d enabled
     */
    public setPosition(x: number, y: number, z: number) {
        SetSoundPosition(this.handle, x, y, z);
    }

    /**
     * @note This call is only valid if the sound was created with 3d enabled
     */
    public setVelocity(x: number, y: number, z: number) {
        SetSoundVelocity(this.handle, x, y, z);
    }

    /**
     * Sets the sounds volume
     * @param volume Volume, between 0 and 127
     */
    public setVolume(volume: number) {
        SetSoundVolume(this.handle, volume);
    }

    /**
     * Starts the sound.
     * @note You can only play the same sound handle once.
     * @note You can only play 16 sounds in general.
     * @note Sounds of the same filepath (on different sound handles) must have a delay of at least 0.1 seconds inbetween them to be played.
     * You can overcome this by starting one earlier and then using `setPosition`.
     */
    public start() {
        StartSound(this.handle);
    }

    /**
     * Stops the sound.
     * @param killWhenDone The sound gets destroyed if true.
     * @param fadeOut Turns down the volume with `fadeOutRate` as stated in constructor.
     */
    public stop(killWhenDone: boolean, fadeOut: boolean) {
        StopSound(this.handle, killWhenDone, fadeOut);
    }

    public static getFileDuration(fileName: string) {
        return GetSoundFileDuration(fileName);
    }

    public static fromLabel(
        soundLabel: string,
        looping: boolean,
        is3D: boolean,
        stopWhenOutOfRange: boolean,
        fadeInRate: number,
        fadeOutRate: number
    ) {
        return this.fromHandle(
            CreateSoundFromLabel(soundLabel, looping, is3D, stopWhenOutOfRange, fadeInRate, fadeOutRate)
        );
    }

    public static fromSLK(
        fileName: string,
        looping: boolean,
        is3D: boolean,
        stopWhenOutOfRange: boolean,
        fadeInRate: number,
        fadeOutRate: number,
        SLKEntryName: string
    ) {
        return this.fromHandle(
            CreateSoundFilenameWithLabel(
                fileName,
                looping,
                is3D,
                stopWhenOutOfRange,
                fadeInRate,
                fadeOutRate,
                SLKEntryName
            )
        );
    }

    public static fromMIDI(soundLabel: string, fadeInRate: number, fadeOutRate: number) {
        return this.fromHandle(CreateMIDISound(soundLabel, fadeInRate, fadeOutRate));
    }

    public static fromHandle(handle?: sound) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: sound) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new (Sound as any)() as Sound;
        this.initHandle = undefined;

        return o;
    }
}
