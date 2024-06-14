import fs from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import path from "path";
import jest from "jest";
import NovelStrategy from "../source-plugins/plugin-interface.js";
const { runCLI } = jest;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// the error of a chapter position in different sources
// be used to fetch the previous pages and next pages (the number of pages is specific) of the calculated page just in case. These are be able to contain the target chapter.
// Eg: novel 'Ngạo thế đan thần' in MêTruyệnChữ has chapter 0 but the others do not.
const pageErrorBetweenSources = 0;

class NovelFetcher {
	constructor() {
		this.strategies = {};
	}

	async loadStrategies() {
		const pluginsPath = path.join(__dirname, "../source-plugins");
		const pluginFiles = fs.readdirSync(pluginsPath);
		this.strategies = {};

		for (const file of pluginFiles) {
			if (file.endsWith("plugin.js")) {
				const pluginPath = path.join(pluginsPath, file);
				await this.loadStrategyWithPath(pluginPath);
			}
		}
	}

	async loadStrategyWithPath(pluginPath) {
		let pluginURL = pathToFileURL(pluginPath).href;
		pluginURL = `${pluginURL}?update=${Date.now()}`;
		try {
			const { default: StrategyClass } = await import(pluginURL);
			if (StrategyClass.prototype instanceof NovelStrategy) {
				const name = path.basename(pluginPath, "-plugin.js");
				this.strategies[name] = new StrategyClass();
				console.log(`Strategy '${name}' loaded successfully.`);
			} else {
				console.warn(`Strategy in '${pluginPath}' does not extend NovelStrategy and was not loaded.`);
			}
		} catch (error) {
			console.error(`Failed to load strategy from '${pluginPath}':`, error);
		}
	}

	removeStrategy(strategyName) {
		if (this.strategies[strategyName]) {
			delete this.strategies[strategyName];
			console.log(`Strategy '${strategyName}' has been removed.`);
		}
	}

	getAvailableStrategies() {
		return Object.keys(this.strategies).map((strategyName) => {
			return {
				slug: strategyName,
				baseUrl: this.strategies[strategyName].baseUrl,
				name: this.strategies[strategyName].name,
				logo: this.strategies[strategyName].thumbnail,
			};
		});
	}

	async fetchCategories(strategyName) {
		const strategy = this.strategies[strategyName];
		if (!strategy || typeof strategy.getCategories != "function") {
			throw new Error(`Strategy '${strategyName}' not found.`);
		}
		try {
			const categories = await strategy.getCategories();
			return {
				source: strategyName,
				data: categories,
			};
		} catch (error) {
			throw error;
		}
	}

	async fetchNovels(strategyName, keyword, page) {
		const strategy = this.strategies[strategyName];
		if (!strategy || !typeof strategy.searchNovels === "function") {
			throw new Error(`Strategy '${strategyName}' not found.`);
		}
		try {
			const novels = await strategy.searchNovels(keyword, page);
			return {
				source: strategyName,
				data: novels,
			};
		} catch (error) {
			throw error;
		}
	}

	async fetchHotNovels(strategyName) {
		const strategy = this.strategies[strategyName];
		if (!strategy || typeof strategy.getHotNovels != "function") {
			throw new Error(`Strategy '${strategyName}' not found.`);
		}
		try {
			const hotNovels = await strategy.getHotNovels();
			return {
				source: strategyName,
				data: hotNovels,
			};
		} catch (error) {
			throw error;
		}
	}

	async fetchNovelsByCategory(strategyName, categorySlug, page) {
		const strategy = this.strategies[strategyName];
		if (!strategy || typeof strategy.getNovelsByCategory != "function") {
			throw new Error(`Strategy '${strategyName}' not found.`);
		}
		try {
			const novels = await strategy.getNovelsByCategory(categorySlug, page);
			return {
				source: strategyName,
				data: novels,
			};
		} catch (error) {
			throw error;
		}
	}

	async fetchNovelByTitle(strategyName, novelSlug) {
		const strategy = this.strategies[strategyName];
		if (!strategy || typeof strategy.getNovelBySlug != "function") {
			throw new Error(`Strategy '${strategyName}' not found.`);
		}
		try {
			const novelInfo = await strategy.getNovelBySlug(novelSlug);
			return {
				source: strategyName,
				data: novelInfo,
			};
		} catch (error) {
			throw error;
		}
	}

	async fetchNovelChapterList(strategyName, novelSlug, page) {
		const strategy = this.strategies[strategyName];
		if (!strategy || typeof strategy.getNovelChapterList != "function") {
			throw new Error(`Strategy '${strategyName}' not found.`);
		}
		try {
			const chapters = await strategy.getNovelChapterList(novelSlug, page);
			return {
				source: strategyName,
				data: chapters,
			};
		} catch (error) {
			throw error;
		}
	}

	async fetchChapterContent(strategyName, novelSlug, chapterSlug) {
		const strategy = this.strategies[strategyName];
		if (!strategy || typeof strategy.getChapterContent != "function") {
			throw new Error(`Strategy '${strategyName}' not found.`);
		}
		try {
			const chapterContent = await strategy.getChapterContent(novelSlug, chapterSlug);
			return {
				source: strategyName,
				data: chapterContent,
			};
		} catch (error) {
			throw error;
		}
	}

	async fetchAlternativeNovels(currentStrategy, novelSlug, title) {
		try {
			title = title.toLowerCase();

			// get novel of current strategy for double checking
			const sourceNovel = await this.strategies[currentStrategy].getNovelBySlug(novelSlug);

			const alternatives = [];
			for (const strategyName in this.strategies) {
				if (strategyName === currentStrategy) continue;

				const strategy = this.strategies[strategyName];
				if (typeof strategy.getNovelBySlug === "function") {
					// First try to fetch novel by slug
					// If not found, search by title
					let novel;
					try {
						novel = await strategy.getNovelBySlug(novelSlug);
					} catch (error) {
						console.log(`Error fetching novel by slug ${novelSlug} from ${strategyName}`);
						// just find in the first page of search results
						const searchedNovels = (await strategy.searchNovels(title)).novels;

						// find the novel has the same title or contains the title
						const candidateNovels = searchedNovels.filter((novel) => {
							const searchedTitle = novel.title.toLowerCase();
							return (
								searchedTitle === title ||
								searchedTitle.includes(title) ||
								title.includes(searchedTitle)
							);
						});

						// double check by compare absolute difference of number of chapters
						let temp_min = 1000000;
						candidateNovels.forEach((candidateNovel) => {
							if (Math.abs(candidateNovel.numChapters - sourceNovel.numChapters) < temp_min) {
								temp_min = Math.abs(candidateNovel.numChapters - sourceNovel.numChapters);
								novel = candidateNovel;
							}
						});
					}

					if (novel) {
						alternatives.push({
							source: strategyName,
							data: novel,
						});
					}
				}
			}

			return alternatives;
		} catch (error) {
			throw error;
		}
	}

	async fetchAlternativeChapter(targetStrategy, targetNovelSlug, chapterSlug, chapterTitle, chapterPosition) {
		// targetStrategy, targeNovelSlug in the same source that has alternative chapters
		// chapterSlug, chapterTitle, chapterPosition in the current source
		// NOTE: the targetStrategy and targetSource are available (normally use fetchAlternativeNovels to get them)

		chapterPosition = parseInt(chapterPosition);
		try {
			chapterTitle = chapterTitle.toLowerCase();

			// check if the target strategy exists
			const strategy = this.strategies[targetStrategy];
			if (
				!strategy ||
				typeof strategy.getNovelBySlug != "function" ||
				typeof strategy.getNovelChapterList != "function"
			) {
				throw new Error(`Strategy '${targetStrategy}' not found.`);
			}

			// check if the target novel exists, if not, return null
			let targetNovel;
			try {
				targetNovel = await strategy.getNovelBySlug(targetNovelSlug);
			} catch (error) {
				console.log(`Novel '${targetNovelSlug}' not found in '${targetStrategy}'.`);
				return null;
			}

			let targetChapter;
			// check the chapter slug first, regardless of chapter
			try {
				targetChapter = await strategy.getChapterContent(targetNovelSlug, chapterSlug);
				return {
					title: targetChapter.title,
					slug: targetChapter.slug,
					position: chapterPosition, // not correct position but it is most likely to be correct
				};
			} catch (error) {
				console.log(`Chapter '${chapterSlug}' not found in '${targetNovelSlug}' of '${targetStrategy}'.`);
			}

			// get chapters in the page that is most likely to contain the target chapter
			let targetChapters;
			let targetPage = Math.ceil(chapterPosition / strategy.maxNumChaptersPerPage);
			if (!targetChapter) {
				console.log(`Searching for chapter '${chapterTitle}' in page ${targetPage} in '${targetNovelSlug}' of '${targetStrategy}`);
				targetChapters = (await strategy.getNovelChapterList(targetNovelSlug, targetPage)).chapters;
				targetChapter = targetChapters.find((chapter) => {
					const searchedTitle = chapter.title.toLowerCase();
					return (
						searchedTitle === chapterTitle ||
						searchedTitle.includes(chapterTitle) ||
						chapterTitle.includes(searchedTitle)
					);
				});
			}

			// if the target chapter is not found in the current page, fetch the previous and next pages just in case
			if (!targetChapter) {
				console.log("Chapter not found in the current page. Fetching previous and next pages.");

				const mostPrevPage = Math.max(1, targetPage - pageErrorBetweenSources);
				const mostNextPage = targetPage + pageErrorBetweenSources; // todo: error handling when mostNextPage > total_pages

				let allChapters = [];
				for (let page = mostPrevPage; page <= mostNextPage; page++) {
					if (page === targetPage) continue;
					const chapters = (await strategy.getNovelChapterList(targetNovelSlug, page)).chapters;
					allChapters = allChapters.concat(chapters);
				}

				targetChapter = allChapters.find((chapter) => {
					const searchedTitle = chapter.title.toLowerCase();
					return (
						searchedTitle === chapterTitle ||
						searchedTitle.includes(chapterTitle) ||
						chapterTitle.includes(searchedTitle)
					);
				});
			}

			// if not found again, return the chapter in relative position
			if (!targetChapter) {
				console.log("Chapter not found in pages nearby. Returning chapter in relative position.");
				targetChapter = targetChapters.find((chapter, index) => {
					return index + 1 === chapterPosition % strategy.maxNumChaptersPerPage;
				});
			}

			return targetChapter;
		} catch (error) {
			throw error;
		}
	}

	async testPlugin(pluginPath) {
		const pluginFileName = path.basename(pluginPath);

		// create test file for each plugin and write test code on it
		const testCode = `import runPluginTest from './source-plugins-tester.js';\nimport Plugin from '../source-plugins/${pluginFileName}';\nrunPluginTest(new Plugin(), '${pluginFileName}');`;
		const testPath = path.join(__dirname, `../test-plugins/${pluginFileName.replace(".js", ".test.js")}`);
		fs.writeFileSync(testPath, testCode);

		// run test only this plugin
		console.log(`Testing plugin ${testPath}`);
		const result = await runCLI(
			{
				silent: true,
				testMatch: [testPath],
			},
			[path.join(__dirname, `../`)]
		);

		// clean up test file
		fs.unlinkSync(testPath);

		return result.results.success;
	}
}

export default NovelFetcher;