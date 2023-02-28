import { ActiveStates, getEnumName, MovementStates, OverrideStates } from "shared/typings";
import { Players } from "@rbxts/services";
import { ReplicaService } from "@rbxts/replicaservice";

const Replicas: string[] = [];

class _StateService {
	constructor() {
		print("StateService has started!");

		// since state replia doesn't save this will be created by this provider
		Players.PlayerAdded.Connect((player) => {
			print(player + " has registered a state replica!");

			const replica = ReplicaService.NewReplica({
				ClassToken: ReplicaService.NewClassToken("StateData"),
				Data: {
					OverrideState: OverrideStates.NOOVERRIDE,
					ActiveState: ActiveStates.NOACTIVE,
					MovementState: MovementStates.NOMOVEMENT,
				},
				Replication: player,
				Tags: { player: player },
			});
		});

		//Network.updateState.server.connect((player, stateType, state) => {
		//	print(player, stateType, state, getEnumName(stateType, state));
		//});
	}
}

const StateService = new _StateService();

export = StateService;
