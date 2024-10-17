// import themeConfigSlice from '@/store/themeConfigSlice';
// import { combineReducers, configureStore } from '@reduxjs/toolkit';
// import {
//   FLUSH,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
//   REHYDRATE
// } from 'redux-persist';

// import { baseApi } from './api/baseApi';


// const rootReducer = combineReducers({
//   [baseApi.reducerPath]: baseApi.reducer,
//   themeConfig: themeConfigSlice,
// });

// export const makeStore = () => {
//   return configureStore({
//     reducer: rootReducer,
//     middleware: (getDefaultMiddlewares) =>
//       getDefaultMiddlewares({
//           serializableCheck: {
//               ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//           },
//       }).concat(baseApi.middleware),
//   })
// }

// // Infer the type of makeStore
// export type AppStore = ReturnType<typeof makeStore>
// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<AppStore['getState']>
// export type AppDispatch = AppStore['dispatch']