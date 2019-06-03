const {NotoresModule} = require('@notores/core');
class ShopModule extends NotoresModule {

    init(){
        const Locals = require('@notores/core').Locals;

        Locals.extend({
            price(price) {
                return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(price);
            }
        });

        const Order = require('./model');
        this.setModel(Order.modelName, Order);
        Order.loadModel();

        require('./routes')();
    }
}

module.exports = new ShopModule();
