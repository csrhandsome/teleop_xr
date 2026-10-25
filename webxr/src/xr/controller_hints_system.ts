import { createSystem, type World } from "@iwsdk/core";
import {
	CanvasTexture,
	Mesh,
	MeshBasicMaterial,
	PlaneGeometry,
	SRGBColorSpace,
	Vector3,
} from "three";
import {
	type ControllerHintPanel,
	type ControllerHints,
	useAppStore,
} from "../lib/store";
import { ControllerCameraPanelSystem } from "./controller_camera_system";

type Hand = "left" | "right";

// Text is rendered on canvas so CJK uses the headset's own fonts, without an
// external font download or a separate UIKit glyph atlas.
class ControllerHintsPanel {
	readonly entity: ReturnType<World["createTransformEntity"]>;
	readonly anchorOffset: Vector3;
	private readonly canvas = document.createElement("canvas");
	private readonly context: CanvasRenderingContext2D;
	private readonly texture: CanvasTexture;
	private readonly mesh: Mesh<PlaneGeometry, MeshBasicMaterial>;
	hasContent = false;

	constructor(world: World, readonly handedness: Hand) {
		this.entity = world.createTransformEntity();
		// Below the camera previews and the right-hand connection status strip.
		this.anchorOffset = new Vector3(handedness === "left" ? -0.12 : 0.12, -0.25, -0.035);
		const context = this.canvas.getContext("2d");
		if (!context) throw new Error("Controller hints canvas context unavailable");
		this.context = context;
		this.texture = new CanvasTexture(this.canvas);
		this.texture.colorSpace = SRGBColorSpace;
		this.mesh = new Mesh(
			new PlaneGeometry(1, 1),
			new MeshBasicMaterial({ map: this.texture, transparent: true, depthWrite: false }),
		);
		this.mesh.renderOrder = 2;
		this.entity.object3D?.add(this.mesh);
		if (this.entity.object3D) this.entity.object3D.visible = false;
	}

	setConfig(config: ControllerHintPanel | undefined) {
		this.hasContent = Boolean(config?.rows.length);
		if (!config || !this.hasContent) return;

		this.canvas.width = 1024;
		this.canvas.height = 108 + config.rows.length * 76;
		const ctx = this.context;
		const accent = this.handedness === "left" ? "#7dd3fc" : "#fcd34d";
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		ctx.fillStyle = "rgba(13, 20, 29, 0.94)";
		ctx.beginPath();
		ctx.roundRect(4, 4, this.canvas.width - 8, this.canvas.height - 8, 28);
		ctx.fill();
		ctx.strokeStyle = accent;
		ctx.lineWidth = 3;
		ctx.stroke();
		ctx.textBaseline = "middle";
		ctx.font = '600 44px "Noto Sans CJK SC", "Microsoft YaHei", sans-serif';
		ctx.fillStyle = accent;
		ctx.fillText(config.title, 32, 51, 960);

		for (const [index, row] of config.rows.entries()) {
			const y = 94 + index * 76;
			ctx.fillStyle = "#223244";
			ctx.beginPath();
			ctx.roundRect(28, y, 256, 62, 12);
			ctx.fill();
			ctx.fillStyle = accent;
			ctx.font = '600 38px "Noto Sans CJK SC", "Microsoft YaHei", sans-serif';
			ctx.fillText(row.button, 44, y + 31, 224);
			ctx.fillStyle = "#f1f5f9";
			ctx.font = '500 40px "Noto Sans CJK SC", "Microsoft YaHei", sans-serif';
			ctx.fillText(row.action, 308, y + 31, 680);
		}
		this.mesh.scale.set(0.38, 0.38 * this.canvas.height / this.canvas.width, 1);
		this.texture.needsUpdate = true;
	}

	dispose() {
		this.mesh.geometry.dispose();
		this.mesh.material.dispose();
		this.texture.dispose();
		this.entity.destroy();
	}
}

export class ControllerHintsSystem extends createSystem({}) {
	private panels: ControllerHintsPanel[] = [];
	private lastConfig: ControllerHints | null = null;

	init() {
		const anchors = this.world.getSystem(ControllerCameraPanelSystem);
		for (const hand of ["left", "right"] as const) {
			const panel = new ControllerHintsPanel(this.world as World, hand);
			this.panels.push(panel);
			anchors?.registerPanelWithGetter(panel, () => this.world.player?.raySpaces?.[hand]);
		}
	}

	update() {
		const config = useAppStore.getState().controllerHints;
		for (const panel of this.panels) {
			if (config !== this.lastConfig) panel.setConfig(config[panel.handedness]);
			const hand = panel.handedness;
			const controller = this.world.player?.gripSpaces?.[hand] ?? this.world.player?.raySpaces?.[hand];
			if (panel.entity.object3D) {
				panel.entity.object3D.visible = panel.hasContent && Boolean(controller)
					&& Boolean(this.world.input?.isPrimary?.("controller", hand));
			}
		}
		this.lastConfig = config;
	}

	destroy() {
		for (const panel of this.panels) panel.dispose();
		this.panels = [];
	}
}
