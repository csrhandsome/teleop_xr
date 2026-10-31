import { describe, expect, it } from "vitest";
import { TriggerMotionStatus } from "../motion_status";

function tick(status: TriggerMotionStatus, left: boolean, right: boolean, from: number, to: number, hold = 0.5) {
	let result = false;
	for (let t = from; t <= to; t += 0.125) result = status.update(left, right, t, hold);
	return result;
}

describe("double-trigger motion status", () => {
	it("waits until both triggers have independently held for the configured delay", () => {
		const status = new TriggerMotionStatus();
		expect(tick(status, true, false, 0, 0.5)).toBe(false);
		expect(tick(status, true, true, 0.625, 1)).toBe(false);
		expect(status.update(true, true, 1.125, 0.5)).toBe(true);
		expect(status.update(false, true, 1.25, 0.5)).toBe(false);
		expect(tick(status, true, true, 1.375, 1.75)).toBe(false);
		expect(status.update(true, true, 1.875, 0.5)).toBe(true);
	});

	it("restarts the delay after a stale frame gap or loss of the session", () => {
		const status = new TriggerMotionStatus();
		expect(tick(status, true, true, 0, 0.5)).toBe(true);
		expect(status.update(true, true, 1, 0.5)).toBe(false);
		expect(tick(status, true, true, 1.125, 1.5)).toBe(true);
		status.reset();
		expect(status.update(true, true, 1.625, 0.5)).toBe(false);
	});

	it("supports immediate activation and requires both valid triggers", () => {
		const status = new TriggerMotionStatus();
		expect(status.update(true, false, 0, 0)).toBe(false);
		expect(status.update(true, true, 0.125, 0)).toBe(true);
		expect(status.update(false, false, 0.25, 0)).toBe(false);
	});
});
