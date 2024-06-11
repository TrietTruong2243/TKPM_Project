import fs from "fs";
import path from "path";

// Function to load plugin synchronously
function loadPluginSync() {
	const pluginDir = path.join(__dirname, "../source-plugins");
	const files = fs.readdirSync(pluginDir);
	const pluginFiles = files.filter((file) => file.endsWith("-plugin.js"));

	const plugins = [];

	for (const pluginFile of pluginFiles) {
		const PluginModule = require(path.join(pluginDir, pluginFile)); // Using require for synchronous loading
		const Plugin = PluginModule.default;
		const pluginInstance = new Plugin();

		plugins.push({ pluginInstance, pluginFile });
	}

	return plugins;
}

describe("Testing Plugin", () => {
	const plugins = loadPluginSync();

	for (const plugin of plugins) {
		test.concurrent(`getCategories (${plugin.pluginFile}) is-array`, async () => {
			const categories = await plugin.pluginInstance.getCategories();
			expect(categories).toBeInstanceOf(Array);
		});

		test.concurrent(`getCategories (${plugin.pluginFile}) not-empty`, async () => {
			const categories = await plugin.pluginInstance.getCategories();
			expect(categories.length).toBeGreaterThan(0);
		});

		test.concurrent(`getCategories (${plugin.pluginFile}) check-properties-of-object`, async () => {
			const categories = await plugin.pluginInstance.getCategories();
			expect(categories[0]).toHaveProperty("name");
			expect(categories[0]).toHaveProperty("slug");
		});

		test.concurrent(`getHotNovels (${plugin.pluginFile}) is-array`, async () => {
			const hotNovels = await plugin.pluginInstance.getHotNovels();
			expect(hotNovels).toBeInstanceOf(Array);
		});

		test.concurrent(`getHotNovels (${plugin.pluginFile}) not-empty`, async () => {
			const hotNovels = await plugin.pluginInstance.getHotNovels();
			expect(hotNovels.length).toBeGreaterThan(0);
		});

		test.concurrent(`getHotNovels (${plugin.pluginFile}) check-properties-of-object`, async () => {
			const hotNovels = await plugin.pluginInstance.getHotNovels();

			expect(hotNovels[0]).toHaveProperty("title");
			expect(hotNovels[0]).toHaveProperty("image");
			expect(hotNovels[0]).toHaveProperty("slug");
		});

		test.concurrent(`searchNovels (${plugin.pluginFile}) novel-not-found`, async () => {
			const result = await plugin.pluginInstance.searchNovels("112313534672", 1);
			expect(result).toHaveProperty("meta");
			expect(result.meta.total === 0);
			expect(result).toHaveProperty("novels");
			expect(result.novels).toBeInstanceOf(Array);
		});

		test.concurrent(`searchNovels (${plugin.pluginFile}) novel-found`, async () => {
			const hotNovels = await plugin.pluginInstance.getHotNovels();
			const bestNovel = hotNovels[0];
			const response = await plugin.pluginInstance.searchNovels(bestNovel.title.slice(0, 4), 1);
			const result = response.novels;

			expect(result.length).toBeGreaterThan(0);
			expect(result).toBeInstanceOf(Array);
			expect(result[0]).toHaveProperty("slug");
			expect(result[0]).toHaveProperty("title");
			expect(result[0]).toHaveProperty("image");
			expect(result[0]).toHaveProperty("authors");
			expect(result[0]).toHaveProperty("categories");
			expect(result[0]).toHaveProperty("numChapters");
			expect(result[0]).toHaveProperty("status");
		});

		test.concurrent(`getNovelsByCategory (${plugin.pluginFile}) check-properties-of-object`, async () => {
			const result = await plugin.pluginInstance.getNovelsByCategory("tien-hiep", 2);
			expect(result).toHaveProperty("meta");
			expect(result.meta).toHaveProperty("total");
			expect(result.meta).toHaveProperty("current_page");
			expect(result.meta).toHaveProperty("per_page");
			expect(result.meta).toHaveProperty("total_pages");

			expect(result).toHaveProperty("novels");
			expect(result.novels).toBeInstanceOf(Array);
			expect(result.novels.length).toBeGreaterThan(0);
			expect(result.novels[0]).toHaveProperty("slug");
			expect(result.novels[0]).toHaveProperty("title");
			// expect(result.novels[0]).toHaveProperty('image');
			expect(result.novels[0]).toHaveProperty("authors");
			expect(result.novels[0]).toHaveProperty("categories");
			expect(result.novels[0]).toHaveProperty("numChapters");
			expect(result.novels[0]).toHaveProperty("status");
		});

		test.concurrent(`getNovelBySlug (${plugin.pluginFile})`, async () => {
			const hotNovels = await plugin.pluginInstance.getHotNovels();
			const bestNovel = hotNovels[0];
			const novel = await plugin.pluginInstance.getNovelBySlug(bestNovel.slug);

			expect(novel).toHaveProperty("title");
			expect(novel).toHaveProperty("authors");
			expect(novel).toHaveProperty("categories");
			expect(novel).toHaveProperty("description");
			expect(novel).toHaveProperty("id");
			expect(novel).toHaveProperty("image");
			expect(novel).toHaveProperty("numChapters");
			expect(novel).toHaveProperty("slug");
			expect(novel).toHaveProperty("status");
			expect(novel).toHaveProperty("title");
		});

		test.concurrent(`getNovelChapterList (${plugin.pluginFile})`, async () => {
			const hotNovels = await plugin.pluginInstance.getHotNovels();
			const bestNovel = hotNovels[0];
			const chapterList = await plugin.pluginInstance.getNovelChapterList(bestNovel.slug, 1);

			expect(chapterList).toHaveProperty("meta");
			expect(chapterList).toHaveProperty("chapters");
		});

		test.concurrent(`getChapterContent (${plugin.pluginFile})`, async () => {
			const hotNovels = await plugin.pluginInstance.getHotNovels();
			const bestNovel = hotNovels[0];
			const chapterList = await plugin.pluginInstance.getNovelChapterList(bestNovel.slug, 1);
			const i = 3;
			let chapter = chapterList.chapters[i].slug;
			chapter = await plugin.pluginInstance.getChapterContent(bestNovel.slug, chapter);

			expect(chapter).toHaveProperty("title");
			expect(chapter).toHaveProperty("content");
			expect(chapter).toHaveProperty("next_slug");
			expect(chapter).toHaveProperty("prev_slug");
			expect(chapter).toHaveProperty("slug");
		});
	}
});
