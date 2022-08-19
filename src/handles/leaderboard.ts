import Handle, { IDestroyable } from "./handle";
import MapPlayer from "./player";

export default class Leaderboard extends Handle implements IDestroyable {
    protected static override map: WeakMap<leaderboard, Leaderboard>;
    public declare readonly handle: leaderboard;

    public constructor() {
        if (Leaderboard.initHandle) {
            super(Leaderboard.initHandle);
            return;
        }

        const handle = CreateLeaderboard();
        if (handle) {
            super(handle);
            Leaderboard.map.set(handle, this);
            return;
        }

        error(`Failed to create leaderboard handle.`, 3);
    }

    public override isValid(): this is Leaderboard {
        //TODO: test if this works
        return GetHandleId(this.handle) !== -1;
    }

    public destroy() {
        DestroyLeaderboard(this.handle);
        Leaderboard.map.delete(this.handle);
    }

    public static fromPlayer(whichPlayer: MapPlayer) {
        return this.fromHandle(PlayerGetLeaderboard(whichPlayer.handle));
    }

    public static fromHandle(handle?: leaderboard) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: leaderboard) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new (Leaderboard as any)() as Leaderboard;
        this.initHandle = undefined;

        return o;
    }
}
