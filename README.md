# API nguồn truyện
## Một số thông tin
- Sử dụng ESM thay cho CommonJS đối với nodejs server.
- Port server: **4000**.
- Hiện tại sử dụng `chokidar` để watch folder `source-plugins`, cho phép thêm xóa các file plugin mà không cần restart lại server.
- Các nguồn truyện hiện có: Truyện Full (*truyenfull*) (sẽ update các nguồn truyện của Phúc vào).
## Hướng dẫn sử dụng
### Run the server
```
npm install
npm start
```
### Api
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
Danh sách chương của một truyện:
```
http://localhost:4000/api/:source/novels/:slug/chapters
```
Nội dung chương:
```
http://localhost:4000/api/:source/novels/:slug/chapters/:chapterId
```
*Chú thích*:\
`source`: tên nguồn viết liền không dấu (vd: truyenfull).\
`slug`: tên truyện viết thường không dấu, thay dấu cách bằng `-` (vd: ngao-the-dan-than).
## TODO
- [ ] Xem xét thêm list truyện mới cập nhật, truyện theo trạng thái...
- [ ] Thêm các nguồn truyện khác: metruyenchu, tangthuvien.
- [ ] Thêm test cho các plugin được thêm vào?
- [ ] Viết cơ chế thông báo cho frontend về cập nhật.
- [ ] Thêm model để tạo cấu trúc cho dữ liệu trả về?
- [ ] Xử lí lỗi.
- [ ] Cơ chế Export.