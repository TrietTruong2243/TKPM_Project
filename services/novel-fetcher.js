import fs from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';
import chokidar from 'chokidar';
import NovelStrategy from '../source-plugins/plugin-interface.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class NovelFetcher {
    constructor() {
        this.strategies = {};
    }

    async loadStrategies() {
        const pluginsPath = path.join(__dirname, '../source-plugins');
        const pluginFiles = fs.readdirSync(pluginsPath);
        this.strategies = {};

        for (const file of pluginFiles) {
            if (file.endsWith('plugin.js')) {
                const pluginPath = path.join(pluginsPath, file);
                await this.loadStrategyWithPath(pluginPath);
            }
        }
    }

    async loadStrategyWithPath(pluginPath) {
        const pluginURL = pathToFileURL(pluginPath).href;
        try {
            const { default: StrategyClass } = await import(pluginURL);
            if (StrategyClass.prototype instanceof NovelStrategy) {
                const name = path.basename(pluginPath, '-plugin.js');
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
        return Object.keys(this.strategies).map(strategyName => {
            return {
                slug: strategyName,
                baseUrl: this.strategies[strategyName].baseUrl,
                name: this.strategies[strategyName].name,
                logo: this.strategies[strategyName].thumbnail,
            };
        })
    }

    async fetchCategories(strategyName) {
        const strategy = this.strategies[strategyName];
        if (!strategy || !typeof strategy.getCategories === 'function') {
            throw new Error(`Strategy '${strategyName}' not found.`);
        }
        try {
            const categories = await strategy.getCategories();
            return {
                source: strategyName,
                categories
            };
        } catch (error) {
            throw error;
        }
    }

    async fetchNovels(strategyName, keyword, page){
        const strategy = this.strategies[strategyName];
        if (!strategy || !typeof strategy.searchNovels === 'function') {
            throw new Error(`Strategy '${strategyName}' not found.`);
        }
        try {
            const novels = await strategy.searchNovels(keyword, page);
            return {
                source: strategyName,
                novels
            };
        } catch (error) {
            throw error;
        }
    }

    async fetchHotNovels(strategyName) {
        const strategy = this.strategies[strategyName];
        if (!strategy || !typeof strategy.getHotNovels === 'function') {
            throw new Error(`Strategy '${strategyName}' not found.`);
        }
        try {
            const hotNovels = await strategy.getHotNovels();
            return {
                source: strategyName,
                hotNovels
            };
        } catch (error) {
            throw error;
        }
    }

    async fetchNovelsByCategory(strategyName, categorySlug, page) {
        const strategy = this.strategies[strategyName];
        if (!strategy || !typeof strategy.getNovelsByCategory === 'function') {
            throw new Error(`Strategy '${strategyName}' not found.`);
        }
        try {
            const novels = await strategy.getNovelsByCategory(categorySlug, page);
            return {
                source: strategyName,
                novels
            };
        } catch (error) {
            throw error;
        }
    }

    async fetchNovelByTitle(strategyName, novelSlug) {
        const strategy = this.strategies[strategyName];
        if (!strategy || !typeof strategy.getNovelBySlug === 'function') {
            throw new Error(`Strategy '${strategyName}' not found.`);
        }
        try {
            const novelInfo = await strategy.getNovelBySlug(novelSlug);
            return {
                source: strategyName,
                novelInfo
            };
        } catch (error) {
            throw error;
        }
    }

    async fetchNovelChapterList(strategyName, novelSlug, page) {
        const strategy = this.strategies[strategyName];
        if (!strategy || !typeof strategy.getNovelChapterList === 'function') {
            throw new Error(`Strategy '${strategyName}' not found.`);
        }
        try {
            const chapters = await strategy.getNovelChapterList(novelSlug, page);
            return {
                source: strategyName,
                chapters
            };
        } catch (error) {
            throw error;
        }
    }

    async fetchChapterContent(strategyName, novelSlug, chapterSlug) {
        const strategy = this.strategies[strategyName];
        if (!strategy || !typeof strategy.getChapterContent === 'function') {
            throw new Error(`Strategy '${strategyName}' not found.`);
        }
        try {
            const chapterContent = await strategy.getChapterContent(novelSlug, chapterSlug);
            return {
                source: strategyName,
                chapterContent
            };
        } catch (error) {
            throw error;
        }
    }

    watchPlugins(){
        const watcher = chokidar.watch(path.join(__dirname, '../source-plugins'), { persistent: true });
        watcher
            .on('add', pluginPath => {
                console.log(`File ${pluginPath} has been added`);
                if (pluginPath.endsWith('plugin.js')) {
                    this.loadStrategyWithPath(pluginPath);
                }
            })
            .on('change', pluginPath => {
                console.log(`File ${pluginPath} has been changed`);
                if (pluginPath.endsWith('plugin.js')) {
                    this.loadStrategyWithPath(pluginPath);
                }
            
            })
            .on('unlink', pluginPath => {
                console.log(`File ${pluginPath} has been removed`);
                if (pluginPath.endsWith('plugin.js')) {
                    const strategyName = path.basename(pluginPath, '-plugin.js');
                    this.removeStrategy(strategyName);
                }
            });

        novelFetcher.loadStrategies(); // initial load
    }
}

const novelFetcher = new NovelFetcher();
novelFetcher.watchPlugins();

export default novelFetcher;