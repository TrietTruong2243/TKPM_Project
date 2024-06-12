import axios from "axios";
async function getAllDownloadType(source){
    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${source}/download`)
        if (result.status===200){
            return result.data.data;
        }
        return [];
    } catch (error) {
        return [];
    }
}
async function getNovelDownload(source,format,novelSlug, chapterSlug,novelName,chapterName,extension) {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${source}/download/${format}/${novelSlug}/${chapterSlug}`, { responseType: 'blob' })
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement('a');
        fileLink.href = fileURL;
        const fileName = novelName + " - " + chapterName + extension;
        fileLink.setAttribute('download', fileName);
        fileLink.setAttribute('target', '_blank');
        document.body.appendChild(fileLink);
        fileLink.click();
        fileLink.remove();
        return true;
    } catch (error) {
        return false;
    }
}
export {getAllDownloadType,getNovelDownload};