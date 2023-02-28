export enum OverrideStates { // PRIORITY 1 STATES [OVERRIDES PRIORITY 2 AND 3]
	DOWNED = 3,
	STAGGERED = 2,
	PARRIED = 1,
	NOOVERRIDE = 0,
}

export enum ActiveStates { // PRIORITY 2 STATES [OVERRIDES PRIORITY 3]
	PARRYING = 3,
	BLOCKING = 2,
	ATTACKING = 1,
	NOACTIVE = 0,
}

export enum MovementStates { // PRIORITY 3 STATES
	DASHING = 3,
	RUNNING = 2,
	WALKING = 1,
	NOMOVEMENT = 0,
}

export enum StateType {
	OverrideStates = 2,
	ActiveStates = 1,
	MovementStates = 0,
}

export const StateString = [
	["NOMOVEMENT", "WALKING", "RUNNING", "DASHING"], // 0
	["NOACTIVE", "ATTACKING", "BLOCKING", "PARRYING"], // 1
	["NOOVERRIDE", "PARRIED", "STAGGERED", "DOWNED"], // 2
];

export function getEnumName(stateType: number, state: number) {
	return StateString[stateType][state];
}

export enum ItemType {
	ABILITY = 2,
	WEAPONARY = 1,
	ITEM = 0,
}

export type Item = {
	ItemId: number;
	ItemType: ItemType;
	ItemStack: 1;
	ItemInfo: object[];
};

export interface ICharacterData {
	Name: string;
	Age: number; // tick
	Credits: number;
	Inventory: Map<number, object>;
}

export interface ISlotData {
	CharacterCount: number;
	LifeCount: number;
	NewCharacter: boolean;
}

export interface IPlayerData {
	SlotData: Map<number, ISlotData>; // slot: number, slotData: ISlotData  UserId:Slot:Character:Life 888888888:1:2:3
	UnlockedClasses: Map<string, boolean>;
}
