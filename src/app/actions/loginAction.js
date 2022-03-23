const loginAction = (LOGIN_STATE, USER_NAME) => {
    return {
        type: 'LOGININ',
        payload: { login_state: LOGIN_STATE, user_name: USER_NAME }
    }
}

export default loginAction;