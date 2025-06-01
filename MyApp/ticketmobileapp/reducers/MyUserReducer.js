const MyUserReducers = (currentState, action) => {
    switch (action.type){
        case "login":
            return action.payload
        case "logout":
            return null
    }
}

export default MyUserReducers