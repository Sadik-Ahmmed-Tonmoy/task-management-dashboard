import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from '@/store/themeConfigSlice';
import {
    FLUSH,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    REHYDRATE
  } from 'redux-persist';
import { baseApi } from '@/redux/api/baseApi';

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    [baseApi.reducerPath]: baseApi.reducer,
});

// export default configureStore({
//     reducer: rootReducer,
//     middleware: (getDefaultMiddlewares) =>
//         getDefaultMiddlewares({
//             serializableCheck: {
//                 ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//             },
//         }).concat(baseApi.middleware),
    
// });

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddlewares) =>
      getDefaultMiddlewares({
          serializableCheck: {
              ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
      }).concat(baseApi.middleware),
  })
}

export type IRootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof makeStore>
// export type AppStore = ReturnType<typeof configureStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

