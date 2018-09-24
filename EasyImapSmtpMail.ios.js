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
var cantMail = null
var callback = null
/**
 * High-level docs for the EasyImapSmtpMail iOS API can be written here.
 */

const EasyImapSmtpMail = {
  //To fetch all emails IMAP Protocol
  conectFetchEmail: async function (states) {
    _MailsArrayFetch = await NativeEasyImapSmtpMail.connectFechMail(states[0], states[1], states[2], states[3], states[4], states[5])
    hostname = states[0]
    port = states[1]
    user = states[2]
    pass = states[3]
    typeC = states[4]
    cantMail = states[5]
    return _MailsArrayFetch
  },
  getBodyMensagebyMessageID: async function (MessageID) {
    if (MessageID != "") {
      var body = _MailsArrayFetch[0].find(el => {
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
  sendEmail: async function (Email) {

  }

};

module.exports = EasyImapSmtpMail;
