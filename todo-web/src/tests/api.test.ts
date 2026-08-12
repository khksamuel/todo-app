import { apiFetch } from "../util/api";

describe("apiFetch", () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    globalThis.fetch = fetchMock;
  });

  it("calls the API endpoint with the default Accept header and returns json", async () => {
    const payload = { id: 1, title: "Write tests" };
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => payload,
    });

    await expect(apiFetch("/todos")).resolves.toEqual(payload);

    expect(fetchMock).toHaveBeenCalledWith("/api/todos", {
      headers: {
        Accept: "application/json",
      },
    });
  });

  it("throws an error when the API response is not ok", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(apiFetch("/todos")).rejects.toThrow("API request failed: 500");
  });

  it("returns null for a 204 no-content response", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 204,
    });

    await expect(apiFetch("/todos")).resolves.toBeNull();
  });
});
