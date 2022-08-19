import type Destructable from "../handles/destructable";
import type Item from "../handles/item";
import type Unit from "../handles/unit";

export type AnyWidget = Destructable | Unit | Item;

export default AnyWidget;
