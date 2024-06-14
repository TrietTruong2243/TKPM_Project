import axios from "axios";
async function getAllDownloadType(source) {
  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/${source}/download`
    );
    if (result.status === 200) {
      return result.data.data;
    }
    return [];
  } catch (error) {
    return [];
  }
}
async function getNovelDownload(
  source,
  format,
  novel_slug,
  chapter_slug,
  novel_name,
  chapter_name,
  extension
) {
  try {
    console.log(
      source,
      format,
      novel_slug,
      chapter_slug,
      novel_name,
      chapter_name,
      extension
    );
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/${source}/download/${format}/${novel_slug}/${chapter_slug}`,
      { responseType: "blob" }
    );
    const file_url = window.URL.createObjectURL(new Blob([response.data]));
    const file_link = document.createElement("a");
    file_link.href = file_url;
    const fileName = novel_name + " - " + chapter_name + extension;
    file_link.setAttribute("download", fileName);
    file_link.setAttribute("target", "_blank");
    document.body.appendChild(file_link);
    file_link.click();
    file_link.remove();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
export { getAllDownloadType, getNovelDownload };
