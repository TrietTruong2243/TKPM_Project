import novelFetcher from "../services/novel-fetcher";
jest.mock("../services/novel-fetcher");

function runPluginTest(pluginInstance, pluginFile) {
	describe(`Testing Plugin ${pluginFile}`, () => {
		const mockResponse = {
			data: {
				slug: "test-novel-2",
				title: "Test chapter",
				content: "Test content 1 <br/>Test content 2",
				prev_slug: "test-novel-1",
				next_slug: "test-novel-3",
			}
		};

		beforeEach(() => {
			novelFetcher.fetchChapterContent.mockResolvedValue(mockResponse);
		});

		test.concurrent(`properties (${pluginFile})`, () => {
			expect(pluginInstance).toHaveProperty("extension");
			expect(pluginInstance).toHaveProperty("image");
		});

		test.concurrent(`getBuffer (${pluginFile} is not empty)`, async () => {
			const buffer = await pluginInstance.getBuffer("source", "test-novel-2", "chapter-slug");
			expect(buffer).not.toBeNull();
			expect(buffer).not.toBeUndefined();
			expect(buffer).toHaveProperty("blob");
		});
	});
}

export default runPluginTest;
