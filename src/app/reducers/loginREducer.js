let initialState = {
    _isLogin: false,
    _user_name: ''
}
const loginReducer = (state = initialState, action) => {
    let nextState;
    switch (action.type) {
        case "LOGININ":
            nextState = {
                ...state,
                _isLogin: action.payload.login_state,
                _user_name: action.payload.user_name,
            }
            return nextState
        default:
            return initialState
    }
}
export default loginReducer