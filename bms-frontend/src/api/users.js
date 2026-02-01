import { axiosInstance} from "./axios";

const registerUser = async (value) =>{
    try{
        const response = await axiosInstance.post("/api/user/register", value)
        return response.data;
    }
    catch(err){
        throw err;
    }
}

export {registerUser};