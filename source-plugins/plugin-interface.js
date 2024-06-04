// Abstract class for Novel Strategies
// This class is used to define the structure of the Novel Strategies
class NovelStrategy{
    static numImplemented = 0;

    constructor(baseUrl, name, thumbnail){
        this.baseUrl = baseUrl;
        this.name = name;
        this.thumbnail = thumbnail;
        NovelStrategy.numImplemented++;
    }

    async getCategories(){
        throw new Error('You have to implement the method getGenres!');
    }

    async getHotNovels(){
        throw new Error('You have to implement the method getHotNovels!');
    }

    // TODO: getLatestNovels, getMostViewedNovels...

    async searchNovels(keyword, page = 1){
        throw new Error('You have to implement the method getNovels!');
    }

    async getNovelBySlug(slug){
        throw new Error('You have to implement the method getNovelBySlug!');
    }

    async getNovelChapterList(slug, page = 1){
        throw new Error('You have to implement the method getNovelChapterList!');
    }

    async getChapterContent(novelId, chapterId){
        throw new Error('You have to implement the method getChapterContent!');
    }
}

export default NovelStrategy;