module.exports ={
    generateMessage
};

function generateMessage(from, text){
    return {
        from : from,
        text : text,
        createdAt : new Date().getTime()
    }
}