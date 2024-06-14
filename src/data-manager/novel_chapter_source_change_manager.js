import DataManagementInterface from "./data_management_interface";
import getNovelChapterSourceChange from "../service/source_novel_change_service";
let instance;
class ChapterSourceChangeManager extends DataManagementInterface {

    //constructor group
    constructor() {
        if (instance) {
            throw new Error('You can only create 1 instance!')
        }
        super();
        this.allChapterInfo = [];
        this.sourceList = [];
        this.novelSlug = null;
        this.chapterSlug = null;
        this.chapterTitle = null;
        this.chapterPosition = null;
        this.instance = this;
    }
    static getInstance() {
        if (instance) {
            return instance;
        }
        return new ChapterSourceChangeManager();
    }



    //override DataManagentInterface
    async get(key) {
        switch (key){
            case 'all_chapter_info':{
                this.allChapterInfo = [];
                await this.reload();
                return this.allChapterInfo;
            }
            default:{
                console.log(`Cannot find ${key} in change chapter source manager!`)
                return null;
            }
        }
        
    }
    async set(params) {
        this.sourceList = params.sourceList;
        this.novelSlug = params.novelSlug;
        this.chapterSlug = params.chapterSlug;
        this.chapterTitle = params.chapterTitle;
        this.chapterPosition = params.chapterPosition;

    }
    async save() {
    }
    async reload() {
        // Khởi tạo một mảng promises để chứa tất cả các promise
        const promises = [];

        // Duyệt qua danh sách nguồn và tạo các promise
        for (let source of this.sourceList) {
            const promise = getNovelChapterSourceChange(
                source.slug,
                this.novelSlug,
                this.chapterSlug,
                this.chapterTitle,
                this.chapterPosition
            )
                .then(chapterInfo => {
                    // Thêm thuộc tính sourceSlug và sourceName vào chapterInfo
                    if (chapterInfo) {
                        chapterInfo.sourceSlug = source.slug;
                        chapterInfo.sourceName = source.name;
                        return chapterInfo;
                    } else {
                        // Nếu chapterInfo không tồn tại, trả về một đối tượng với thông tin mặc định
                        console.warn(`No chapter info for source: ${source.slug}`);
                        return {
                            sourceSlug: source.slug,
                            sourceName: source.name,
                            error: 'No data'
                        };
                    }
                })
                .catch(error => {
                    // Nếu có lỗi, trả về một đối tượng với thông tin mặc định
                    console.error(`Error loading chapter info for source: ${source.slug}`, error);
                    return {
                        sourceSlug: source.slug,
                        sourceName: source.name,
                        error: error.message
                    };
                });

            // Log the promise for debugging
            console.log(`Promise created for source: ${source.slug}`, promise);
            promises.push(promise);
        }

        // Chờ tất cả các promise hoàn thành bằng Promise.all
        try {
            const allChapterInfo = await Promise.all(promises);

            // Kiểm tra và log từng phần tử trong allChapterInfo
            allChapterInfo.forEach((info, index) => {
                console.log(`Chapter info at index ${index}:`, info);
                if (!info || info.error) {
                    console.warn(`Incomplete or missing data at index ${index}:`, info);
                }
            });

            // Sau khi tất cả các promise đã hoàn thành, allChapterInfo sẽ chứa dữ liệu từ tất cả các nguồn theo thứ tự
            this.allChapterInfo = allChapterInfo;

            // Log allChapterInfo để kiểm tra
            console.log('All chapter info:', allChapterInfo);
        } catch (error) {
            console.error('Error awaiting all promises:', error);
            // Handle the case where Promise.all fails (though it should not fail due to catch in each promise)
        }
    }

    
    //addition method

    async getChapterRelatedBySource(sourceSlug, sourceName) {
        try {
            const chapterInfo = await getNovelChapterSourceChange(
                sourceSlug,
                this.novelSlug,
                this.chapterSlug,
                this.chapterTitle,
                this.chapterPosition
            );
            // Check if chapterInfo is valid and add additional properties
            if (chapterInfo) {
                if (!chapterInfo.position) {
                    chapterInfo.position = this.chapterPosition
                }
                chapterInfo.sourceSlug = sourceSlug;
                chapterInfo.sourceName = sourceName;
                return chapterInfo;
            } else {
                return {
                    sourceSlug: sourceSlug,
                    sourceName: sourceName,
                    error: 'No chapter info found'
                };
            }
        } catch (error) {
            // Handle errors and return an object with error information
            console.error(`Error loading chapter info for source: ${sourceSlug}`, error);
            return {
                sourceSlug: sourceSlug,
                sourceName: sourceName,
                error: error.message
            };
        }
    }


}
export default ChapterSourceChangeManager;