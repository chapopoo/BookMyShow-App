import {axiosInstance} from './axios'

const addTheatre = async (value) => {
    try {
        const response = await axiosInstance.post("/api/theatres/add-theatre", value)
        return response.data
    } catch (error) {
        throw error
    }

}

const updateTheatre = async (value) => {
    try {
        const response = await axiosInstance.put("/api/theatres/update-theatre", value)
        return response.data
    } catch (error) {
        throw error
    }

}


const deleteTheatre = async (value) => {
    try {
        const response = await axiosInstance.delete("/api/theatres/delete-theatre", value)
        return response.data
    } catch (error) {
        throw error
    }

}

const getAllTheatres = async () => {
    try {
        const response = await axiosInstance.get("/api/theatres/get-all-theatres")
        return response.data
    } catch (error) {
        throw error
    }
}


const getAllTheatresByOwner = async (values) => {
    try {
        // This is a GET request, so we pass the owner ID as a URL parameter
        // owner id is a object id, so we can directly pass it in the URL
        const response = await axiosInstance.get(`/api/theatres/get-all-theatres-by-owner/${values.owner}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export {
    addTheatre,
    updateTheatre,
    deleteTheatre,
    getAllTheatres,
    getAllTheatresByOwner
}