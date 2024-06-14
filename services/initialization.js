import DownloaderFetcher from "./downloader-fetcher.js";
import NovelFetcher from "./novel-fetcher.js";

const novelFetcher = new NovelFetcher();
const downloaderFetcher = new DownloaderFetcher();
await novelFetcher.loadStrategies();
await downloaderFetcher.loadStrategies();

export { novelFetcher, downloaderFetcher }