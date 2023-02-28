type StarterCharacter = Model & {
	["Left Leg"]: Part;
	Humanoid: Humanoid;
	["Right Leg"]: Part;
	Head: Part & {
		Face: Decal;
	};
	Torso: Part & {
		["Left Shoulder"]: Motor6D;
		["Right Shoulder"]: Motor6D;
		Neck: Motor6D;
		["Right Hip"]: Motor6D;
		["Left Hip"]: Motor6D;
	};
	HumanoidRootPart: Part & {
		["Root Hip"]: Motor6D;
	};
	["Right Arm"]: Part;
	["Left Arm"]: Part;
	["Body Colors"]: BodyColors;
}
