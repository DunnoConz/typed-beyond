import Net from "@rbxts/net";

// client => server (remote) = server => client (replicas)
const Remotes = Net.Definitions.Create({
	CharacterUpdate: Net.Definitions.ClientToServerEvent<[StateGroup: number, State: number]>(),
});

export default Remotes;
