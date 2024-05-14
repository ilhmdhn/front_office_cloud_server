const { DataTypes } = require('sequelize');
const sqlzMembership = require('../../util/sqlz_membership');

module.exports = sqlzMembership.define('MasterMember',{
        ID:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        UserName:{
            type: DataTypes.STRING
        },
        Password:{
            type: DataTypes.TEXT
        },
        Photo:{
            type: DataTypes.STRING
        },
        FirstName:{
            type: DataTypes.STRING
        },
        LastName:{
            type: DataTypes.STRING
        },
        Religion:{
            type: DataTypes.STRING
        },
        HP:{
            type: DataTypes.STRING
        },
        HP1:{
            type: DataTypes.STRING
        },
        Birthday:{
            type: DataTypes.DATE
        },
        Gender:{
            type: DataTypes.CHAR
        },
        Outlet:{
            type: DataTypes.CHAR
        },
        MemberType:{
            type: DataTypes.INTEGER
        },
        EmailToken:{
            type: DataTypes.STRING
        },
        IsVerified:{
            type: DataTypes.TINYINT
        },
        MemberID:{
            type: DataTypes.STRING,
            unique: true
        },
        PasswordResetToken:{
            type: DataTypes.STRING
        },
        Point:{
            type: DataTypes.INTEGER
        },
        RememberToken:{
            type: DataTypes.STRING
        },
        Status:{
            type: DataTypes.TINYINT
        },
        City:{
            type: DataTypes.STRING
        },
        RegisterDate:{
            type: DataTypes.DATE
        },
        ActiveDate:{
            type: DataTypes.DATE
        },
        ExpiredDate:{
            type: DataTypes.DATE
        },
        IsPhoneVerified:{
            type: DataTypes.TINYINT
        },
        PhoneOTP:{
            type: DataTypes.STRING
        },
        NextOTPAttempt:{
            type: DataTypes.DATE
        },
        OldMemberID:{
            type: DataTypes.STRING
        },
        ImportDate:{
            type: DataTypes.DATE
        },
        IDCard:{
            type: DataTypes.STRING
        },
        IDCardStatus:{
            type: DataTypes.SMALLINT
        },
        IDCardDate:{
            type: DataTypes.DATE
        },
        IDCardNote:{
            type: DataTypes.TEXT
        },
        IDCardURL:{
            type: DataTypes.STRING
        },
        IDCardNIK:{
            type: DataTypes.STRING
        },
        IDCardName:{
            type: DataTypes.TEXT
        },
        IDCardAddress:{
            type: DataTypes.TEXT
        },
        IDCardCity:{
            type: DataTypes.STRING
        }, 
    },{
        freezeTableName: true,
        timestamps: false
});