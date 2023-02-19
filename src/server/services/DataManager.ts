/* eslint-disable roblox-ts/no-any */
import ProfileService from "@rbxts/profileservice";
import { Profile } from "@rbxts/profileservice/globals";
import { ReplicaService } from "@rbxts/replicaservice";
import { Players } from "@rbxts/services";
import { ICharacterData, Item } from "shared/typings";
import { CharacterDataReplica } from "../../../types/Replicas";
import { Service } from "@flamework/core";

type ProfileStorageType = Profile<ICharacterData>;

const defaultData = {
	Name: "Hippy",
	Age: tick(),
	Credits: 1,
	Inventory: new Array<Item>(),
};

const _profiles = new Map<number, ProfileStorageType>();
const _replicas = new Map<number, CharacterDataReplica>();

@Service()
export class DataManagerService {
	addProfile(UserId: number, profile: ProfileStorageType) {
		_profiles.set(UserId, profile);
	}
	removeProfile(UserId: number) {
		_profiles.delete(UserId);
	}
	getProfile(UserId: number): ProfileStorageType | undefined {
		return _profiles.get(UserId);
	}
	addReplica(UserId: number, replica: CharacterDataReplica) {
		_replicas.set(UserId, replica);
	}
	removeReplica(UserId: number) {
		_replicas.delete(UserId);
	}
	getReplica(UserId: number): CharacterDataReplica | undefined {
		return _replicas.get(UserId);
	}
}

const DataManager = new DataManagerService();
const ProfileStore = ProfileService.GetProfileStore("CharacterStoreMOsCK", defaultData);

function onPlayerAdded(player: Player) {
	function onRelease() {
		DataManager.removeProfile(player.UserId);
		DataManager.removeReplica(player.UserId);
		player.Kick("Your profile has been released!");
	}

	const profile = ProfileStore.LoadProfileAsync(`Player_${player.UserId}`);

	if (profile) {
		profile.AddUserId(player.UserId);
		profile.Reconcile();
		profile.ListenToRelease(onRelease);

		if (player.IsDescendantOf(Players)) {
			const characterDataReplica = ReplicaService.NewReplica({
				ClassToken: ReplicaService.NewClassToken("CharacterData"),
				Data: profile.Data,
				Replication: player,
				Tags: { player: player },
			});

			characterDataReplica.SetValue("Credits", characterDataReplica.Data.Credits + 1);

			DataManager.addReplica(player.UserId, characterDataReplica);
			DataManager.addProfile(player.UserId, profile);
		} else {
			profile.Release();
		}
	}
}

function onPlayerRemoving(player: Player) {
	try {
		const profile = DataManager.getProfile(player.UserId);
		const replica = DataManager.getReplica(player.UserId);
		if (profile) {
			if (replica) {
				profile.Data = replica.Data;
			}

			profile.Release();
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
