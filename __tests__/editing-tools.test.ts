import * as smileys from "../src/operations/logic/smileys";

describe("smiley toolbar", () => {
    it("contains :)", () => {
        expect(smileys.SMILEYS).toContainEqual<smileys.Smiley>([ ":)", "smiley-smile" ]);
    });
});
