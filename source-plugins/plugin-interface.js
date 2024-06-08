// Abstract class for Novel Strategies
// This class is used to define the structure of the Novel Strategies
class NovelStrategy {
	static numImplemented = 0;

	constructor(baseUrl, name, thumbnail) {
		this.baseUrl = baseUrl;
		this.name = name;
		this.thumbnail = thumbnail;
		NovelStrategy.numImplemented++;
	}

	async getCategories() {
		throw new Error("You have to implement the method getGenres!");
	}

	async getHotNovels() {
		throw new Error("You have to implement the method getHotNovels!");
	}

	// TODO: getLatestNovels, getMostViewedNovels...

	async searchNovels(keyword, page = 1) {
		throw new Error("You have to implement the method searchNovels!");
	}

    async getNovelsByCategory(categorySlug, page = 1){
        throw new Error('You have to implement the method getNovelByCategory!');
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

    async getChapterContentByPosition(novelSlug, position){
        throw new Error('You have to implement the method getChapterContentByPosition!');
    }
}

export default NovelStrategy;
