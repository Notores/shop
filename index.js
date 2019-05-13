const {NotoresModule} = require('@notores/core');
class ShopModule extends NotoresModule {
    
    constructor(){
        super();

        const Order = require('./model');
        this.setModel(Order.modelName, Order);
        Order.loadModel();
    }

    init(){
        const Locals = require('@notores/core').Locals;

        Locals.extend({
            price(price) {
                return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(price);
            }
        });

        require('./routes')();
    }
}

module.exports = new ShopModule();
