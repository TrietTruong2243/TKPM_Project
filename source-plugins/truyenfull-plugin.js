import NovelStrategy from "./plugin-interface.js";
import { load } from "cheerio";
import axios from "axios";
import { convertNameToSlug } from "../utils/name-converter.js";

class TruyenFullStrategy extends NovelStrategy {
    constructor() {
        super(
            "https://truyenfull.vn",
            "Truyện Full",
            "https://truyenfull.vn/favicon.ico"
        );
        this.apiUrl = "https://api.truyenfull.vn/v1";
    }

    async getCategories() {
        try {
            const response = await axios.get(`${this.baseUrl}`, {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36 OPR/72.0.3815.178",
                },
            });
            const html = response.data;
            const $ = load(html);

            const categories = [];
            const categoryElements = $('ul.dropdown-menu a');
            categoryElements.each((index, element) => {
                const href = $(element).attr('href');
                if (href.includes(`${this.baseUrl}/the-loai/`)) {
                    const categoryName = $(element).text().trim();
                    const categorySlug = href.split('/')[4];
                    categories.push({ name: categoryName, slug: categorySlug });
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
            $('.index-intro .item a').each((index, element) => {
                const subUrl = $(element).attr('href').replace(`${this.baseUrl}/`, '');
                const novel = {
                    title: $(element).find('.title h3').text().trim(),
                    image: $(element).find('img').attr('src'),
                    slug: subUrl.slice(0, subUrl.indexOf('/'))
                };

                hotNovels.push(novel);
            });

            return hotNovels;
        } catch (error) {
            console.error(error);
        }
    }

    async searchNovels(keywords, page = 1) {
        try {
            const response = await axios.get(`${this.baseUrl}/tim-kiem?tukhoa=${keywords}&page=${page}`, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36 OPR/72.0.3815.178",
                },
            });
            const html = response.data;
            const $ = load(html);
            const novelSlugs = $('h3.truyen-title a').map((index, element) => $(element).attr('href').split('/')[3]).get();

            const responseFromApi = await axios.get(`${this.apiUrl}/tim-kiem?title=${keywords}&order=6&page=${page}`, {
                headers: {
                    Accept: "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36 OPR/72.0.3815.178",
                },
            });
            const data = responseFromApi.data;
            const novels = data.data.map((novel, index) => {
                const categories = novel.categories.split(', ');
                categories.forEach((category, index) => {
                    categories[index] = { name: category, slug: convertNameToSlug(category) };
                });
                const authors = novel.author.split(', ');
                authors.forEach((author, index) => {
                    authors[index] = { name: author, slug: convertNameToSlug(author) };
                });

                return {
                    title: novel.title,
                    image: novel.image,
                    slug: novelSlugs[index],
                    authors,
                    categories,
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
                novels,
            };
        } catch (error) {
            throw error;
        }
    }

    async getNovelsByCategory(categorySlug, page = 1) {
        try {
            const response = await axios.get(`${this.baseUrl}/the-loai/${categorySlug}?page=${page}`, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36 OPR/72.0.3815.178",
                },
            });
            const html = response.data;
            const $ = load(html);

            const novels = [];
            $('.col-truyen-main .list-truyen .row').each((index, element) => {
                if($(element).attr('id')) return; // adware =(
                const title = $(element).find('.truyen-title a').text().trim();
                const image = $(element).find('img.cover').attr('src');
                const slug = $(element).find('.truyen-title a').attr('href').split('/')[3];
                const authors = [];
                $(element).find('.author').each((index, author) => {
                    const authorName = $(author).text().trim();
                    authors.push({ name: authorName, slug: convertNameToSlug(authorName) });
                });
                const status = $(element).find('.label-full').length ? 'Full' : 'Updating';
                
                novels.push({ 
                    title, 
                    image, 
                    slug,
                    authors,
                    categories: [],
                    numChapters: "",
                    status 
                });
            });

            const per_page = novels.length;
            let total = per_page;
            let total_pages = per_page > 0 ? 1 : 0;

            const lastPaginationButton = $('ul.pagination').length > 0 ? $('ul.pagination li').last() : null;
            if (lastPaginationButton) {
                const lastPage = lastPaginationButton.prev();
                total_pages = parseInt(lastPage.find('a').attr('href').split('/')[5].split('-')[1]);
                const responseFromLastPage = await axios.get(`${this.baseUrl}/the-loai/${categorySlug}?page=${total_pages}`, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36 OPR/72.0.3815.178",
                    },
                });
                const htmlFromLastPage = responseFromLastPage.data;
                const $lastPage = load(htmlFromLastPage);
                const numChaptersLastPage = $lastPage('.col-truyen-main .list-truyen .row').length;
                total = (total_pages - 1) * per_page + numChaptersLastPage;
            }

            return {
                meta: {
                    total,
                    per_page,
                    current_page: page,
                    total_pages
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

            const authors = [];
            $('.info a[itemprop="author"]').each((index, element) => {
                const href = $(element).attr('href');
                if (href.includes(`${this.baseUrl}/tac-gia/`)) {
                    const authorName = $(element).text().trim();
                    const authorSlug = href.split('/')[4];
                    authors.push({ name: authorName, slug: authorSlug });
                }
            });

            const categories = [];
            $('.info a[itemprop="genre"]').each((index, element) => {
                const href = $(element).attr('href');
                if (href.includes(`${this.baseUrl}/the-loai/`)) {
                    const categoryName = $(element).text().trim();
                    const categorySlug = href.split('/')[4];
                    categories.push({ name: categoryName, slug: categorySlug });
                }
            });

            const id = $('input#truyen-id').attr('value');
            const reponseFromApi = await axios.get(`${this.apiUrl}/story/detail/${id}`, {
                headers: {
                    Accept: "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36 OPR/72.0.3815.178",
                },
            });
            const data = reponseFromApi.data.data;
            const info = {
                id,
                slug: slug,
                title: data.title,
                image: data.image,
                authors,
                categories,
                description: data.description,
                numChapters: data.total_chapters,
                status: data.status,
            }

            return info;
        } catch (error) {
            throw error;
        }
    }

    async getNovelChapterList(novelSlug, page = 1) {
        try {
            const response = await axios.get(`${this.baseUrl}/${novelSlug}`, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36 OPR/72.0.3815.178",
                },
            });
            const html = response.data;
            const $ = load(html);

            const chapters = [];
            $('ul.list-chapter li').each((index, element) => {
                const chapterTitle = $(element).find('a').text();
                const chapterSlug = $(element).find('a').attr('href').split('/')[4];
                chapters.push({ title: chapterTitle, slug: chapterSlug });
            });

            const id = $('input#truyen-id').attr('value');
            const responseFromApi = await axios.get(`${this.apiUrl}/story/detail/${id}/chapters?page=${page}`, {
                headers: {
                    Accept: "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36 OPR/72.0.3815.178",
                },
            });
            const dataMeta = responseFromApi.data.meta;

            return {
                meta: {
                    total: dataMeta.pagination.total,
                    per_page: dataMeta.pagination.per_page,
                    current_page: dataMeta.pagination.current_page,
                    total_pages: dataMeta.pagination.total_pages,
                },
                chapters: chapters,
            };
        } catch (error) {
            throw error;
        }
    }

    async getChapterContent(novelSlug, chapterSlug) {
        try {
            const response = await axios.get(`${this.baseUrl}/${novelSlug}/${chapterSlug}`, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36 OPR/72.0.3815.178",
                },
            });
            const html = response.data;
            const $ = load(html);
            let nextSlug = $('a#next_chap').attr('href');
            if (nextSlug == "javascript:void(0)") nextSlug = "#";
            else nextSlug = nextSlug.split('/')[4];
            let prevSlug = $('a#prev_chap').attr('href');
            if (prevSlug == "javascript:void(0)") prevSlug = "#";
            else prevSlug = prevSlug.split('/')[4];
            const chapterId = $('input#chapter-id').attr('value');

            const responseFromApi = await axios.get(`${this.apiUrl}/chapter/detail/${chapterId}`, {
                headers: {
                    Accept: "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36 OPR/72.0.3815.178",
                },
            });
            const data = responseFromApi.data.data;
            const chapterContent = {
                slug: chapterSlug,
                title: data.chapter_name,
                content: data.content,
                position: data.position,
                next_slug: nextSlug,
                prev_slug: prevSlug,
            }

            return chapterContent;
        } catch (error) {
            throw error;
        }
    }
}

export default TruyenFullStrategy;
