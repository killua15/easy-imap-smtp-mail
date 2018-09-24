import { Platform } from 'react-native';
import NativeEasyImapSmtpMailIos from './EasyImapSmtpMail.ios'
import NativeEasyImapSmtpMailAndroid from './EasyImapSmtpMail.android'
const plataform = Platform.select({
    ios: 'ios',
    android: 'android',
})

const EasyImapSmtpMail = {
    conectFetchEmail: async function (...states) {
        if (plataform == 'ios') {
            let v = await NativeEasyImapSmtpMailIos.conectFetchEmail(states)
            return v
        } else {
            console.log("Android")
        }
    },
    getBodyMensagebyMessageID: async function (MessageID) {
        if (plataform == 'ios') {
            let v = await NativeEasyImapSmtpMailIos.getBodyMensagebyMessageID(MessageID)
            return v
        } else {
            console.log("Android")
        }
    },
    deleteMessages: async function (UID) {
        if (plataform == 'ios') {
            let v = await NativeEasyImapSmtpMailIos.deleteMessages(UID)
            return v
        } else {
            console.log("Android")
        }
    },
    sendEmailMessage: async function (smtpHost, smtpPort, user, pass, typeConn, typeAuth,
        nameFrom, emailFrom, nameTo, emailTo, subjet, bodyMessage,attachment) {
        if (plataform == 'ios') {
            let v = await NativeEasyImapSmtpMailIos.sendEmailMessage(smtpHost, smtpPort, user, pass, typeConn, typeAuth,
                nameFrom, emailFrom, nameTo, emailTo, subjet, bodyMessage,attachment)
            return v
        } else {
            console.log("Android")
        }
    }


}
export default EasyImapSmtpMail