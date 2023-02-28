import { UserInputService } from "@rbxts/services";

function equip(slot: number) {
	print("equip", slot + 1);
}

function attack() {
	print("ouch!");
}

function NULL() {
	return;
}

const KeybindInfo = new Map<string, Enum.KeyCode>([
	["Slot_1", Enum.KeyCode.One],
	["Slot_2", Enum.KeyCode.Two],
	["Slot_3", Enum.KeyCode.Three],
	["Slot_4", Enum.KeyCode.Four],
	["Slot_5", Enum.KeyCode.Five],
	["Slot_6", Enum.KeyCode.Six],
	["Slot_7", Enum.KeyCode.Seven],
	["Slot_8", Enum.KeyCode.Eight],
	["Slot_9", Enum.KeyCode.Nine],
	["Dodge", Enum.KeyCode.Q],
	["Crouch", Enum.KeyCode.C],
]);

const Keybinds = new Map<Enum.KeyCode | Enum.UserInputType, () => void>([
	[KeybindInfo.get("Slot_1") || Enum.KeyCode.One, () => equip(0)],
	[KeybindInfo.get("Slot_2") || Enum.KeyCode.Two, () => equip(1)],
	[KeybindInfo.get("Slot_3") || Enum.KeyCode.Three, () => equip(2)],
	[KeybindInfo.get("Slot_4") || Enum.KeyCode.Four, () => equip(3)],
	[KeybindInfo.get("Slot_5") || Enum.KeyCode.Five, () => equip(4)],
	[KeybindInfo.get("Slot_6") || Enum.KeyCode.Six, () => equip(5)],
	[KeybindInfo.get("Slot_7") || Enum.KeyCode.Seven, () => equip(6)],
	[KeybindInfo.get("Slot_8") || Enum.KeyCode.Eight, () => equip(7)],
	[KeybindInfo.get("Slot_9") || Enum.KeyCode.Nine, () => equip(8)],
	[Enum.UserInputType.MouseButton1, () => attack()],
]);

class _BindController {
	ChangeKeybind(keybindId: string, newKeybind: Enum.KeyCode): boolean {
		const old_keybind = KeybindInfo.get(keybindId);
		if (old_keybind) {
			const old_func = Keybinds.get(old_keybind);

			KeybindInfo.set(keybindId, newKeybind);
			Keybinds.delete(old_keybind);

			const new_keybind = KeybindInfo.get(keybindId);

			if (new_keybind && old_func) {
				Keybinds.set(new_keybind, old_func);
				return true; // completes rebind
			}

			return false; // doesn't complete for some reason
		}

		return false; // binding to an action that doesn't exist
	}

	constructor() {
		print("BIND CONTROLLER STARTED!");

		UserInputService.InputBegan.Connect((input, processed) => {
			if (!processed) {
				let key;

				// checks if it is a keypress
				if (input.UserInputType === Enum.UserInputType.Keyboard) {
					key = Keybinds.get(input.KeyCode);
				} else {
					key = Keybinds.get(input.UserInputType);
				}

				if (key) {
					key();
				}
			}
		});

		task.wait(3);

		print(this.ChangeKeybind("Slot_1", Enum.KeyCode.P), "CHANGE FLAG");
	}
}

const BindController = new _BindController();

export = BindController;
