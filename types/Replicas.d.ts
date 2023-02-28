import { Replica } from "@rbxts/replicaservice";
import { OverrideStates, MovementStates, ActiveStates, ICharacterData, IPlayerData } from "shared/typings";
//import PlayerDataReplicaWriteLib from "../Shared/WriteLibs/PlayerData";

declare global {
	interface Replicas {
		CharacterData: {
			Data: ICharacterData;
			Tags: { player: Player };
		};
		StateData: {
			Data: {
				OverrideState: OverrideStates;
				ActiveState: ActiveStates;
				MovementState: MovementStates;
			};
			Tags: {};
		};
	}
}

export type CharacterDataReplica = Replica<"CharacterData">;
export type StateDataReplica = Replica<"StateData">;
