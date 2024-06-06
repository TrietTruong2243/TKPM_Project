import NovelStrategy from "./plugin-interface.js";
import { load } from "cheerio";
import { convertNameToSlug } from "../utils/name-converter.js";
import axios from "axios";

class MeTruyenChuStrategy extends NovelStrategy {
	constructor() {
		super(
			"https://metruyenchu.com.vn",
			"Mê Truyện Chữ",
			"https://metruyenchu.com.vn/images/logo.png"
		);
		this.hotNovelsPath = "get/hotbook";
		this.listChapPath = "get/listchap";
	}

	async getCategories() {
		try {
			const response = await axios.get(this.baseUrl);
			const html = response.data;
			const $ = load(html);

			const categories = [];
			$("#menu .menu-item-has-children")
				.eq(1)
				.find("ul li")
				.each((index, element) => {
					const categoryName = $(element).find("a").text();
					const categorySlug = $(element).find("a").attr("href").replace("/the-loai/", "");

					categories.push({ name: categoryName, slug: categorySlug });
				});

			return categories;
		} catch (error) {
			throw error;
		}
	}

	async getHotNovels() {
		try {
			const response = await axios.get(`${this.baseUrl}/${this.hotNovelsPath}/0`);
			const html = response.data;
			const $ = load(html);
			const hotNovels = [];

			$(".item").each((index, element) => {
				const title = $(element).find("h3").text().trim();
				const image = $(element).find("img").attr("src").trim();
				const slug = $(element).find("a").attr("href").trim().replace("/", "");

				const novel = { title, image: this.baseUrl + image, slug };

				hotNovels.push(novel);
			});

			return hotNovels;
		} catch (error) {
			throw error;
		}
	}

	async searchNovels(keywords, page = 1) {
		try {
			const response = await axios.get(`${this.baseUrl}/search?q=${keywords}&page=${page}`);
			const html = response.data;
			const $ = load(html);
			const novels = [];

			$(".truyen-list .item").each((index, element) => {
				const slug = $(element).find("a").attr("href").replace("/", "");
				const title = $(element).find("h3 a").text();
				const image = $(element).find("img").attr("src");

				const authors = [];
				$(element)
					.find(".line")
					.eq(0)
					.find("a")
					.each((index, ele) => {
						const authorName = $(ele).text();
						const authorSlug = $(ele).attr("href").replace("/tac-gia/", "");
						authors.push({ name: authorName, slug: authorSlug });
					});

				const categories = [];
				$(element)
					.find(".line")
					.eq(1)
					.find("a")
					.each((index, ele) => {
						const categoryName = $(ele).text();
						const categorySlug = $(ele).attr("href").replace("/the-loai/", "");
						categories.push({ name: categoryName, slug: categorySlug });
					});

				const numChapters = $(element)
					.find(".line")
					.eq(2)
					.text()
					.replace("Số chương::", "")
					.trim();

				let status;
				const novel = {
					slug,
					title,
					image: this.baseUrl + image,
					authors,
					categories,
					numChapters: parseInt(numChapters),
					status,
				};

				novels.push(novel);
			});

			const totalNovels = $('.title-list p').text().match(/\d+/)[0];
			let lastPage = $('.phan-trang a').last();
			console.log(lastPage);
			if (lastPage.text() === '❭') lastPage = lastPage.prev();
			const totalPages = parseInt(lastPage.text());

			return {
				meta: {
					total: parseInt(totalNovels),
					current_page: page,
					per_page: novels.length,
					total_pages: totalPages
				},
				novels,
			}
		} catch (error) {
			throw error;
		}
	}

	async getNovelChapterList(slug, page = 1) {
		try {
			const novel = await this.getNovelBySlug(slug);

			const response = await axios.get(
				`${this.baseUrl}/${this.listChapPath}/${novel.id}?page=${page}`
			);
			const html = response.data;
			const $ = load(html.data);

			const chapters = [];
			$("ul li").each((index, chapter) => {
				const title = $(chapter).find("a").text();
				const chapterSlug = $(chapter).find("a").attr("href").split("/")[2];
				chapters.push({ title, slug: chapterSlug });
			});

			let total_pages = 1;
			const lastElement = $('.paging a').last();
			console.log(lastElement.attr('onclick'));
			if(lastElement.attr('onclick')) 
				total_pages = lastElement.attr('onclick').match(/page\(\d+,\s*(\d+)\);?/)[1];
			else 
				total_pages = parseInt(lastElement.text());

			return {
				meta: {
					total: novel.numChapters,
					current_page: page,
					per_page: chapters.length,
					total_pages
				},
				chapters,
			};
		} catch (error) {
			throw error;
		}
	}

	async getNovelBySlug(slug) {
		try {
			const response = await axios.get(`${this.baseUrl}/${slug}`);
			const html = response.data;
			const $ = load(html);

			const id = $('.findchap input[name="bid"]').val();
			const title = $(".mainCol h1").text();
			const description = $(".book-info .scrolltext div").html();
			const image = $(".book-info-pic img").attr("src");

			const authors = [];
			$(".book-info-text ul li")
				.eq(0)
				.each((index, element) => {
					const authorName = $(element).find('a[itemprop="author"]').text();
					const authorSlug = $(element).find('a[itemprop="author"]').attr("href").replace("/tac-gia/", "");
					authors.push({ name: authorName, slug: authorSlug });
				});

			const categories = [];
			$(".li--genres a").each((index, genre) => {
				const genreName = $(genre).text();
				const genreSlug = $(genre).attr("href").replace("/the-loai/", "");
				categories.push({ name: genreName, slug: genreSlug });
			});

			// let chapterPerPage = 0;
			// $("#chapter-list .clearfix ul").each((index, ulEle) => {
			// 	chapterPerPage += $(ulEle).find("li").length;
			// });

			const numChapters = $(".mLeftCol .book-info-text li")
				.eq(2)
				.text()
				.replace("Số chương:", "")
				.trim();

			const status = $(".mLeftCol .book-info-text .label-status").text();

			const novel = {
				id,
				slug,
				title,
				image: this.baseUrl + image,
				authors,
				categories,
				description,
				numChapters: parseInt(numChapters),
				status,
			};

			return novel;
		} catch (error) {
			throw error;
		}
	}

	async getChapterContent(novelSlug, chapterSlug) {
		try {
			const response = await axios.get(`${this.baseUrl}/${novelSlug}/${chapterSlug}`);
			const html = response.data;
			const $ = load(html);

			const title = $(".current-chapter a").text();
			const content = $(".truyen").html();

			let nextId = $(".chapter_control .next").attr("href");
			if (nextId !== "#") nextId = nextId.split("/")[2];

			let prevId = $(".chapter_control .back").attr("href");
			if (prevId !== "#") prevId = prevId.split("/")[2];

			return { slug: chapterSlug, title, content, nextId, prevId };
		} catch (error) {
			throw error;
		}
	}
}

export default MeTruyenChuStrategy;
