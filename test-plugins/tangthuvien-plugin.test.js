import TangThuVienStrategy from '../source-plugins/tangthuvien-plugin';


describe('Testing TangThuVien plugin', () => {
  let strategy;
  let categories;
  let bestNovel;
  let chapterList;
  strategy = new TangThuVienStrategy();

  test('getCategories is-array', async () => {
    const categories = await strategy.getCategories();
    expect(categories).toBeInstanceOf(Array);
  });


  test('getCategories not-empty', async () => {
    const categories = await strategy.getCategories();
    expect(categories.length).toBeGreaterThan(0);
  });

  test('getCategories check-properties-of-object', async () => {
    categories = await strategy.getCategories();
    expect(categories[0]).toHaveProperty('name');
    expect(categories[0]).toHaveProperty('slug');
  });

  test('getHotNovels is-array', async () => {
    const hotNovels = await strategy.getHotNovels();
    expect(hotNovels).toBeInstanceOf(Array);
  });

  test('getHotNovels not-empty', async () => {
    const hotNovels = await strategy.getHotNovels();
    expect(hotNovels.length).toBeGreaterThan(0);
  });

  test('getHotNovels check-properties-of-object', async () => {
    const hotNovels = await strategy.getHotNovels();
    bestNovel = hotNovels[0];
    expect(hotNovels[0]).toHaveProperty('title');
    // expect(hotNovels[0]).toHaveProperty('image');
    expect(hotNovels[0]).toHaveProperty('slug');

  });

  test('searchNovels novel-not-found', async () => {

    const result = await strategy.searchNovels('112313534672', 1);
    console.log(result)
    // expect(result.meta.total === 0);
    // expect(result).toHaveProperty('meta');
    expect(result).toHaveProperty('novels');
    expect(result.novels).toBeInstanceOf(Array);
  });

  test('searchNovels novel-found', async () => {
    const result = await strategy.searchNovels(bestNovel.title.slice(0,9), 1);
    expect(result.length).toBeGreaterThan(0);
    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toHaveProperty('slug');
    expect(result[0]).toHaveProperty('title');
    expect(result[0]).toHaveProperty('image');
    expect(result[0]).toHaveProperty('authors');
    expect(result[0]).toHaveProperty('categories');
    expect(result[0]).toHaveProperty('numChapters');
    expect(result[0]).toHaveProperty('status');
  });

  test('getNovelsByCategory check-properties-of-object', async () => {
    const result = await strategy.getNovelsByCategory("tien-hiep",2);
    expect(result).toHaveProperty('meta');
    expect(result.meta).toHaveProperty('total');
    expect(result.meta).toHaveProperty('current_page');
    expect(result.meta).toHaveProperty('per_page');
    expect(result.meta).toHaveProperty('total_pages');

    expect(result).toHaveProperty('novels');
    expect(result.novels).toBeInstanceOf(Array);
    expect(result.novels.length).toBeGreaterThan(0);
    expect(result.novels[0]).toHaveProperty('slug');
    expect(result.novels[0]).toHaveProperty('title');
    // expect(result.novels[0]).toHaveProperty('image');
    expect(result.novels[0]).toHaveProperty('authors');
    expect(result.novels[0]).toHaveProperty('categories');
    expect(result.novels[0]).toHaveProperty('numChapters');
    expect(result.novels[0]).toHaveProperty('status');

  });

  test('getNovelBySlug', async () => {
    const novel = await strategy.getNovelBySlug(bestNovel.slug);
    expect(novel).toHaveProperty('title');
    expect(novel).toHaveProperty('authors');
    expect(novel).toHaveProperty('categories');
    expect(novel).toHaveProperty('description');
    expect(novel).toHaveProperty('id');
    expect(novel).toHaveProperty('image');
    expect(novel).toHaveProperty('numChapters');
    expect(novel).toHaveProperty('slug');
    expect(novel).toHaveProperty('status');
    expect(novel).toHaveProperty('title');
  });

  test('getNovelChapterList', async () => {
    chapterList = await strategy.getNovelChapterList(bestNovel.slug, 1);
    expect(chapterList).toHaveProperty('meta');
    expect(chapterList).toHaveProperty('chapters');
  });

  test('getChapterContent', async () => {
    const i = 3
    let chapter = chapterList.chapters[i].slug
    chapter = await strategy.getChapterContent(bestNovel.slug, chapter);
    expect(chapter).toHaveProperty('title');
    expect(chapter).toHaveProperty('content');
    expect(chapter).toHaveProperty('nextId');
    expect(chapter).toHaveProperty('prevId');
    expect(chapter).toHaveProperty('slug');
  });
});
