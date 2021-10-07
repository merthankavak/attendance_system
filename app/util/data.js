const mongoURI = process.env.MONGOURI;
const jwtSecret = process.env.JWT;
let port = process.env.PORT || 3000;

module.exports = {
    mongoURI,
    jwtSecret,
    port
}