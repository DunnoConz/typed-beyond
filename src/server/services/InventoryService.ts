import { Dependency, Service } from "@flamework/core";
import { DataManagerService } from "./DataManager";
import { Players } from "@rbxts/services";
import { getPreset, Item } from "shared/typings";

@Service()
export class InventoryService {
	equip() {
		print("Equip");
	}

	unequip() {
		print("Unequip");
	}

	constructor() {
		print("Inventory Service :: Started!");

		const DataManager = Dependency(DataManagerService);

		Players.PlayerAdded.Connect((player) => {
			wait(5); // wait for replica
			const replica = DataManager.getReplica(player.UserId);
			if (replica) {
				replica.ArrayInsert("Inventory", getPreset(1));
			}
		});
	}
}
