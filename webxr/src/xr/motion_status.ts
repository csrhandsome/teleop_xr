/** Double-trigger deadman indicator; independent of the IK grip buttons. */
export class TriggerMotionStatus {
	private leftSince: number | null = null;
	private rightSince: number | null = null;
	private lastUpdate: number | null = null;

	reset() {
		this.leftSince = null;
		this.rightSince = null;
		this.lastUpdate = null;
	}

	update(left: boolean, right: boolean, time: number, holdSeconds: number) {
		if (this.lastUpdate !== null &&
			(time - this.lastUpdate > 0.25 || time < this.lastUpdate)) {
			this.reset();
		}
		this.lastUpdate = time;
		this.leftSince = left ? (this.leftSince ?? time) : null;
		this.rightSince = right ? (this.rightSince ?? time) : null;
		return this.leftSince !== null && this.rightSince !== null &&
			time - this.leftSince >= holdSeconds &&
			time - this.rightSince >= holdSeconds;
	}
}
