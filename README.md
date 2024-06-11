# API lấy nguồn truyện và export

## Một số thông tin

- Port server: **4000**.
- Sử dụng `chokidar` để watch folder `source-plugins`, cho phép thêm, xóa, sửa các file plugin mà không cần restart lại server.
- Các nguồn truyện hiện có: Truyện Full (_truyenfull_), Mê Truyện Chữ (_metruyenchu_), Tàng Thư Viện (_tangthuvien_)
- Các thông tin trả về theo cùng 1 kiểu dữ liệu, những thông tin không lấy được cho kết quả null, vd:
  - Danh sách truyện theo thể loại của _truyenfull_ không lấy được danh sách thể loại với tổng số chương.
  - Hot novels _tangthuvien_ không có image.

## Hướng dẫn sử dụng

### Run the server

```
npm install
npm start
```

### Test

```
npm test
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

Lấy thông tin novel thay thế trong tất cả các nguồn:\
`source`, `slug`, `title` là của novel nguồn hiện tại:

```
http://localhost:4000/api/sources/alternative-novels?source=_&slug=_&title=_
```

Lấy thông tin chapter thay thế trong một nguồn cụ thể:\
`targetSource`, `targetNovelSlug` là của nguồn cần tìm (thông thường lấy từ api trên).
`chapterSlug`, `chapterTitle`, `chapterPosition` là của nguồn hiện tại, dùng làm thông tin cho việc tìm kiếm.

```
http://localhost:4000/api/sources/alternative-chapters?targetSource=_&targetNovelSlug=_&chapterSlug=_&chapterTitle=_&chapterPosition=_
```

Lấy định dạng file hỗ trợ:

```
http://localhost:4000/api/:source/download
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
- [ ] Test plugin khi được thêm vào, pass test mới add vào hệ thống.
- [ ] Thêm model để tạo cấu trúc cho dữ liệu trả về?
- [x] Xử lí các trường hợp đặc biệt ko lấy được slug của category ở TangThuVien (Ngôn Tình, Tất cả) ==> skip.
- [x] Hot novels của TangThuVien không cung cấp image => Cân nhắc lấy image dựa vào slug => Chậm ==> dùng public image của front để thay thế.
