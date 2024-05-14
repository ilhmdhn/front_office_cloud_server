const {DataTypes } = require('sequelize');
const sqlzTransaction = require('../../util/sqlz_transaction');

module.exports = sqlzTransaction.define('ihp_rating',{
    outlet:{
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    invoice:{
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    token:{
        type: DataTypes.STRING,
    },
    customer:{
        type: DataTypes.STRING,
    },
    phone:{
        type: DataTypes.STRING,
    },
    rate:{
        type: DataTypes.INTEGER,
    },
    reason:{
        type: DataTypes.STRING,
    },
    state:{
        type: DataTypes.ENUM('0', '1'),
        defaultValue: '0'
    },
    message: {
        type: DataTypes.TEXT
    }
},{
    freezeTableName: true
});