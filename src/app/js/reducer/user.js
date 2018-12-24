const INITIAL_STATE = {
  image: ''
}

export default function user(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_IMAGE':
      return Object.assign(state, {
        image: action.image
      })
    default:
      return state
  }
}
