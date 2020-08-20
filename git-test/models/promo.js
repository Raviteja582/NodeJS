const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);

const Currency =mongoose.Types.Currency;

const promoSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        label : {
            type: String,
            required: true,
        },
        price: {
            type: Currency,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        featured: {
            type: Boolean,
            default: false,
        }
},{
    timestamps: true,
})

var promotion = mongoose.model('promotion', promoSchema);

module.exports = promotion