const {MongoSchema} = require('@notores/core');
const {Schema} = require('mongoose');

const Order = new MongoSchema('Order', {
        invoiceAddress: {type: MongoSchema.Types.ObjectId, ref: 'Address', required: true},
        shippingAddress: {type: MongoSchema.Types.ObjectId, ref: 'Address', required: false},
        products: [{
            id: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
            title: {type: String, required: true},
            image: {type: String, required: false},
            amount: {type: Number, required: true, default: 1},
            unitPrice: {type: Number, required: true},
            vatPercentage: {type: Number, required: true},
            digital: {type: Boolean, required: true, default: false}
        }]
    },
    {
        minimize: false,
        strict: false,
        timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}
    }
);

Order.statics.generateOrderProduct = (product) => {
    return {
        id: product.id,
        title: product.title,
        image: product.images.length > 0 ? product.images[0] : undefined,
        amount: 1,
        unitPrice: product.pricing.price,
        vatPercentage: product.pricing.vatPercentage,
        digital: product.digital,
    };
};

Order.virtual('totalExVat')
    .get(function () {
        return this.products.reduce((total, current) => total + (current.amount * current.unitPrice), 0);
    })
    .set(function () {
    });
Order.virtual('totalVat')
    .get(function () {
        return this.products.reduce((total, current) => total + _.round((current.amount * current.unitPrice) * (current.vatPercentage / 100), 2), 0);
    })
    .set(function () {
    });

Order.pre('validate', function (next) {
    const order = this;

    const isPureDigital = order.products.reduce((val, cur) => val && cur.digital, true);
    if (!isPureDigital && !order.shippingAddress)
        return next(new Error('A shipping address is required'));
    return next();
});


module.exports = Order;
