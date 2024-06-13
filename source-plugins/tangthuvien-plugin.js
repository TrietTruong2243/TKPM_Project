import NovelStrategy from "./plugin-interface.js";
import { load } from "cheerio";
import axios from "axios";

class TangThuVienStrategy extends NovelStrategy {
	constructor() {
		super(
			"https://truyen.tangthuvien.vn",
			"Tàng Thư Viện",
			"https://truyen.tangthuvien.vn/images/logo-web.png",
			20,
			75
		);
	}

	async getCategories() {
		try {
			const response = await axios.get(this.baseUrl);
			const html = response.data;
			const $ = load(html);

			const categories = [];
			$("#classify-list a").each(async (index, element) => {
				const categoryName = $(element).find(".info i").text();
				const categorySlug = $(element).attr("href").replace(`${this.baseUrl}/the-loai/`, "");

				if (categorySlug.indexOf("https") != 0) {
					categories.push({ name: categoryName, slug: categorySlug });
				}
			});

			return categories;
		} catch (error) {
			throw error;
		}
	}

	// TODO: danh sách truyện hot của tangthuvien ko có image, cân nhắc lấy image theo slug => ko load nhanh được
	async getHotNovels() {
		try {
			const response = await axios.get(this.baseUrl);
			const html = response.data;
			const $ = load(html);

			const hotNovels = [];
			const hotNovelsList = $("#rank-list-row .rank-list").eq(1);

			$(hotNovelsList)
				.find(".unfold .book-info")
				.each((index, element) => {
					const title = $(element).find("h4 a").text();
					const slug = $(element).find("h4 a").attr("href").replace(`${this.baseUrl}/doc-truyen/`, "");

					const novel = { title, slug, image: null };
					hotNovels.push(novel);
				});

			$(hotNovelsList)
				.find(".name-box")
				.each((index, element) => {
					const title = $(element).find(".name").text().trim();
					const slug = $(element).find(".name").attr("href").replace(`${this.baseUrl}/doc-truyen/`, "");

					const novel = { title, slug, image: null };
					hotNovels.push(novel);
				});

			return hotNovels;
		} catch (error) {
			throw error;
		}
	}

	async searchNovels(keyword, page = 1) {
		try {
			page = parseInt(page);
			if (page < 1 || isNaN(page)) page = 1;
			const response = await axios.get(`${this.baseUrl}/ket-qua-tim-kiem?term=${keyword}&page=${page}`);
			const html = response.data;
			const $ = load(html);
			const novels = [];

			// check if there is no result
			// if page is out of range, the result is also empty like this but having pagination
			const firstElement = $("#rank-view-list li").eq(0).children("p");
			if (
				$(firstElement).length > 0 &&
				$(firstElement).text().trim() == "Không tìm thấy truyện nào theo yêu cầu"
			) {
				// check pagination
				if ($("ul.pagination").length > 0) {
					const lastPage = parseInt($("ul.pagination li").last().prev().text());
					return this.searchNovels(keyword, lastPage);
				}

				return {
					meta: {
						total: 0,
						per_page: 0,
						current_page: 1,
						total_pages: 1,
					},
					novels,
				};
			}

			$("#rank-view-list li").each((index, element) => {
				const slug = $(element)
					.find(".book-mid-info h4 a")
					.attr("href")
					.replace(`${this.baseUrl}/doc-truyen/`, "");
				const title = $(element).find(".book-mid-info h4 a").text();
				const image = $(element).find(".book-img-box img").attr("src");

				const authors = [];
				$(element)
					.find(".author a")
					.eq(0)
					.each((index, ele) => {
						const authorName = $(ele).text();
						const authorSlug = $(ele).attr("href").replace(`${this.baseUrl}/tac-gia?author=`, "");
						authors.push({ name: authorName, slug: authorSlug });
					});

				const categories = [];
				$(element)
					.find(".author a")
					.eq(1)
					.each((index, ele) => {
						const categoryName = $(ele).text();
						const categorySlug = $(ele).attr("href").replace(`${this.baseUrl}/the-loai/`, "");
						categories.push({ name: categoryName, slug: categorySlug });
					});

				const numChapters = parseInt($(element).find(".author span span").text());
				const status = $(element).find(".author span").eq(0).text();

				const novel = {
					slug,
					title,
					image,
					authors,
					categories,
					numChapters,
					status,
				};

				novels.push(novel);
			});

			const per_page = this.maxNovelsPerPage;
			let total = novels.length;
			let total_pages = 1;
			if ($("ul.pagination").length > 0) {
				total_pages = parseInt($("ul.pagination li").last().prev().text());

				const responseFromLastPage = await axios.get(
					`${this.baseUrl}/ket-qua-tim-kiem?term=${keyword}&page=${total_pages}`
				);
				const $lastPage = load(responseFromLastPage.data);
				const lastPageLength = $lastPage("#rank-view-list li").length;

				total = (total_pages - 1) * per_page + lastPageLength;
			}

			return {
				meta: {
					total,
					per_page,
					current_page: page,
					total_pages,
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
			const categoryId = await this.getCategoryIdBySlug(categorySlug);

			let response = await axios.get(`${this.baseUrl}/tong-hop?ctg=${categoryId}&page=${page}`);
			let html = response.data;
			let $ = load(html);
			const novels = [];

			// if page is out of range, the result is empty but having pagination
			const firstElement = $("#rank-view-list li").eq(0).children("p");
			if (
				$(firstElement).length > 0 &&
				$(firstElement).text().trim() == "Không tìm thấy truyện nào theo yêu cầu"
			) {
				// check pagination
				if ($("ul.pagination").length > 0) {
					const lastPage = parseInt($("ul.pagination li").last().prev().text());
					return this.getNovelsByCategory(categorySlug, lastPage);
				} else
					return {
						meta: {
							total: 0,
							per_page: 0,
							current_page: 1,
							total_pages: 1,
						},
						novels,
					};
			}

			$(".book-img-text ul li").each((index, element) => {
				const slug = $(element)
					.find(".book-mid-info h4 a")
					.attr("href")
					.replace(`${this.baseUrl}/doc-truyen/`, "");
				const title = $(element).find(".book-mid-info h4 a").text();
				const image = $(element).find(".book-img-box img").attr("src");

				const authors = [];
				$(element)
					.find(".author")
					.each((i, ele) => {
						const authorName = $(ele).find(".name").text();
						const authorSlug = $(ele)
							.find(".name")
							.attr("href")
							.replace(`${this.baseUrl}/tac-gia?author=`, "");
						const author = { name: authorName, slug: authorSlug };
						authors.push(author);
					});

				const categories = [];
				$(element)
					.find(".author")
					.each((i, ele) => {
						const categoryName = $(ele).find("a").eq(1).text();
						const categorySlug = $(ele)
							.find("a")
							.eq(1)
							.attr("href")
							.replace(`${this.baseUrl}/the-loai/`, "");
						const category = { name: categoryName, slug: categorySlug };
						categories.push(category);
					});

				const numChapters = $(element).find("span span").text();

				const status = $(element).find(".book-mid-info .author span").eq(0).text();

				novels.push({
					slug,
					title,
					image,
					authors,
					categories,
					numChapters: parseInt(numChapters),
					status,
				});
			});

			const per_page = this.maxNovelsPerPage;
			let total = novels.length;
			let total_pages = 1;
			if ($("ul.pagination").length > 0) {
				total_pages = parseInt($("ul.pagination li").last().prev().text());
				response = await axios.get(`${this.baseUrl}/tong-hop?ctg=${categoryId}&page=${total_pages}`);
				$ = load(response.data);
				const lastPageLength = $(".book-img-text ul li").length;
				total = (total_pages - 1) * per_page + lastPageLength;
			}

			return {
				meta: {
					total,
					per_page,
					current_page: page,
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
			const response = await axios.get(
				`${this.baseUrl}/doc-truyen/page/${novel.id}?page=${page - 1}&limit=75&web=1`
			);
			const html = response.data;
			const $ = load(html);
			const chapters = [];

			// check if page is out of range
			// if page is out of range, the result is empty but having pagination
			if ($("ul.cf li").length == 0) {
				// check pagination
				if ($("ul.pagination").length > 0) {
					const lastPage = parseInt($("ul.pagination li").last().text());
					return this.getNovelChapterList(slug, lastPage);
				} else
					return {
						meta: {
							total: 0,
							per_page: 0,
							current_page: 1,
							total_pages: 1,
						},
						chapters,
					};
			}

			$("ul.cf li").each((index, chapter) => {
				if ($(chapter).hasClass('divider-chap')) return;
				let title = $(chapter).find("a").attr("title");

				if (title) {
					const urlParams = $(chapter).find("a").attr("href").split("/");
					const slug = urlParams[urlParams.length - 1];
					if (title !== "Chương 0 : Viết ở phía trước") {
						if (title.includes(" : ")) title = title.replace(" : ", ": ");
						chapters.push({ title, slug });
					}
				}
			});

			const per_page = this.maxNumChaptersPerPage;
			let total = chapters.length;
			let total_pages = 1;
			const lastElement = $(".pagination li").last();
			if (lastElement.text().trim() == "»") {
				total_pages = parseInt(lastElement.prev().text());
			} else if (lastElement.text().trim() == "Trang cuối") {
				const funcContainsPage = lastElement.find('a').attr('onclick');
				if (funcContainsPage) {
					const page = funcContainsPage.match(/\d+/);
					if (page) total_pages = parseInt(page[0]) + 1;
				}
			} else if (lastElement.hasClass("active")) {
				total_pages = parseInt(lastElement.text());
			}

			// get number of chapters from last page
			if (total_pages > 1) {
				const lastPageResponse = await axios.get(
					`${this.baseUrl}/doc-truyen/page/${novel.id}?page=${total_pages - 1}&limit=75&web=1`
				);
				const $$ = load(lastPageResponse.data);
				const lastPageChapters = $$("ul.cf li").filter((index, chapter) => { return !$(chapter).hasClass('divider-chap') }).length;
				total = (total_pages - 1) * per_page + lastPageChapters;
			}

			// assign chapter position
			chapters.forEach((chapter, index) => {
				chapter.position = index + (page - 1) * per_page + 1;
			});

			return {
				meta: {
					total,
					current_page: page,
					per_page,
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
			const response = await axios.get(`${this.baseUrl}/doc-truyen/${slug}`);
			const html = response.data;
			const $ = load(html);

			const id = $(".volume #story_id_hidden").val();
			const title = $(".book-info h1").text();

			const rawDescHtml = $(".book-intro").html();
			const underscoreIndex = rawDescHtml.indexOf("______________________________");

			let description;
			if (underscoreIndex !== -1) {
				description = rawDescHtml.substring(0, underscoreIndex);
			} else {
				description = rawDescHtml;
			}

			const image = $("#bookImg img").attr("src");

			const authors = [];
			$(".author-info").each((index, element) => {
				const authorElement = $(element).find("#authorId p a");
				const authorSlug = authorElement.attr("href").replace(`${this.baseUrl}/tac-gia?author=`, "");
				const authorName = authorElement.text();

				const author = { name: authorName, slug: authorSlug };
				authors.push(author);
			});

			const categories = [];
			$(".book-info .tag a.red").each((index, element) => {
				const categoryName = $(element).text();
				const categorySlug = $(element).attr("href").replace(`${this.baseUrl}/the-loai`, "");
				categories.push({ categoryName, categorySlug });
			});

			const numChapters = $(".nav-wrap.fl ul li")
				.eq(1)
				.find("a")
				.text()
				.replace("Danh sách chương (", "")
				.replace(" chương)", "");

			const status = $(".book-info .tag span.blue").text();

			const novel = {
				id,
				slug,
				title,
				image,
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
			const response = await axios.get(`${this.baseUrl}/doc-truyen/${novelSlug}/${chapterSlug}`);
			const html = response.data;
			const $ = load(html);

			const title = $(".content h2").text();
			const content = $(".chapter-c-content .box-chap").text();

			const chapId = $(".box-chap").attr("class").split(/\s+/)[1].replace("box-chap-", "");
			const storyId = $(".box-report").find("input[name='story_id']").val();

			const chapterListResp = await axios.get(
				`${this.baseUrl}/story/chapters?story_id=${storyId}&chapter_id=${chapId}`
			);
			const $$ = load(chapterListResp.data);

			const currentId = parseInt($$("li.active").attr("title"));
			const total = parseInt($$("li:last").attr("title"));

			let nextId, prevId;

			if (currentId < total) {
				const urlPaths = $$(`.link-chap-${currentId + 1}`)
					.attr("href")
					.trim()
					.split("/");
				nextId = urlPaths[urlPaths.length - 1];
			} else {
				nextId = "#";
			}

			if (currentId > 1) {
				const urlPaths = $$(`.link-chap-${currentId - 1}`)
					.attr("href")
					.trim()
					.split("/");
				prevId = urlPaths[urlPaths.length - 1];
			} else {
				prevId = "#";
			}

			return { slug: chapterSlug, title, content, next_slug: nextId, prev_slug: prevId };
		} catch (error) {
			throw error;
		}
	}

	async getCategoryIdBySlug(categorySlug) {
		const categoryResponse = await axios.get(`${this.baseUrl}/the-loai/${categorySlug}`);
		let html = categoryResponse.data;
		let $ = load(html);

		const categoryId = $("#update-tab a").attr("href").split("ctg=")[1];
		return categoryId;
	}
}

export default TangThuVienStrategy;
