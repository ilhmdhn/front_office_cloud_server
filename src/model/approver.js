const { DataTypes, Sequelize } = require('sequelize');
const sqlz = require('../util/sqlz');

module.exports = sqlz.define('user',{
    outlet:{
        type: DataTypes.STRING
    },
    id:{
        type: DataTypes.STRING
    },
    user:{
        type: DataTypes.STRING
    },
    reception:{
        type: DataTypes.STRING
    },
    note:{
        type: DataTypes.STRING
    },
    state:{
        type: DataTypes.STRING
    },
    approver:{
        type: DataTypes.STRING
    }
},{
    tableName: 'approver'
});