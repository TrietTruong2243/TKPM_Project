class Novel {
    constructor(id, url, title, image, categories, description, author, numChapters, releaseDate, status, lastUpdated) {
        this.id = id; // id in source
        this.url = url;
        this.title = title;
        this.image = image;
        this.categories = categories;
        this.description = description;
        this.author = author;
        this.numChapters = numChapters;
        this.releaseDate = releaseDate;
        this.status = status;
        this.lastUpdated = lastUpdated;
    }
}

export default Novel;