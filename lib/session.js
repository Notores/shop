const initSession = (req) => {
    if(!req.session.cart)
        req.session.cart = {
            products: []
        }
    if(!req.session.cart.products)
        req.session.cart.products = [];
};

module.exports = {
    initSession
}
