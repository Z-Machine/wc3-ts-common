import Handle from "./handle";
import type Item from "./item";
import type Unit from "./unit";

export default class Ability extends Handle {
    protected static override map: WeakMap<ability, Ability>;
    public declare readonly handle: ability;

    /** @note use static getters instead. */
    protected constructor() {
        if (Ability.initHandle) {
            super(Ability.initHandle);
            Ability.map.set(this.handle, this);
            return;
        }

        error(`Failed to create Ability handle.`, 3);
    }

    public override isValid(): this is Ability {
        return BlzGetAbilityId(this.handle) !== 0;
    }

    public get typeId() {
        return BlzGetAbilityId(this.handle);
    }

    public get name() {
        return this.getString(ABILITY_SF_NAME);
    }

    public set name(v: string) {
        this.setString(ABILITY_SF_NAME, v);
    }

    //#region Field spam

    public getBoolean(whichField: abilitybooleanfield) {
        return BlzGetAbilityBooleanField(this.handle, whichField);
    }

    public getBooleanLevel(whichField: abilitybooleanlevelfield, level: number) {
        return BlzGetAbilityBooleanLevelField(this.handle, whichField, level);
    }

    public getBooleanLevelArray(whichField: abilitybooleanlevelarrayfield, level: number, index: number) {
        return BlzGetAbilityBooleanLevelArrayField(this.handle, whichField, level, index);
    }

    public setBoolean(whichField: abilitybooleanfield, value: boolean) {
        BlzSetAbilityBooleanField(this.handle, whichField, value);
    }

    public setBooleanLevel(whichField: abilitybooleanlevelfield, level: number, value: boolean) {
        BlzSetAbilityBooleanLevelField(this.handle, whichField, level, value);
    }

    public setBooleanLevelArray(
        whichField: abilitybooleanlevelarrayfield,
        level: number,
        index: number,
        value: boolean
    ) {
        BlzSetAbilityBooleanLevelArrayField(this.handle, whichField, level, index, value);
    }

    public getInteger(whichField: abilityintegerfield) {
        return BlzGetAbilityIntegerField(this.handle, whichField);
    }

    public getIntegerLevel(whichField: abilityintegerlevelfield, level: number) {
        return BlzGetAbilityIntegerLevelField(this.handle, whichField, level);
    }

    public getIntegerLevelArray(whichField: abilityintegerlevelarrayfield, level: number, index: number) {
        return BlzGetAbilityIntegerLevelArrayField(this.handle, whichField, level, index);
    }

    public setInteger(whichField: abilityintegerfield, value: number) {
        BlzSetAbilityIntegerField(this.handle, whichField, value);
    }

    public setIntegerLevel(whichField: abilityintegerlevelfield, level: number, value: number) {
        BlzSetAbilityIntegerLevelField(this.handle, whichField, level, value);
    }

    public setIntegerLevelArray(
        whichField: abilityintegerlevelarrayfield,
        level: number,
        index: number,
        value: number
    ) {
        BlzSetAbilityIntegerLevelArrayField(this.handle, whichField, level, index, value);
    }

    public getNumber(whichField: abilityrealfield) {
        return BlzGetAbilityRealField(this.handle, whichField);
    }

    public getNumberLevel(whichField: abilityreallevelfield, level: number) {
        return BlzGetAbilityRealLevelField(this.handle, whichField, level);
    }

    public getNumberLevelArray(whichField: abilityreallevelarrayfield, level: number, index: number) {
        return BlzGetAbilityRealLevelArrayField(this.handle, whichField, level, index);
    }

    public setNumber(whichField: abilityrealfield, value: number) {
        BlzSetAbilityRealField(this.handle, whichField, value);
    }

    public setNumberLevel(whichField: abilityreallevelfield, level: number, value: number) {
        BlzSetAbilityRealLevelField(this.handle, whichField, level, value);
    }

    public setNumberLevelArray(whichField: abilityreallevelarrayfield, level: number, index: number, value: number) {
        BlzSetAbilityRealLevelArrayField(this.handle, whichField, level, index, value);
    }

    public getString(whichField: abilitystringfield) {
        return BlzGetAbilityStringField(this.handle, whichField) ?? "";
    }

    public getStringLevel(whichField: abilitystringlevelfield, level: number) {
        return BlzGetAbilityStringLevelField(this.handle, whichField, level) ?? "";
    }

    public getStringLevelArray(whichField: abilitystringlevelarrayfield, level: number, index: number) {
        return BlzGetAbilityStringLevelArrayField(this.handle, whichField, level, index) ?? "";
    }

    public setString(whichField: abilitystringfield, value: string) {
        BlzSetAbilityStringField(this.handle, whichField, value);
    }

    public setStringLevel(whichField: abilitystringlevelfield, level: number, value: string) {
        BlzSetAbilityStringLevelField(this.handle, whichField, level, value);
    }

    public setStringLevelArray(whichField: abilitystringlevelarrayfield, level: number, index: number, value: string) {
        BlzSetAbilityStringLevelArrayField(this.handle, whichField, level, index, value);
    }

    //#endregion Field spam

    public static fromEvent() {
        return this.fromHandle(GetSpellAbility());
    }

    public static fromUnitIndex(whichUnit: Unit, index: number) {
        return this.fromHandle(BlzGetUnitAbilityByIndex(whichUnit.handle, index));
    }

    public static fromUnit(whichUnit: Unit, abilId: number) {
        return this.fromHandle(BlzGetUnitAbility(whichUnit.handle, abilId));
    }

    public static fromItemIndex(whichItem: Item, index: number) {
        return this.fromHandle(BlzGetItemAbility(whichItem.handle, index));
    }

    public static fromItem(whichItem: Item, abilId: number) {
        return this.fromHandle(BlzGetItemAbility(whichItem.handle, abilId));
    }

    public static fromHandle(handle?: ability) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: ability) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new (Ability as any)() as Ability;
        this.initHandle = undefined;

        return o;
    }
}
