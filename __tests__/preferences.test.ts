import insertPreferencesMenu from "../src/operations/preferences-menu";

describe("preferences menu", () => {
    it("does not throw", () => {
        window.fetch = mockFetch(""); // This means interests won't be populated, but we're not testing that here.
        expect(insertPreferencesMenu).not.toThrow();
    });
});

function mockFetch(data: string) {
    return jest.fn().mockImplementation(() =>
        Promise.resolve({
            ok: true,
            text: () => data,
        })
    );
}
