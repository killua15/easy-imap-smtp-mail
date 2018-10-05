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

const NativeEasyImapSmtpMail = require('NativeModules').EasyImapSmtpMail;
//Array con los 2 tipos Arrays de Emails
// _MailsArrayFetch  [[Message+Body+Attachmet][Headers]]
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

/**
 * High-level docs for the EasyImapSmtpMail iOS API can be written here.
 */ 

const EasyImapSmtpMail = {
  //Constructor para setear configuraciones
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

  },
  //To fetch all emails IMAP Protocol
  conectFetchEmail: async function (states) {
    _MailsArrayFetch = await NativeEasyImapSmtpMail.connectFechMail(hostname,port,user,pass,typeC,states[0])
    return _MailsArrayFetch
  },
  //MessageID value 
  getBodyMensagebyMessageID: async function (MessageID) {
    if (MessageID != "") {
      var body = await _MailsArrayFetch[0].find(el => {
        if (el[0] == MessageID) {
          return el[1]
        }
      })
      return body[1]
    }
  },
  deleteMessages: async function (UID) {
    // console.log(sequenseNumber)
    var _deleteMessage = await NativeEasyImapSmtpMail.deleteMessages(hostname, port, user, pass, typeC, UID)
    return _deleteMessage
  },
  //Send Email SMTP Protocol 
  sendEmailMessage: async function (nameFrom, emailFrom, nameTo, emailTo, subjet, bodyMessage,attachment) {

    var _smtpSendMessage = await NativeEasyImapSmtpMail.sendEmailMessage(smtpHost, smtpPort, user, pass, typeConn, typeAuth,
      nameFrom, emailFrom, nameTo, emailTo, subjet, bodyMessage, attachment)
    return _smtpSendMessage

  }

};

module.exports = EasyImapSmtpMail;
