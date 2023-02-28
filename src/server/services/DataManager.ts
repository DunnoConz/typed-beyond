import ProfileService from "@rbxts/profileservice";
import { Profile } from "@rbxts/profileservice/globals";
import { ReplicaService } from "@rbxts/replicaservice";
import { Players, TeleportService } from "@rbxts/services";
import { ICharacterData, IPlayerData, ISlotData } from "shared/typings";
import { CharacterDataReplica } from "../../../types/Replicas";

type CharacterProfileStorageType = Profile<ICharacterData>;
type PlayerProfileStorageType = Profile<IPlayerData>;

const defaultCharacterData: ICharacterData = {
	Name: "Hippy",
	Age: tick(),
	Credits: 1,
	Inventory: new Map<number, object>(),
};

const defaultPlayerData: IPlayerData = {
	SlotData: new Map<number, ISlotData>(),
	UnlockedClasses: new Map<string, boolean>(),
};

const customizing = new Map<number, boolean>();

export class DataManagerService {
	private character_profiles = new Map<number, CharacterProfileStorageType>();
	private player_profiles = new Map<number, PlayerProfileStorageType>();
	private character_replicas = new Map<number, CharacterDataReplica>();

	// player profile
	addPlayerProfile(UserId: number, profile: PlayerProfileStorageType) {
		this.player_profiles.set(UserId, profile);
	}
	removePlayerProfile(UserId: number) {
		this.player_profiles.delete(UserId);
	}
	getPlayerProfile(UserId: number): PlayerProfileStorageType | undefined {
		return this.player_profiles.get(UserId);
	}

	// character profile
	addCharacterProfile(UserId: number, profile: CharacterProfileStorageType) {
		this.character_profiles.set(UserId, profile);
	}
	removeCharacterProfile(UserId: number) {
		this.character_profiles.delete(UserId);
	}
	getCharacterProfile(UserId: number): CharacterProfileStorageType | undefined {
		return this.character_profiles.get(UserId);
	}

	// character replica
	addCharacterReplica(UserId: number, replica: CharacterDataReplica) {
		this.character_replicas.set(UserId, replica);
	}
	removeCharacterReplica(UserId: number) {
		this.character_replicas.delete(UserId);
	}
	getCharacterReplica(UserId: number): CharacterDataReplica | undefined {
		return this.character_replicas.get(UserId);
	}
}

const DataManager = new DataManagerService();
const CharacterProfileStore = ProfileService.GetProfileStore("CharacterStoreMOCK", defaultCharacterData);
const PlayerProfileStore = ProfileService.GetProfileStore("PlayerStoreMOCK", defaultPlayerData);

function onPlayerAdded(player: Player) {
	function onRelease() {
		DataManager.removePlayerProfile(player.UserId);

		if (DataManager.getCharacterProfile(player.UserId)) {
			// only runs if data exists
			DataManager.removeCharacterProfile(player.UserId);
			DataManager.removeCharacterReplica(player.UserId);
		}

		if (player.IsDescendantOf(Players)) {
			player.Kick("Your profile has been released!");
		}
	}

	const playerProfile = PlayerProfileStore.LoadProfileAsync(`Player_${player.UserId}`);

	if (playerProfile) {
		playerProfile.AddUserId(player.UserId);
		playerProfile.Reconcile();
		playerProfile.ListenToRelease(onRelease);

		if (player.IsDescendantOf(Players)) {
			DataManager.addPlayerProfile(player.UserId, playerProfile);
		} else {
			playerProfile.Release();
			return; // stops thread from going further
		}
	}

	const slot = 1; // temp

	if (!playerProfile?.Data.SlotData.get(slot)) {
		// might not work because not using profile service methods but see if auto update corrosponds with map
		playerProfile?.Data.SlotData.set(slot, { NewCharacter: true, CharacterCount: 1, LifeCount: 3 });
	}

	print(playerProfile);

	if (playerProfile?.Data.SlotData.get(slot)?.NewCharacter) {
		print("NOT FINISHED WITH CHARACTER CREATION!");
		// teleport to menu to create character ( USE TELEPORT DATA FOR SLOT ) -- ONLY CREATE CHARACTER DATA INSIDE OF MAIN SCREEN PLACE
		// teleport will auto release
		TeleportService.Teleport(12638597988, player, [true, slot]); // create teleport data { CreateCharacter: boolean, Slot: number }
		return;
	}

	// fire a remote to client that it is done loading

	const characterProfile = CharacterProfileStore.LoadProfileAsync(`${player.UserId}:1`);

	if (characterProfile) {
		characterProfile.AddUserId(player.UserId);
		characterProfile.Reconcile();
		characterProfile.ListenToRelease(onRelease);

		if (player.IsDescendantOf(Players)) {
			const characterDataReplica = ReplicaService.NewReplica({
				ClassToken: ReplicaService.NewClassToken("CharacterData"),
				Data: characterProfile.Data,
				Replication: player,
				Tags: { player: player },
			});

			characterDataReplica.SetValue("Credits", characterDataReplica.Data.Credits + 1);

			DataManager.addCharacterReplica(player.UserId, characterDataReplica);
			DataManager.addCharacterProfile(player.UserId, characterProfile);

			print(DataManager.getCharacterReplica(player.UserId));
		} else {
			characterProfile.Release();
		}
	}
}

function onPlayerRemoving(player: Player) {
	try {
		const profile = DataManager.getCharacterProfile(player.UserId);
		const replica = DataManager.getCharacterReplica(player.UserId);
		if (profile) {
			if (replica) {
				profile.Data = replica.Data;
			}

			profile.Release(); // will auto release player profile dw about adding it here
		} else {
			warn("profile not found during PlayerRemoving", player.UserId);
		}
	} catch (e) {
		warn(`Data warning: ${e}`);
	}
}

// for players currently in the game
Players.GetPlayers().forEach((player) => onPlayerAdded(player));
// for players who join in the future
Players.PlayerAdded.Connect(onPlayerAdded);
Players.PlayerRemoving.Connect(onPlayerRemoving);
