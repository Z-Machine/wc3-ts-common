import Ability from "./ability";
import { IDestroyable } from "./handle";
import MapPlayer from "./player";
import type Point from "./point";
import Widget from "./widget";

export default class Item extends Widget implements IDestroyable {
    protected static override map: WeakMap<item, Item>;
    public declare readonly handle: item;

    public constructor(itemId: number, x: number, y: number, skinId?: number) {
        if (Item.initHandle) {
            super(Item.initHandle);
            return;
        }

        if (itemId === undefined || x === undefined || y === undefined) {
            error(`Item.Constructor missing required parameters.`, 3);
        }

        const handle = skinId === undefined ? CreateItem(itemId, x, y) : BlzCreateItemWithSkin(itemId, x, y, skinId);
        if (handle !== undefined) {
            super(handle);
            Item.map.set(handle, this);
            return;
        }

        error(`Failed to create item handle.`, 3);
    }

    // TODO: Check if this works.
    public override isValid(): this is Item {
        return GetItemTypeId(this.handle) !== 0;
    }

    public destroy(): void {
        Item.map.delete(this.handle);
        RemoveItem(this.handle);
    }

    public kill() {
        SetWidgetLife(this.handle, 0);
    }

    public get name() {
        return GetItemName(this.handle) ?? "";
    }

    public set name(v: string) {
        BlzSetItemName(this.handle, v);
    }

    public get charges() {
        return GetItemCharges(this.handle);
    }

    public set charges(v: number) {
        SetItemCharges(this.handle, v);
    }

    public set invulnerable(b: boolean) {
        SetItemInvulnerable(this.handle, b);
    }

    public get invulnerable() {
        return IsItemInvulnerable(this.handle);
    }

    public get level() {
        return GetItemLevel(this.handle);
    }

    public set level(v: number) {
        BlzSetItemIntegerField(this.handle, ITEM_IF_LEVEL, v);
    }

    /**
     * @async
     */
    get description() {
        return BlzGetItemDescription(this.handle) ?? "";
    }

    set description(description: string) {
        BlzSetItemDescription(this.handle, description);
    }

    /**
     * @async
     */
    get extendedTooltip() {
        return BlzGetItemExtendedTooltip(this.handle) ?? "";
    }

    set extendedTooltip(tooltip: string) {
        BlzSetItemExtendedTooltip(this.handle, tooltip);
    }

    /**
     * @async
     */
    get icon() {
        return BlzGetItemIconPath(this.handle) ?? "";
    }

    set icon(path: string) {
        BlzSetItemIconPath(this.handle, path);
    }

    /**
     * @async
     */
    get tooltip() {
        return BlzGetItemTooltip(this.handle) ?? "";
    }

    set tooltip(tooltip: string) {
        BlzSetItemTooltip(this.handle, tooltip);
    }

    public get pawnable() {
        return IsItemPawnable(this.handle);
    }

    public set pawnable(flag: boolean) {
        SetItemPawnable(this.handle, flag);
    }

    public get sellable() {
        return IsItemSellable(this.handle);
    }

    public get powerup() {
        return IsItemPowerup(this.handle);
    }

    public set powerup(b: boolean) {
        BlzSetItemBooleanField(this.handle, ITEM_BF_USE_AUTOMATICALLY_WHEN_ACQUIRED, b);
    }

    public get player() {
        return GetItemPlayer(this.handle);
    }

    public get type() {
        return GetItemType(this.handle);
    }

    public get typeId() {
        return GetItemTypeId(this.handle);
    }

    public get userData() {
        return GetItemUserData(this.handle);
    }

    public set userData(v: number) {
        SetItemUserData(this.handle, v);
    }

    public get visible() {
        return IsItemVisible(this.handle);
    }

    public set visible(b: boolean) {
        SetItemVisible(this.handle, b);
    }

    public get skin() {
        return BlzGetItemSkin(this.handle);
    }

    public set skin(v: number) {
        BlzSetItemSkin(this.handle, v);
    }

    public override get x() {
        return GetItemX(this.handle);
    }

    public override set x(v: number) {
        SetItemPosition(this.handle, v, this.y);
    }

    public override get y() {
        return GetItemY(this.handle);
    }

    public override set y(v: number) {
        SetItemPosition(this.handle, this.x, v);
    }

    public isOwned() {
        return IsItemOwned(this.handle);
    }

    public setDropId(unitId: number) {
        SetItemDropID(this.handle, unitId);
    }

    public setDropOnDeath(flag: boolean) {
        SetItemDropOnDeath(this.handle, flag);
    }

    public setDroppable(flag: boolean) {
        SetItemDroppable(this.handle, flag);
    }

    public getOwner() {
        return MapPlayer.fromHandle(GetItemPlayer(this.handle));
    }

    public setOwner(whichPlayer: MapPlayer, changeColor: boolean = true) {
        SetItemPlayer(this.handle, whichPlayer.handle, changeColor);
    }

    public setPoint(whichPoint: Point) {
        SetItemPosition(this.handle, whichPoint.x, whichPoint.y);
    }

    public setPosition(x: number, y: number) {
        SetItemPosition(this.handle, x, y);
    }

    //#region Ability spam

    public addAbility(abilCode: number) {
        return BlzItemAddAbility(this.handle, abilCode);
    }

    public getAbility(abilCode: number) {
        return Ability.fromItem(this, abilCode);
    }

    public getAbilityByIndex(index: number) {
        return Ability.fromItemIndex(this, index);
    }

    public removeAbility(abilCode: number) {
        return BlzItemRemoveAbility(this.handle, abilCode);
    }

    //#endregion Ability spam
    //#region Field spam

    public getBoolean(whichField: itembooleanfield) {
        return BlzGetItemBooleanField(this.handle, whichField);
    }

    public getInteger(whichField: itemintegerfield) {
        return BlzGetItemIntegerField(this.handle, whichField);
    }

    public getNumber(whichField: itemrealfield) {
        return BlzGetItemRealField(this.handle, whichField);
    }

    public getString(whichField: itemstringfield) {
        return BlzGetItemStringField(this.handle, whichField) ?? "";
    }

    public setBoolean(whichField: itembooleanfield, value: boolean) {
        BlzSetItemBooleanField(this.handle, whichField, value);
    }

    public setInteger(whichField: itemintegerfield, value: number) {
        BlzSetItemIntegerField(this.handle, whichField, value);
    }

    public setNumber(whichField: itemrealfield, value: number) {
        BlzSetItemRealField(this.handle, whichField, value);
    }

    public setString(whichField: itemstringfield, value: string) {
        BlzSetItemStringField(this.handle, whichField, value);
    }

    //#endregion Field spam

    public static isPawnable(itemId: number) {
        return IsItemIdPawnable(itemId);
    }

    public static isPowerup(itemId: number) {
        return IsItemIdPowerup(itemId);
    }

    public static isSellable(itemId: number) {
        return IsItemIdSellable(itemId);
    }

    public static fromEvent() {
        return this.fromHandle(GetManipulatedItem());
    }

    public static fromFilter() {
        return this.fromHandle(GetFilterItem());
    }

    public static fromHandle(handle?: item) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: item) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new (Item as any)() as Item;
        this.initHandle = undefined;

        return o;
    }
}
