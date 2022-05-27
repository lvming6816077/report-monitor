import { combineReducers, createStore } from 'redux'
import { devToolsEnhancer } from 'redux-devtools-extension'
import { UserReducer } from './reducers/user'
export type RootState = ReturnType<typeof rootReducer>;

/* Create root reducer, containing all features of the application */
const rootReducer = combineReducers({
  user: UserReducer,
})

const store = createStore(
  rootReducer,
  /* preloadedState, */ devToolsEnhancer({})
)

export default store
