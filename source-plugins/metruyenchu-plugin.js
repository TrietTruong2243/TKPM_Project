import NovelStrategy from "./plugin-interface.js";
import { load } from "cheerio";
import axios from "axios";

class MeTruyenChuStrategy extends NovelStrategy {
	constructor() {
		super("https://metruyenchu.com.vn", "Mê Truyện Chữ", "https://metruyenchu.com.vn/images/logo.png", 20, 100);
		this.hotNovelsPath = "get/hotbook";
		this.listChapPath = "get/listchap";
	}

	async getCategories() {
		try {
			const response = await axios.get(this.baseUrl);
			let html = response.data;
			let $ = load(html);

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
			page = parseInt(page);
			if (page < 1 || isNaN(page)) page = 1;
			const response = await axios.get(`${this.baseUrl}/search?q=${keywords}&page=${page}`);
			const html = response.data;
			const $ = load(html);
			const novels = [];

			// check if there is no result
			if ($(".title-list p").text().includes("Không có kết quả nào được tìm thấy.")) {
				return {
					meta: {
						total: 0,
						current_page: 1,
						per_page: 0,
						total_pages: 1,
					},
					novels,
				};
			}

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

				const numChapters = $(element).find(".line").eq(2).text().replace("Số chương::", "").trim();

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

			const totalNovels = $(".title-list p").text().match(/\d+/)[0];
			let lastPage = $(".phan-trang a").last();
			if (lastPage.text() === "❭") lastPage = lastPage.prev();
			const totalPages = parseInt(lastPage.text());
			if (page > totalPages) page = 1; // if page is out of range, redirect the first page, will update to get the last page

			return {
				meta: {
					total: parseInt(totalNovels),
					current_page: parseInt(page),
					per_page: this.maxNovelsPerPage,
					total_pages: totalPages,
				},
				novels,
			};
		} catch (error) {
			throw error;
		}
	}

	async getNovelsByCategory(categorySlug, page = 1) {
		try {
			page = parseInt(page);
			if (page < 1 || isNaN(page)) page = 1;
			// if the page is out of range, the connection will be failed with 404 error
			// so we check if the connection fails, we will return the first page
			// update to get the last page
			let response;
			try {
				response = await axios.get(`${this.baseUrl}/the-loai/${categorySlug}?page=${page}`);
			} catch (error) {
				// check error status
				if (error.response.status === 404) {
					page = 1;
					response = await axios.get(`${this.baseUrl}/the-loai/${categorySlug}?page=${page}`);
				} else {
					throw error;
				}
			}
			const html = response.data;
			let $ = load(html);

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

				const numChapters = $(element).find(".line").eq(2).text().replace("Số chương::", "").trim();

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

			const per_page = this.maxNovelsPerPage;
			let total = per_page;
			let total_pages = 1;

			let hasNextPage = $(".phan-trang").length > 0;
			let currentPage = page,
				nextPage,
				nextHtml;
			while (hasNextPage) {
				if ($(".phan-trang .btn-page").last().text().includes("❭")) {
					// currentPage++;
					currentPage = parseInt($(".phan-trang .btn-page").last().prev().text());
				} else {
					hasNextPage = false;
					total_pages = parseInt($(".phan-trang .btn-page").last().text());
					total = $(".truyen-list .item").length; // assign total with last page
				}

				nextPage = await axios.get(`${this.baseUrl}/the-loai/${categorySlug}?page=${currentPage}`);
				nextHtml = nextPage.data;
				$ = load(nextHtml);
				// total += $(".truyen-list .item").length;
				// await new Promise(resolve => setTimeout(resolve, 100)); // delay to prevent getting blocked
			}

			total += (total_pages - 1) * per_page;

			return {
				meta: {
					total,
					current_page: page,
					per_page,
					total_pages,
				},
				novels,
			};
		} catch (error) {
			throw error;
		}
	}

	async getNovelChapterList(slug, page = 1) {
		try {
			page = parseInt(page);
			if (page < 1 || isNaN(page)) page = 1;
			const novel = await this.getNovelBySlug(slug);

			const response = await axios.get(`${this.baseUrl}/${this.listChapPath}/${novel.id}?page=${page}`);
			const html = response.data;
			const $ = load(html.data);

			const chapters = [];
			$("ul li").each((index, chapter) => {
				const title = $(chapter).find("a").text();
				const chapterSlug = $(chapter).find("a").attr("href").split("/")[2];
				chapters.push({ title, slug: chapterSlug });
			});

			let total_pages = 1;
			const lastElement = $(".paging a").last();
			if (lastElement.length > 0) {
				if(lastElement.hasClass('active')){
					total_pages = parseInt(lastElement.text());
				} else if (lastElement.text().includes('Cuối')){
					const onclickFuncStr = lastElement.attr('onclick');
					const lastPage = onclickFuncStr.match(/\((\d+),(\d+)\)/)[1];
					total_pages = parseInt(lastPage);
				} else if (lastElement.text().includes('›')) {
					total_pages = parseInt(lastElement.prev().text());
				}
			}

			// if page is out of range, currently it returns the first page, update to get the last page
			if (page > total_pages) page = 1;

			chapters.forEach((chapter, index) => {
				chapter.position = index + (page - 1) * this.maxNumChaptersPerPage + 1;
			});

			return {
				meta: {
					total: novel.numChapters,
					current_page: page,
					per_page: this.maxNumChapterPerPage,
					total_pages,
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
			// Metruyenchu will redirect to home page if the slug is not found => check if the page is home page
			if (
				$(".wrap .container").eq(0).text().trim() == "MeTruyenChu - Đọc Truyện Chữ Miễn Phí, Không Quảng Cáo!!!"
			) {
				return null;
			}

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

			const numChapters = $(".mLeftCol .book-info-text li").eq(2).text().replace("Số chương:", "").trim();

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

			return {
				slug: chapterSlug,
				title,
				content,
				next_slug: nextId,
				prev_slug: prevId,
			};
		} catch (error) {
			throw error;
		}
	}
}

export default MeTruyenChuStrategy;
