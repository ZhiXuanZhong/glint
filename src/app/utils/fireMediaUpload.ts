import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const fireMediaUpload = async (data: Blob | Uint8Array | ArrayBuffer, path: string, fileName: string) => {
    const storage = getStorage();
    const pictureRef = ref(storage, `${path}/${name}`);


    return uploadBytes(pictureRef, data)
        .then((snapshot) => snapshot.ref)
        .then((ref) => getDownloadURL(ref))

};

export default fireMediaUpload