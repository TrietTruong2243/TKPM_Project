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
					const category = $(element).find("a").text();
					categories.push(category);
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
				const title = $(element).find("h3 a").text();
				const image = $(element).find("img").attr("src");

				const authors = [];
				$(element)
					.find(".line")
					.eq(0)
					.find("a")
					.each((index, ele) => {
						const author = $(ele).text();
						authors.push(author);
					});

				const categories = [];
				$(element)
					.find(".line")
					.eq(1)
					.find("a")
					.each((index, ele) => {
						const category = $(ele).text();
						categories.push(category);
					});

				const numChapters = $(element)
					.find(".line")
					.eq(2)
					.text()
					.replace("Số chương::", "")
					.trim();

				let status;
				const novel = {
					slug: convertNameToSlug(title),
					title,
					image: this.baseUrl + image,
					authors,
					categories,
					numChapters: parseInt(numChapters),
					status,
				};

				novels.push(novel);
			});

			return novels;
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
				const chapterId = $(chapter).find("a").attr("href").split("/")[2];
				chapters.push({ id: chapterId, title });
			});

			return {
				meta: {
					current_page: page,
					total: novel.numChapters,
					per_page: chapters.length,
					total_pages: 0,
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
					authors.push(authorName);
				});

			const categories = [];
			$(".li--genres a").each((index, genre) => {
				const genreName = $(genre).text();
				categories.push(genreName);
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

	async getChapterContent(slug, chapterId) {
		try {
			const response = await axios.get(`${this.baseUrl}/${slug}/${chapterId}`);
			const html = response.data;
			const $ = load(html);

			const title = $(".current-chapter a").text();
			const content = $(".truyen").html();

			let nextId = $(".chapter_control .next").attr("href");
			if (nextId !== "#") nextId = nextId.split("/")[2];

			let prevId = $(".chapter_control .back").attr("href");
			if (prevId !== "#") prevId = prevId.split("/")[2];

			return { id: chapterId, title, content, nextId, prevId };
		} catch (error) {
			throw error;
		}
	}
}

export default MeTruyenChuStrategy;
