import {configureStore} from "@reduxjs/toolkit";
import loaderReducer from "./loaderSlice";
import userReducer from "./userSlice";
import themeSlice from "./themeSlice";

const store = configureStore({
    reducer:{
        loaders:loaderReducer,
        users:userReducer,
        theme: themeSlice,
    },
})
export default store;