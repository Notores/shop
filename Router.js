const {initSession} = require('./lib/session');
const {getModule} = require('@notores/core');

class ShopRouter {

    static getModels() {
        return require('./model');
    }

    static async cart(req, res, next) {
        return await ShopRouter.renderCart(req, res, next);
    }

    static async addProduct(req, res, next) {
        const productModule = getModule('notores-product');
        if(productModule.installed){
            const productModel = productModule.model;
            const product = await productModel.model.findOne({_id: req.params.productId});
            if(product){
                const curIndex = req.session.cart.products.findIndex(p => p.id == product._id);
                if(curIndex > -1)
                    req.session.cart.products[curIndex].amount += 1;
                else
                    req.session.cart.products.push(ShopRouter.getModels().Order.model.generateOrderProduct(product));
                //update the cart in locals
                res.locals.cart = req.session.cart;
            }
            return await ShopRouter.renderCartSummary(req, res, next);
        }else{
            next(new Error('Missing package notores-product'));
        }
    }

    static async changeProductAmount(req, res, next) {
        const curIndex = req.session.cart.products.findIndex(p => p.id == req.params.productId);
        if(curIndex > -1) {
            const amount = parseInt(req.params.amount);
            if(amount > 0)
                req.session.cart.products[curIndex].amount = amount;
            else
                req.session.cart.products.splice(curIndex, 1);

            //update the cart in locals
            res.locals.cart = req.session.cart;
        }
        return await ShopRouter.renderCart(req, res, next);
    }

    static async renderCart(req, res, next) {
        res.locals.cart = req.session.cart;
        //Do some actual checking?

        if(res.locals.cart.products.length === 0) {
            //show products, so load the hot products.
            //to do this, we are hijacking the ProductRouter in product to not duplicate code

            const productModule = getModule('notores-product');
            if(productModule.installed) {
                await productModule.router.loadHot(req, res, () => {});
            }
        }

        res.locals.themePage = 'cart';
        next();
    }

    static async renderCartSummary(req, res, next) {
        res.locals.themePage = '../statics/cart-summary';
        res.locals.cart = req.session.cart;
        next();
    }

    static async getCartMiddleware(req, res, next) {
        initSession(req);
        if(res.locals.responseType === 'api')
            return next();

        //reculculate cart here?

        res.locals.cart = req.session.cart;

        return next();
    }
}

module.exports = ShopRouter;
