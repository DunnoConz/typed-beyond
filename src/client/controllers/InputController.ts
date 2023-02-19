import { Controller } from "@flamework/core";
import { UserInputService } from "@rbxts/services";
import { CharacterController } from "./CharacterController";

function drip() {
	print("HI!");
}

@Controller()
export class InputController {
	constructor(private character: CharacterController) {
		print("Input CONTROLLER :: STARTED!");

		const lazyKeys = new Map<Enum.KeyCode, number>();
		lazyKeys.set(Enum.KeyCode.One, 0);
		lazyKeys.set(Enum.KeyCode.Two, 1);
		lazyKeys.set(Enum.KeyCode.Three, 2);
		lazyKeys.set(Enum.KeyCode.Four, 3);
		lazyKeys.set(Enum.KeyCode.Five, 4);
		lazyKeys.set(Enum.KeyCode.Six, 5);
		lazyKeys.set(Enum.KeyCode.Seven, 6);
		lazyKeys.set(Enum.KeyCode.Eight, 7);
		lazyKeys.set(Enum.KeyCode.Nine, 8);

		UserInputService.InputBegan.Connect((input, processed) => {
			if (!processed) {
				const numCheck = lazyKeys.get(input.KeyCode);

				if (numCheck !== undefined) {
					character.equip(numCheck);
				}
			}
		});
	}
}
