import Handle from "./handle";
import type Item from "./item";
import type Unit from "./unit";

export default class Ability extends Handle {
    protected static override map: WeakMap<ability, Ability>;
    public declare readonly handle: ability;

    protected constructor(handle: ability) {
        if (Ability.initHandle) {
            super(Ability.initHandle);
            Ability.map.set(this.handle, this);
            return;
        }

        if (handle !== undefined) {
            super(handle);
            Ability.map.set(handle, this);
            return;
        }

        error(`Failed to create Ability handle.`, 3);
    }

    public override isValid(): this is Ability {
        return GetHandleId(this.handle) !== 0;
    }

    public get name() {
        return BlzGetAbilityStringField(this.handle, ABILITY_SF_NAME) ?? "";
    }

    public set name(v: string) {
        BlzSetAbilityStringField(this.handle, ABILITY_SF_NAME, v);
    }

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
