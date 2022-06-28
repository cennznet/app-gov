import { accessCennznet } from "./access-cennznet";

describe("accessCennznet", () => {
	it("should work", () => {
		expect(accessCennznet()).toEqual("access-cennznet");
	});
});
