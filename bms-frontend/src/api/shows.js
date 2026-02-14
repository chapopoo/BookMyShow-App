import { axiosInstance } from "./axios";

const addShow = async (value) => {
    try{
        const response = await axiosInstance.post('/api/shows/add-show', value);
        return response.data
    }
    catch (err) {
        return err.message;
    }
}

const deleteShow = async (value) => {
    try{
        const response = await axiosInstance.post('/api/shows/delete-show', value)
        return response.data
    }
    catch (err) {
        return err.message;
    }
}

const updateShow = async (value) => {
    try{
        const response = await axiosInstance.post('/api/shows/update-show', value)
        return response.data
    }
    catch (err) {
        return err.message;
    }
}

const getShowsByTheatre = async (value) => {
    try{
        const response = await axiosInstance.post('/api/shows/get-all-shows-by-theatre', value)
        return response.data
    }
    catch (err) {
        return err.message;
    }
}

const getAllTheatresByMovie  = async (value) => {
    try{
        const response = await axiosInstance.post('/api/shows/get-all-theatre-by-movie', value)
        return response.data
    }
    catch (err) {
        return err.message;
    }
}

const getShowById = async (value) => {
  try {
    const response = await axiosInstance.post("/api/shows/get-show-by-id", value);
    return response.data;
  } catch (err) {
    return err.message;
  }
};

export { addShow, deleteShow, updateShow, getShowsByTheatre, getAllTheatresByMovie, getShowById };