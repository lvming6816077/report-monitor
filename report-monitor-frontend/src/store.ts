import { combineReducers, createStore } from 'redux'
import { devToolsEnhancer } from 'redux-devtools-extension'
import { UserReducer } from './reducers/user'
import { ProjectReducer } from './reducers/project'
export type RootState = ReturnType<typeof rootReducer>

/* Create root reducer, containing all features of the application */
const rootReducer = combineReducers({
    user: UserReducer,
    project: ProjectReducer
})

const store = createStore(
    rootReducer,
    /* preloadedState, */ devToolsEnhancer({})
)

export default store
