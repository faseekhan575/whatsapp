import {configureStore} from '@reduxjs/toolkit';
import { infos } from './config';


const store=configureStore({
    reducer:{
        infos:infos.reducer,
    }
})

export default store;