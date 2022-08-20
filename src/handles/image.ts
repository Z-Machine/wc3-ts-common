import Handle, { IDestroyable } from "./handle";

export const enum ImageType {
    /**
     * Drawn above all other imageTypes.
     */
    Selection = 1,
    /**
     *  Drawn above Ubersplat, but below Selection and OcclusionMask.
     */
    Indicator = 2,
    /**
     * Drawn above Ubersplat and Indicator and below Selection.
     */
    OcclusionMask = 3,
    /**
     * Drawn below every other type. Images of this type are additionally affected by time of day and the fog of war (only for tinting).
     */
    Ubersplat = 4,
}

export default class Image extends Handle implements IDestroyable {
    protected static override map: WeakMap<image, Image>;
    public declare readonly handle: image;

    /**
     * Creates a new image, the first ID given being 0 and then counting upwards (0, 1, 2, 3, ...).
     * Multiple images with the same type are drawn in their order of creation,
     * meaning that the image created first is drawn below the image created after.
     * @param file The path to the image. The image itself should have its border alpha-ed out
     * completely. If an invalid path is specified CreateImage returns image(-1).
     * @param sizeX The x-dimensions of the image.
     * @param sizeY The y-dimensions of the image.
     * @param sizeZ The z-dimensions of the image.
     * @param posX The x-cooridnate of where to create the image. This is the bottom left corner of the image.
     * @param posY The y-cooridnate of where to create the image. This is the bottom left corner of the image.
     * @param posZ The z-cooridnate of where to create the image.
     * @param originX Moves the origin (bottom left corner) of the image from posX in negative X-direction.
     * @param originY Moves the origin (bottom left corner) of the image from posY in negative Y-direction.
     * @param originZ Moves the origin (bottom left corner) of the image from posZ in negative Z-direction.
     * @param imageType @see ImageType
     */
    public constructor(
        file: string,
        sizeX: number,
        sizeY: number,
        sizeZ: number,
        posX: number,
        posY: number,
        posZ: number,
        originX: number,
        originY: number,
        originZ: number,
        imageType: ImageType
    ) {
        if (Image.initHandle) {
            super(Image.initHandle);
            return;
        }

        if (
            file === undefined ||
            sizeX === undefined ||
            sizeY === undefined ||
            sizeZ === undefined ||
            posX === undefined ||
            posY === undefined ||
            posZ === undefined ||
            originX === undefined ||
            originY === undefined ||
            originZ === undefined ||
            imageType === undefined
        ) {
            error(`Image.Constructor missing required parameters.`, 3);
        }

        const handle = CreateImage(file, sizeX, sizeY, sizeZ, posX, posY, posZ, originX, originY, originZ, imageType);
        if (handle) {
            super(handle);
            Image.map.set(handle, this);
            return;
        }

        error(`Failed to create image handle.`, 3);
    }

    public override isValid(): this is Image {
        //TODO: test if this works
        return GetHandleId(this.handle) !== -1;
    }

    /**
     * Destroys the image specified and recycles the handle ID of that image instantly (no ref counting for images).
     * @bug May crash the game if an invalid image is used (null, before the first image is created).
     */
    public destroy() {
        DestroyImage(this.handle);
        Image.map.delete(this.handle);
    }

    public static fromHandle(handle?: image) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: image) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new (Image as any)() as Image;
        this.initHandle = undefined;

        return o;
    }
}
