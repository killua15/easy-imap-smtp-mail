import { Platform } from 'react-native';
import NativeEasyImapSmtpMailIos from './EasyImapSmtpMail.ios'
import NativeEasyImapSmtpMailAndroid from './EasyImapSmtpMail.android'
const plataform = Platform.select({
    ios: 'ios',
    android: 'android',
})

const EasyImapSmtpMail = {
    esasy_IMAP_SMTP_MAIL: function (...states){
        if(plataform=='ios'){
            NativeEasyImapSmtpMailIos.esasy_IMAP_SMTP_MAIL(states)
        }else{
            NativeEasyImapSmtpMailAndroid.esasy_IMAP_SMTP_MAIL(states)
        }
       
    },
    conectFetchEmail: async function (...states) {
        if (plataform == 'ios') {
            let v = await NativeEasyImapSmtpMailIos.conectFetchEmail(states)
            return v
        } else {
            let v = await NativeEasyImapSmtpMailAndroid.conectFetchEmail(states)
            return v
        }
    },
    getBodyMensagebyMessageID: async function (MessageID) {
        if (plataform == 'ios') {
            let v = await NativeEasyImapSmtpMailIos.getBodyMensagebyMessageID(MessageID)
            return v
        } else {
            let v = await NativeEasyImapSmtpMailAndroid.getBodyMensagebyMessageID(MessageID)
            return v
        }
    },
    deleteMessages: async function (UID) {
        if (plataform == 'ios') {
            let v = await NativeEasyImapSmtpMailIos.deleteMessages(UID)
            return v
        } else {
            let v = await NativeEasyImapSmtpMailAndroid.deleteMessages(UID)
            return v
        }
    },
    sendEmailMessage: async function (nameFrom, emailFrom, nameTo, emailTo, subjet, bodyMessage,attachment) {
        if (plataform == 'ios') {
            let v = await NativeEasyImapSmtpMailIos.sendEmailMessage(nameFrom, emailFrom, nameTo, emailTo, subjet, bodyMessage,attachment)
            return v
        } else {
            let v = await NativeEasyImapSmtpMailAndroid.sendEmailMessage(nameFrom,emailFrom, nameTo, emailTo, subjet, bodyMessage,attachment)
            return v
        }
    }


}
export default EasyImapSmtpMail