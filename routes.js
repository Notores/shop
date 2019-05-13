const ShopRouter = require('./Router');
const {routeWithHandle, middlewareForRouter} = require('@notores/core');

module.exports = () => {
    routeWithHandle(
        'notores-shop-cart',
        `/cart`,
        [
            ShopRouter.cart,
        ],
        {
            accepts: ['html', 'json']
        },
    );

    routeWithHandle(
        'notores-shop-add-product',
        `/cart/:productId`,
        [
            ShopRouter.addProduct,
        ],
        {
            accepts: ['html', 'json']
        },
    );

    routeWithHandle(
        'notores-shop-change-amount',
        `/cart/:productId/:amount`,
        [
            ShopRouter.changeProductAmount,
        ],
        {
            accepts: ['html', 'json']
        },
    );

    middlewareForRouter([
        ShopRouter.getCartMiddleware
    ]);
};

