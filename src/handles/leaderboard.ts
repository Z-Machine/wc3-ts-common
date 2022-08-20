import Handle, { IDestroyable } from "./handle";
import type MapPlayer from "./player";

export default class Leaderboard extends Handle implements IDestroyable {
    protected static override map: WeakMap<leaderboard, Leaderboard>;
    public declare readonly handle: leaderboard;

    public constructor() {
        if (Leaderboard.initHandle) {
            super(Leaderboard.initHandle);
            return;
        }

        const handle = CreateLeaderboard();
        if (handle !== undefined) {
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

    public clear() {
        LeaderboardClear(this.handle);
    }

    public addItem(label: string, value: number, whichPlayer: MapPlayer) {
        LeaderboardAddItem(this.handle, label, value, whichPlayer.handle);
    }

    public removeItem(index: number) {
        LeaderboardRemoveItem(this.handle, index);
    }

    public get display() {
        return IsLeaderboardDisplayed(this.handle);
    }

    public set display(b: boolean) {
        LeaderboardDisplay(this.handle, b);
    }

    public get itemCount() {
        return LeaderboardGetItemCount(this.handle);
    }

    public set itemCount(v: number) {
        LeaderboardSetSizeByItemCount(this.handle, v);
    }

    public get label() {
        return LeaderboardGetLabelText(this.handle) ?? "";
    }

    public set label(value: string) {
        LeaderboardSetLabel(this.handle, value);
    }

    public getPlayerIndex(whichPlayer: MapPlayer) {
        return LeaderboardGetPlayerIndex(this.handle, whichPlayer.handle);
    }

    public hasPlayerItem(whichPlayer: MapPlayer) {
        LeaderboardHasPlayerItem(this.handle, whichPlayer.handle);
    }

    public removePlayerItem(whichPlayer: MapPlayer) {
        LeaderboardRemovePlayerItem(this.handle, whichPlayer.handle);
    }

    public setItemLabel(whichItem: number, label: string) {
        LeaderboardSetItemLabel(this.handle, whichItem, label);
    }

    public setItemLabelColor(whichItem: number, red: number, green: number, blue: number, alpha: number) {
        LeaderboardSetItemLabelColor(this.handle, whichItem, red, green, blue, alpha);
    }

    public setItemStyle(whichItem: number, showLabel = true, showValues = true, showIcons = true) {
        LeaderboardSetItemStyle(this.handle, whichItem, showLabel, showValues, showIcons);
    }

    public setItemValue(whichItem: number, value: number) {
        LeaderboardSetItemValue(this.handle, whichItem, value);
    }

    public setItemValueColor(whichItem: number, red: number, green: number, blue: number, alpha: number) {
        LeaderboardSetItemValueColor(this.handle, whichItem, red, green, blue, alpha);
    }

    public setLabelColor(red: number, green: number, blue: number, alpha: number) {
        LeaderboardSetLabelColor(this.handle, red, green, blue, alpha);
    }

    public setPlayerBoard(whichPlayer: MapPlayer) {
        PlayerSetLeaderboard(whichPlayer.handle, this.handle);
    }

    public setStyle(showLabel = true, showNames = true, showValues = true, showIcons = true) {
        LeaderboardSetStyle(this.handle, showLabel, showNames, showValues, showIcons);
    }

    public setValueColor(red: number, green: number, blue: number, alpha: number) {
        LeaderboardSetValueColor(this.handle, red, green, blue, alpha);
    }

    public sortByLabel(ascending = true) {
        LeaderboardSortItemsByLabel(this.handle, ascending);
    }

    public sortByPlayer(ascending = true) {
        LeaderboardSortItemsByPlayer(this.handle, ascending);
    }

    public sortByValue(ascending = true) {
        LeaderboardSortItemsByValue(this.handle, ascending);
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
