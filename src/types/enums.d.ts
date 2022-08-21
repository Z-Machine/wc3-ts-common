/**
 * Seems like a good enough spot to just shove enums.
 */

/** @flags */
export const enum Move {
    Unknown = 0,
    Foot = 1 << 0,
    Fly = 1 << 1,
    Horse = 1 << 2,
    Hover = 1 << 3,
    Float = 1 << 4,
    Amphibious = 1 << 5,
    Unbuildable = 1 << 6,
}

/** @flags */
export const enum Target {
    /** No idea what this does but it could exist. */
    Unknown = 0,
    None = 1 << 0,
    Ground = 1 << 1,
    Air = 1 << 2,
    Structure = 1 << 3,
    Ward = 1 << 4,
    Item = 1 << 5,
    Tree = 1 << 6,
    Wall = 1 << 7,
    Debris = 1 << 8,
    Decoration = 1 << 9,
    Bridge = 1 << 10,
}

export const enum Defense {
    Light = 0,
    Medium,
    Large = 2,
    Fortified,
    Normal,
    Hero,
    Divine,
    None,
}

export const enum Attribute {
    Strength = 1,
    Intelligence,
    Agility,
}

export const enum Armor {
    Unknown = 0,
    Flesh,
    Metal,
    Wood,
    Ethereal,
    Stone,
}

export const enum Regeneration {
    None = 0,
    Always,
    Blight,
    Day,
    Night,
}

/** @flags */
export const enum UnitCategory {
    /** No idea what this does but it could exist. */
    Unknown = 0,
    Giant = 1 << 0,
    Undead = 1 << 1,
    Summoned = 1 << 2,
    Mechanical = 1 << 3,
    Peon = 1 << 4,
    Sapper = 1 << 5,
    Townhall = 1 << 6,
    Ancient = 1 << 7,
    Neutral = 1 << 8,
    Ward = 1 << 9,
    Standon = 1 << 10,
    Tauren = 1 << 11,
}

/**
 * This is theoretically missing the new `UnitemPlacable` pathing flag.
 */
export const enum Pathing {
    Any = 0,
    Walkable,
    Flyable,
    Buildable,
    PeonHarvest,
    Blight,
    Floatable,
    Amphibious,
}

/**
 * Since this flag skips to `2` there are unregistered pathing flags
 * that might exist.
 * @flags
 */
export const enum PathingFlag {
    Unwalkable = 1 << 1,
    Unflyable = 1 << 2,
    Unbuildable = 1 << 3,
    Unpeonharvest = 1 << 4,
    Blighted = 1 << 5,
    Unfloatable = 1 << 6,
    Unamphibious = 1 << 7,
    Unitemplacable = 1 << 8,
}

export const enum Attack {
    Normal,
    Melee,
    Pierce,
    Siege,
    Magic,
    Chaos,
    Hero,
}

export const enum Damage {
    Unknown = 0,
    // ...
    Normal = 4,
    Enhanced,
    // ...
    Fire = 8,
    Cold,
    Lightning,
    Poison,
    Disease,
    Divine,
    Magic,
    Sonic,
    Acid,
    Force,
    Death,
    Mind,
    Plant,
    Defensive,
    Demolition,
    Slow_Poison,
    Spirit_Link,
    Shadow_Strike,
    Universal,
}
