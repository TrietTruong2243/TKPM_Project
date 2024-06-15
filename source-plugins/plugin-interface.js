// Abstract class for Novel Strategies
// This class is used to define the structure of the Novel Strategies
class NovelStrategy {
	constructor(baseUrl, name, thumbnail, maxNovelsPerPage, maxNumChaptersPerPage) {
		this.baseUrl = baseUrl;
		this.name = name;
		this.thumbnail = thumbnail;
		// Maximum number of novels and chapters per page, this is constant for each strategy
		this.maxNovelsPerPage = maxNovelsPerPage;
		this.maxNumChaptersPerPage = maxNumChaptersPerPage;
	}

	async getCategories() {
		throw new Error("You have to implement the method getGenres!");
	}

	async getHotNovels() {
		throw new Error("You have to implement the method getHotNovels!");
	}

	async searchNovels(keyword, page = 1) {
		throw new Error("You have to implement the method searchNovels!");
	}

	async getNovelsByCategory(categorySlug, page = 1) {
		throw new Error("You have to implement the method getNovelByCategory!");
	}

	async getNovelBySlug(novelSlug) {
		throw new Error("You have to implement the method getNovelBySlug!");
	}

	async getNovelChapterList(novelSlug, page) {
		throw new Error("You have to implement the method getNovelChapterList!");
	}

	async getChapterContent(novelSlug, chapterSlug) {
		throw new Error("You have to implement the method getChapterContent!");
	}
}

export default NovelStrategy;
