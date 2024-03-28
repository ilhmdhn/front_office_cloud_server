const { DataTypes, Sequelize } = require('sequelize');
const sqlz = require('../util/sqlz');

module.exports = sqlz.define('user',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    outlet:{
        type: DataTypes.STRING
    },
    id_approval:{
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