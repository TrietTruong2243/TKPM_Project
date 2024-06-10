# API nguồn truyện

## Một số thông tin

-   Sử dụng ESM thay cho CommonJS đối với nodejs server.
-   Port server: **4000**.
-   Hiện tại sử dụng `chokidar` để watch folder `source-plugins`, cho phép thêm xóa các file plugin mà không cần restart lại server.
-   Các nguồn truyện hiện có: Truyện Full (_truyenfull_), Mê Truyện Chữ (_metruyenchu_), Tàng Thư Viện (_tangthuvien_)
-   Dùng hàm `convertNameToSlug` khi không còn cách nào khác, còn lại đều parse từ trang gốc.
-   Danh sách truyện theo thể loại của _truyenfull_ không lấy được danh sách thể loại với tổng số chương.

## Hướng dẫn sử dụng

### Run the server

```
npm install
npm start
```

### Api

Thông tin tất cả các nguồn:

```
http://localhost:4000/api/sources
```

Tất cả thể loại:

```
http://localhost:4000/api/:source/categories
```

Truyện hot:

```
http://localhost:4000/api/:source/novels/hot
```

Thông tin một truyện:

```
http://localhost:4000/api/:source/novels/:slug
```

Tìm truyện:

```
http://localhost:4000/api/:source/novels/search?keyword=_&page=_
```

Danh sách truyện theo thể loại:

```
http://localhost:4000/api/:source/categories/:categorySlug
```

Danh sách chương của một truyện:

```
http://localhost:4000/api/:source/novels/:slug/chapters?page=_
```

Nội dung chương:

```
http://localhost:4000/api/:source/novels/:slug/chapters/:chapterSlug
```

Export ra file theo định dạng:

```
http://localhost:4000/api/:source/download/:format/:novelSlug/:chapterSlug
```

_Chú thích_:\
`source`: tên nguồn viết liền không dấu (vd: truyenfull).\
`slug`: tên truyện viết thường không dấu, thay dấu cách bằng `-` (vd: ngao-the-dan-than).
`format`: định dạng file cần xuất

## TODO

-   [ ] <span style="color:red">Hiện tại đang phụ thuộc vào id truyện và id chương từ nguồn, nếu nguồn không chứa các id? --> lấy nội dung truyện bằng url (slug)? --> chuyển id về biến cục bộ nếu được</span>
-   [ ] Lấy id của cùng một chương truyện ở nhiều nguồn rồi trả về? Xử lý mâu thuẫn?
-   [ ] Xem xét thêm list truyện mới cập nhật, truyện theo trạng thái...
-   [x] Thêm các nguồn truyện khác: metruyenchu, tangthuvien.
-   [ ] Thêm test cho các plugin được thêm vào?
-   [ ] Thêm model để tạo cấu trúc cho dữ liệu trả về?
-   [ ] Xử lí lỗi.
-   [ ] Cơ chế Export.
-   [ ] Xử lí các trường hợp đặc biệt ko lấy được slug của category ở TangThuVien (Ngôn Tình, Tất cả)
-   [ ] Hot novels của TangThuVien không cung cấp image => Cân nhắc lấy image dựa vào slug => Chậm
-   [ ] Cài đặt getNovelsByCategory, getNovelsByAuthor
