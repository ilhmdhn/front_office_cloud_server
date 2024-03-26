const { DataTypes, Sequelize } = require('sequelize');
const sqlz = require('../util/sqlz');

module.exports = sqlz.define('user', {
    outlet:{
        type: DataTypes.STRING,
        primaryKey: true
    },
    id:{
        type: DataTypes.STRING,
        primaryKey: true
    },
    level:{
        type: DataTypes.STRING,
    },
    token:{
        type: DataTypes.STRING,
    },
    device:{
        type: DataTypes.STRING,
    },
    login_state:{
        type: DataTypes.ENUM('0', '1'),
    },
    last_login:{
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
},{
    tableName: 'user'
});