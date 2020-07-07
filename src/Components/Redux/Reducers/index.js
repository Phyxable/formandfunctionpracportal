import { combineReducers } from 'redux'
import MediaListReducer from './MediaListReducer'

export default combineReducers({
    media_list: MediaListReducer
})