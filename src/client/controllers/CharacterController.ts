import { Controller } from "@flamework/core";

@Controller()
export class CharacterController {
	equip(slot: number) {
		print("AAA");
		print("equiping " + (slot + 1));
	}

	unequip() {
		print("unequip");
	}

	constructor() {
		print("CHARACTER CONTROLLER :: STARTED!");
	}
}
