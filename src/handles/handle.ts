export interface IDestroyable {
    destroy(): void;
}

export default abstract class Handle {
    protected static map = new WeakMap<handle, Handle>();
    /** @internal Used internally to handle object creation when wrapping existing handles.*/
    protected static initHandle?: handle;

    protected constructor(public readonly handle: handle) {}

    /**
     * Get the unique ID of the handle. The ID is recycled once you destroy the object.
     * @returns The unique ID of a handle object.
     */
    public get id() {
        return GetHandleId(this.handle);
    }

    /**
     * Checks if the handle really exists.
     */
    public isValid(): this is Handle {
        return GetHandleId(this.handle) !== -1;
    }

    public static fromHandle(handle?: handle) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static getObject(handle: handle): Handle {
        throw `Implement this in subclasses.`;
    }
}
