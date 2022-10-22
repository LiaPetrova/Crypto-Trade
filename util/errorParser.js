module.exports = (error) => {
    
    let result = [];
    if (Array.isArray(error)) {
        error.map(e => result.push(e.msg));
    } else if (error.name == 'ValidationError') {
        for (let e of Object.values(error.errors)) {
            result.push(e.message);
        }
    } else {
        result = error.message.split('\n');
    }
    return result;
}