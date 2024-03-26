module.exports = (state, data, message = 'Success') =>{
    return{
        state: state,
        message: message,
        data: data
    }
}