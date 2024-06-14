function runPluginTest(pluginInstance, pluginFile) {

	describe(`Testing Plugin ${pluginFile}`, () => {
		test.concurrent(`properties (${pluginFile})`, () => {
			expect(pluginInstance).toHaveProperty("name");
			expect(pluginInstance).toHaveProperty("thumbnail");
			expect(pluginInstance).toHaveProperty("baseUrl");
			expect(pluginInstance).toHaveProperty("maxNovelsPerPage");
			expect(pluginInstance).toHaveProperty("maxNumChaptersPerPage");
		});

		test.concurrent(`getCategories (${pluginFile}) is-array`, async () => {
			const categories = await pluginInstance.getCategories();
			expect(categories).toBeInstanceOf(Array);
		});

		test.concurrent(`getCategories (${pluginFile}) not-empty`, async () => {
			const categories = await pluginInstance.getCategories();
			expect(categories.length).toBeGreaterThan(0);
		});

		test.concurrent(`getCategories (${pluginFile}) check-properties-of-object`, async () => {
			const categories = await pluginInstance.getCategories();
			expect(categories[0]).toHaveProperty("name");
			expect(categories[0]).toHaveProperty("slug");
		});

		test.concurrent(`getHotNovels (${pluginFile}) is-array`, async () => {
			const hotNovels = await pluginInstance.getHotNovels();
			expect(hotNovels).toBeInstanceOf(Array);
		});

		test.concurrent(`getHotNovels (${pluginFile}) not-empty`, async () => {
			const hotNovels = await pluginInstance.getHotNovels();
			expect(hotNovels.length).toBeGreaterThan(0);
		});

		test.concurrent(`getHotNovels (${pluginFile}) check-properties-of-object`, async () => {
			const hotNovels = await pluginInstance.getHotNovels();

			expect(hotNovels[0]).toHaveProperty("title");
			expect(hotNovels[0]).toHaveProperty("image");
			expect(hotNovels[0]).toHaveProperty("slug");
		});

		test.concurrent(`searchNovels (${pluginFile}) novel-not-found`, async () => {
			const result = await pluginInstance.searchNovels("112313534672", 1);

			expect(result).toHaveProperty("meta");
			expect(result.meta.total === 0);
			expect(result).toHaveProperty("novels");
			expect(result.novels).toBeInstanceOf(Array);
		});

		test.concurrent(`searchNovels (${pluginFile}) novel-found`, async () => {
			const hotNovels = await pluginInstance.getHotNovels();
			const bestNovel = hotNovels[0];
			const response = await pluginInstance.searchNovels(bestNovel.title, 1);
			const result = response.novels;

			expect(result[0]).toHaveProperty("slug");
			expect(result[0]).toHaveProperty("title");
			expect(result[0]).toHaveProperty("image");
			expect(result[0]).toHaveProperty("authors");
			expect(result[0]).toHaveProperty("categories");
			expect(result[0]).toHaveProperty("numChapters");
			expect(result[0]).toHaveProperty("status");
		},10000);

		test.concurrent(`getNovelsByCategory (${pluginFile}) check-properties-of-object`, async () => {
			const catogories = await pluginInstance.getCategories();
			const result = await pluginInstance.getNovelsByCategory(catogories[0].slug, 1);

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
			expect(result.novels[0]).toHaveProperty("image");
			expect(result.novels[0]).toHaveProperty("authors");
			expect(result.novels[0]).toHaveProperty("categories");
			expect(result.novels[0]).toHaveProperty("numChapters");
			expect(result.novels[0]).toHaveProperty("status");
		},10000);

		test.concurrent(`getNovelBySlug (${pluginFile})`, async () => {
			const hotNovels = await pluginInstance.getHotNovels();
			const bestNovel = hotNovels[0];
			const novel = await pluginInstance.getNovelBySlug(bestNovel.slug);

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
		},10000);

		test.concurrent(`getNovelChapterList (${pluginFile})`, async () => {
			const hotNovels = await pluginInstance.getHotNovels();
			const bestNovel = hotNovels[0];
			const result = await pluginInstance.getNovelChapterList(bestNovel.slug, 1);

			expect(result).toHaveProperty("meta");
			expect(result.meta).toHaveProperty("total");
			expect(result.meta).toHaveProperty("current_page");
			expect(result.meta).toHaveProperty("per_page");
			expect(result.meta).toHaveProperty("total_pages");

			expect(result).toHaveProperty("chapters");
			expect(result.chapters).toBeInstanceOf(Array);
			expect(result.chapters.length).toBeGreaterThan(0);
			expect(result.chapters[0]).toHaveProperty("title");
			expect(result.chapters[0]).toHaveProperty("slug");
			expect(result.chapters[0]).toHaveProperty("position");
		},10000);

		test.concurrent(`getChapterContent (${pluginFile})`, async () => {
			const hotNovels = await pluginInstance.getHotNovels();
			const bestNovel = hotNovels[0];
			const chapterList = await pluginInstance.getNovelChapterList(bestNovel.slug, 1);
			const i = 0;
			let chapter = chapterList.chapters[i].slug;
			chapter = await pluginInstance.getChapterContent(bestNovel.slug, chapter);

			expect(chapter).toHaveProperty("title");
			expect(chapter).toHaveProperty("content");
			expect(chapter).toHaveProperty("next_slug");
			expect(chapter).toHaveProperty("prev_slug");
			expect(chapter).toHaveProperty("slug");
		}, 15000);
	});
}

export default runPluginTest;
