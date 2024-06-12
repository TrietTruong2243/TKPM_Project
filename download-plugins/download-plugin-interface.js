class DownLoaderStrategy {
	static numImplemented = 0;
	constructor(file_extension, image) {
		this.extension = file_extension;
		this.image = image;
		DownLoaderStrategy.numImplemented++;
	}
	async getBuffer(source, novel_slug, chapter_slug, res) {
		throw new Error("You need to implement getFile method!");
	}
}
export default DownLoaderStrategy;
