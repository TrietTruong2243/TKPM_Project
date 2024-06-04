import NovelStrategy from './plugin-interface.js';
import { load } from 'cheerio';
import axios from 'axios';
import { convertNameToSlug } from '../utils/name-converter.js';

class TruyenFullStrategy extends NovelStrategy {
    constructor() {
        super('https://truyenfull.vn', 'Truyện Full', 'https://truyenfull.vn/favicon.ico');
        this.apiUrl = 'https://api.truyenfull.vn/v1';
    }

    async getCategories() {
        try {
            const response = await axios.get(`${this.baseUrl}`, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36 OPR/72.0.3815.178",
                },
            });
            const html = response.data;
            const $ = load(html);

            const categories = [];
            const categoryElements = $('ul.dropdown-menu a');

            categoryElements.each((index, element) => {
                const href = $(element).attr('href');
                if (href.includes(`${this.baseUrl}/the-loai/`)) {
                    const category = $(element).text().trim();
                    categories.push(category);
                }
            });

            return categories;

        } catch (error) {
            throw error;
        }
    }

    async getHotNovels() {
        try {
            const response = await axios.get(this.baseUrl, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36 OPR/72.0.3815.178",
                },
            });
            const html = response.data;
            const $ = load(html);
            const hotNovels = [];

            console.log($('index-intro .item a'));
            $('.index-intro .item a').each((index, element) => {
                const subUrl = $(element).attr('href').replace(`${this.baseUrl}/`, '');
                
                const novel = {
                    title: $(element).find('.title h3').text().trim(),
                    image: $(element).find('img').attr('src'),
                    slug: subUrl.slice(0, subUrl.indexOf('/'))
                };

                hotNovels.push(novel);
            });

            console.log(hotNovels);
            return hotNovels;

        } catch (error) {
            console.error(error);
        }
    }

    async searchNovels(keywords, page = 1) {
        try {
            const response = await axios.get(`${this.apiUrl}/tim-kiem?title=${keywords}&page=${page}`, {
                headers: {
                    Accept: "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36 OPR/72.0.3815.178",
                },
            });

            const data = response.data;
            const novels = data.data.map(novel => {
                return {
                    title: novel.title,
                    image: novel.image,
                    slug: convertNameToSlug(novel.title),
                    authors: novel.author,
                    categories: novel.categories,
                    numChapters: novel.total_chapters,
                    status: novel.is_full === true ? 'Full' : 'Updating',
                }
            });

            return {
                meta: {
                    total: data.meta.pagination.total,
                    per_page: data.meta.pagination.per_page,
                    current_page: data.meta.pagination.current_page,
                    total_pages: data.meta.pagination.total_pages,
                },
                novels
            }
        } catch (error) {
            throw error;
        }
    }

    async getNovelBySlug(slug) {
        try {
            const response = await axios.get(`${this.baseUrl}/${slug}`, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36 OPR/72.0.3815.178",
                },
            });
            const html = response.data;
            const $ = load(html);
            const id = $('input#truyen-id').attr('value');
            
            const reponseFromApi = await axios.get(`${this.apiUrl}/story/detail/${id}`, {
                headers: {
                    Accept: "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36 OPR/72.0.3815.178",
                },
            });
            const data = reponseFromApi.data.data;
            const info = {
                id: data.id,
                title: data.title,
                image: data.image,
                authors: data.author,
                categories: data.categories,
                description: data.description,
                numChapters: data.total_chapters,
                status: data.status,
            }

            return info;

        } catch (error) {
            throw error;
        }
    }

    async getNovelChapterList(slug, page = 1) {
        try {
            const response = await axios.get(`${this.baseUrl}/${slug}`, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36 OPR/72.0.3815.178",
                },
            });
            const html = response.data;
            const $ = load(html);
            const id = $('input#truyen-id').attr('value');

            const responseFromApi = await axios.get(`${this.apiUrl}/story/detail/${id}/chapters?page=${page}`, {
                headers: {
                    Accept: "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36 OPR/72.0.3815.178",
                },
            });

            const data = responseFromApi.data; 
            const chapters = data.data.map(chapter => {
                return {
                    id: chapter.id,
                    title: chapter.title,
                }
            })

            return {
                meta: {
                    total: data.meta.pagination.total,
                    per_page: data.meta.pagination.per_page,
                    current_page: data.meta.pagination.current_page,
                    total_pages: data.meta.pagination.total_pages,
                },
                chapters: chapters
            }
        } catch (error) {
            throw error;
        }
    }

    async getChapterContent(novelId, chapterId) {
        try {

            const response = await axios.get(`${this.apiUrl}/chapter/detail/${chapterId}`, {
                headers: {
                    Accept: "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36 OPR/72.0.3815.178",
                },
            });

            const data = response.data.data;

            console.log(data);

            const chapterContent = {
                id: data.chapter_id,
                title: data.chapter_name,
                content: data.content,
                position: data.position,
                nextId: data.chapter_next,
                prevId: data.chapter_prev,
            }

            return chapterContent;
        } catch (error) {
            throw error;
        }
    }
}

export default TruyenFullStrategy;