# API lấy nguồn truyện và export

## Một số thông tin

- Port server: **4000**.
- Sử dụng `chokidar` để watch folder `source-plugins`, cho phép thêm, xóa, sửa các file plugin mà không cần restart lại server.
- Các nguồn truyện hiện có: Truyện Full (_truyenfull_), Mê Truyện Chữ (_metruyenchu_), Tàng Thư Viện (_tangthuvien_)
- Các thông tin trả về theo cùng 1 kiểu dữ liệu, những thông tin không lấy được cho kết quả null, vd:
  - Danh sách truyện theo thể loại của _truyenfull_ không lấy được danh sách thể loại với tổng số chương.
  - Hot novels _tangthuvien_ không có image.
- Về các route có tham số page, nếu page sai định dạng thì page = 1, nếu page lớn hơn tổng số trang thì page được chuyển về trang đầu hoặc trang cuối.
- Về logic lấy truyện ở các nguồn thay thế, duyệt từng nguồn và thực hiện các bước, bước đầu lỗi thì chuyển sang bước sau:
  - Thử slug của nguồn hiện tại.
  - Tìm kiếm theo tên, so sánh tên.
  - Nếu nhiều truyện cùng tên, chọn truyện có số chương gần với truyện hiện tại.
- Về logic lấy chương thay thế ở một nguồn xác định (nguồn đã được xác nhận có truyện thay thế), tương tự như trên:
  - Thử slug chương của nguồn hiện tại.
  - Tìm trong trang có khả năng nhất dựa vào vị trí của chương hiện tại.
  - Tìm 1-2 trang trước và sau.
  - Nếu không có truyện nào có tên khớp, lấy chương có vị trí giống chương hiện tại.
- Về test tự động, plugin khi được đưa vào thư mục source-plugins, file plugin sẽ được kiểm tra và tạo 1 file test tương ứng ở thư mục test-plugins, sau chạy test, file test đó được xóa.

## Hướng dẫn sử dụng

### Run the server

```
npm install
npm start
```

_Lưu ý_: Khi khởi động server, các plugin được mặc định là hợp lệ và load thẳng vào hệ thống, do đó nên test các plugin trước khi khởi động.

### Test

Test toàn bộ plugin đang có trong hệ thống.

```
npm test
```

Test toàn bộ source plugin đang có trong hệ thống.

```
npm run test:source
```
Test toàn bộ download plugin đang có trong hệ thống.

```
npm run test:download
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
`targetSource`, `targetNovelSlug` là của nguồn cần tìm (thông thường lấy từ api trên).\
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

- [x] Thêm model để tạo cấu trúc cho dữ liệu trả về? ==> skip.
- [x] Xử lí các trường hợp đặc biệt ko lấy được slug của category ở TangThuVien (Ngôn Tình, Tất cả) ==> skip.
- [x] Hot novels của TangThuVien không cung cấp image => Cân nhắc lấy image dựa vào slug => Chậm ==> dùng public image của front để thay thế.
