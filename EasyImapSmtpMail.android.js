/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Stub of EasyImapSmtpMail for Android.
 *
 * @format
 * @flow
 */

'use strict';
import {NativeModules} from 'react-native'
const NativeEasyImapSmtpMailAndroid =NativeModules.RNEasyImapSmtpMail;
var _MailsArrayFetch = null
var hostname = null
var port = null
var user = null
var pass = null
var typeC = null
var smtpHost=null
var smtpPort=null 
var userSMTP=null
var passSMTP=null 
var typeConn=null
var typeAuth=null
const EasyImapSmtpMail = {
  esasy_IMAP_SMTP_MAIL: function(states){
    hostname = states[0]
    port = states[1]
    user = states[2]
    pass = states[3]
    typeC = states[4]
    smtpHost=states[5]
    smtpPort=states[6]
    userSMTP=states[7]
    passSMTP=states[8]
    typeConn=states[9]
    typeAuth=states[10]
    console.log(states)

  },
  conectFetchEmail: async function(states) {
   _MailsArrayFetch = await NativeEasyImapSmtpMailAndroid.conectFetchEmail(hostname,port,user,pass,typeC,states[0])
   return _MailsArrayFetch
  },
  getBodyMensagebyMessageID : async function(MessageID){
    //console.log( await _MailsArrayFetch)
    if (MessageID != "") {
        _MailsArrayFetch[0].find(el =>{
           if(el.messageID == MessageID){
            console.log(el.BodyMessage)
           }
          
        })
      
    }
  },
  deleteMessages: async function (UID) {
    // console.log(sequenseNumber)
    var _deleteMessage = await NativeEasyImapSmtpMailAndroid.deleteMessages(hostname, port, user, pass, typeC, UID)
    return _deleteMessage
  },
  sendEmailMessage: async function (nameFrom,emailFrom,nameTo, emailTo, subjet, bodyMessage,attachment) {
    console.log(emailFrom)
    var _smtpSendMessage = await NativeEasyImapSmtpMailAndroid.sendEmailMessage(smtpHost, smtpPort, user, pass, typeConn, typeAuth,
      nameFrom, emailFrom, nameTo, emailTo, subjet, bodyMessage, attachment)
    return _smtpSendMessage

  }
};

module.exports = EasyImapSmtpMail;
