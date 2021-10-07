const mongoURI = process.env.MONGOURI;
let port = process.env.PORT || 3000;

module.exports = {
    mongoURI,
    port
}