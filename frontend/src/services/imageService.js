import axios from "axios";

const API =
    "http://localhost:8085/api/images";

export const uploadImage = async (
    imageFile
) => {

    const formData =
        new FormData();

    formData.append(
        "file",
        imageFile
    );

    return await axios.post(
        `${API}/upload`,
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data"
            }
        }
    );
};