const {getFirebaseAdmin} = require('../service/firebase');

const sendNotif = () =>{
    return new Promise((resolve, reject)=>{
        try {
            const admin = getFirebaseAdmin()

            const message = {
                data: {
                    type: "1",
                    code: "aaa",
                    Title: "Room PR A Memanggil",
                    Message: "Tanggapi Response"
                },
                token: ''
            };
            admin.messaging().send(message)
            .then((response)=>{
                console.log('BERHASIL '+response);
            })
            .catch((err)=>{
                console.log('GAGAL '+err)
            })
        } catch (err) {
            console.log('MASUK CATCH' +err);
        }
    });
}

module.exports = {
    sendNotif
}