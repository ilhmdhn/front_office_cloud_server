const admin = require('firebase-admin');
const fs = require('fs');
const privateKey = JSON.parse(fs.readFileSync('ihp-private-key.json'));

const getFirebaseAdmin = ()=>{
    try {
        if (admin.apps.length === 0) {
            admin.initializeApp({
                credential: admin.credential.cert(privateKey)
            });
        }
        return admin;
    } catch (err) {
        console.log(`Error getFirebaseAdmin ${err.name +'\n'+ err.message}`)
        return false;
    }
}

module.exports ={
    getFirebaseAdmin
}