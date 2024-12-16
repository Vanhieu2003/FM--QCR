import FileService from "src/@core/service/files";
type ImageUrls = {
    [key: string]: string | unknown;
};

function binaryStringToUint8Array(str: string): Uint8Array {
    const length = str.length;
    const array = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        array[i] = str.charCodeAt(i);
    }
    return array;
}

export async function processImageUrls(data: any) {
    // Lặp qua từng object trong criteriaList
    for (let criteria of data.criteriaList) {
        if (criteria.imageUrl) {
            // Chuyển đổi imageUrl từ string JSON sang object
            let imageUrls: ImageUrls = JSON.parse(criteria.imageUrl);

            // Lấy danh sách các fileNames từ object
            let fileNames = Object.values(imageUrls);

            // Gọi API để lấy URL chính cho từng fileName
            let urls = await Promise.all(
                fileNames.map(async (fileName: any) => {
                    try {
                        // Gọi hàm lấy URL (thay thế bằng API của bạn)

                        const fileWithUrl = 'https://172.16.5.185/uploads/'.concat(fileName);
                        const signedUrl = await FileService.GetFile(fileWithUrl);
                        const imageUrl = URL.createObjectURL(signedUrl.data);
                        return imageUrl;
                    } catch (error) {
                        console.error(`Error getting signed URL for file ${fileName}`, error);
                        return null;
                    }
                })
            );


            Object.keys(imageUrls).forEach((key, index) => {
                imageUrls[key] = urls[index] || ""; // Nếu URL null, để chuỗi rỗng
            });


            criteria.imageUrl = imageUrls;
        }
    }

    return data;
}

export async function processImageUrlsFromString(fileName: string) {

    const fileWithUrl = 'https://172.16.5.185/uploads/'.concat(fileName);
    const response = await FileService.GetFile(fileWithUrl);
    const imageUrl = URL.createObjectURL(response.data);
    return imageUrl
}
