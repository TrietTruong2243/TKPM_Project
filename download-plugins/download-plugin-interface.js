class DownLoaderStrategy {
	constructor(file_extension, image) {
		this.extension = file_extension;
		this.image = image;
	}

	async getBuffer(source, novel_slug, chapter_slug, novelFetcherInstance) {
		throw new Error("You need to implement getFile method!");
	}
}
export default DownLoaderStrategy;
