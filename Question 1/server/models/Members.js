const mongoose = require('mongoose')
const id_validator = require ('mongoose-id-validator');
const Schema = mongoose.Schema;

const validatePhone = function(phone) {
    return /^(05\d)([-\s]?)(\d{3})\2(\d{4})$/.test(phone);
};

const validateHomePhone = function(phone) {
    return /(0[23489]{1})(-?)(\d{7})$/.test(phone);
};
const CovidSchema = new Schema({

    vaccinated: { 
        type: Boolean, 
        required: true 
    }, 
    vaccinations: [{
      dose: { 
        type: Number, 
        required: true,
        enum: [1, 2, 3, 4],
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value for dose'
        }
        },
        dateReceived: { 
            type: Date,
            required: true,
            validate: {
                validator: function(value) {
                    return value && value <= new Date();
                },
            message: 'Vaccination date {VALUE} is in the future'
            }
        },
        manufacturer: { 
            type: String,
            required: true
        }
    }],


    wasSick: { 
        type: Boolean, 
        required: true 
    }, 
    positiveTestDate: { 
        type: Date,
        validate: {
            validator: function(value) {
                return value && value <= new Date();
            },
            message: 'Positive test date {VALUE} cannot be in the future'
        }
    },
    recoveryDate: { 
        type: Date,
        validate: {
            validator: function(value) {
                if (!this.positiveTestDate) return true; // Only validate if positiveTestDate is set
                return value && value > this.positiveTestDate && value <= new Date();
            },
            message: 'Recovery date {VALUE} should be after positive test date and cannot be in the future'
        }
    }
  });

 
const MemberSchema = new Schema({
    id: {
        type: String,
        required: true,
        trim: true,
        maxlength: 9,
  
    },
    name: {
        type: String,
        required: true,
        trim: true

    },
    Date_of_birth: {
        type: Date,
        required: true,
        trim: true,
        validate(value) {
            if(value> new Date().toISOString().slice(0,10))
            {
                throw new Error('date must be before today')
            }
        }
    },
    address: {
        city: {
            type: String,
            required: true,
            trim: true
        },
        street: {
            type: String,
            required: true,
            trim: true
        },
        number: {
            type: Number,
            required: true
        }
    },
    cellphone: {
        type: String,
        required: true,
        validate: [validatePhone, 'Please fill a valid cellphone number'],
    },
    homePhone: {
        type: String,
        required: true,
        validate: [validateHomePhone, 'Invalid home phone number'],
    },
    covidInfo: CovidSchema
}, { timestamps: true }
);




MemberSchema.plugin(id_validator);
const Member = mongoose.model('Member', MemberSchema);

module.exports = Member