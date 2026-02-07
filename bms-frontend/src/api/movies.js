import { axiosInstance} from "./axios";

const addMovie = async (value) =>{
    try{
        const response = await axiosInstance.post("/api/movies/addmovie", value)
        return response.data;
    }
    catch(err){
        throw err;
    }
}

const getAllMovies = async () =>{
    try{
        const response = await axiosInstance.get("/api/movies/get-all-movies")
        return response.data;
    }
    catch(err){
        throw err;
    }
}

const updateMovie = async (value) => {
    try {
        const response = await axiosInstance.post("/api/movies/update-movie", value)
        return response.data
    } catch (error) {
        throw error
    }
}

export {addMovie, getAllMovies, updateMovie};