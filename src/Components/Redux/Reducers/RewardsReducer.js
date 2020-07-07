const INITIAL_STATE = {
    completed: {}
  }
  
  export default function todos(state = INITIAL_STATE, action) {
      switch (action.type) {
        case 'COMPLETED_REWARD':
          return { ...state, completed: action.payload }
        default:
          return state
      }
  }