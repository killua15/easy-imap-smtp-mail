# easy-imap-smtp-mail
# [Easy Imap Smtp Mail to React Native](https://facebook.github.io/react-native/)
Fetch and send Emails using as main library Mailcore2, this module allow fetch, delete and send emails from your mail server using the protocol IMAP to get and delete your mails and the protocol SMTP to send mails.

## Getting Started


 -  npm i -S easy-imap-smtp-mail or yarn add easy-imap-smtp-mail
 - react-native link 
- For IOS
  1- Open your proyerct /ios/{NAME_OF_PROYECT}.xcodeproj

  - If EasyImapSmtpMail.xcodeproj is not add to the proyect then we must add manually to the proyect, right click on Libraries in our xcode proyect and select "Add Files {NAME_OF_PROYECT}" and add  EasyImapSmtpMail.xcodeproj. Also we add the mailcore2/build-mac/mailcore2.xcodeproj.Finaly we add the BWJSONMatcher/BWJSONMatcher.xcodeproj.

  - We go to the Settings {NAME_OF_PROYECT} and search "Build Phases", there we go to "Target Dependencies", pulse + button and search and add "static mailcore2 ios". Right there find "Link Binary With Libraries" and add "libBWJSONMatcher.a","CFNetwork.framework","libMailCore-ios.a" and "libEasyImapSmtpMail".

  - Now in the same place we search "Build Setings", right there on the input of Search write "standard library" and change to "libstdc++ GNU C++". Then write right there "Other Flags" and paste this "-lctemplate-ios -letpan-ios -lxml2 -lsasl2 -liconv -ltidy -lz -lc++ -lresolv -stdlib=libc++ -ObjC".
  
  - Build Proyect!!.
- For Android 
  - react-native link 
## Documentation 
```javascript
  import EasyImapSmtpMail from 'easy-imap-smtp-mail'
  
  /*Set Values of Configuration of EasyImapSmtpMail*/
     EasyImapSmtpMail.esasy_IMAP_SMTP_MAIL("imapServer(String)",portServer(int),
     "UserMail(String)","Password(String)",TypeConneccion(int),smtpHost(String),
     smtpPort(int),userSMTP(String),passSMTP(String),typeConn(int),typeAuth(int))
  
  /* Fetch Emails, this return an array who contains 2 arrays*/
    EasyImapSmtpMail.conectFetchEmail(cantMail(int))
    .then(v =>{
      console.log(v)
    })
    //      IOS
    // v=[ 0 = ["messageID","BodyMessage",[Attachmet] 
    //     1 = [flags: flags,gmailMessageID:gmailMessageID,gmailThreadID: gmailThreadID header: {from: from, subject:           subjet", to: to, messageID:"messageID"}, modSeqValue: modSeqValue, originalFlags: originalFlags,                sequenceNumber: sequenceNumber, size: size uid: uid]]]
    
    //     Android
     // v=[ 0 = [AttachmetType: "", Attachmet: "base64", BodyMessage: "", messageID: "29587"] 
    //     1 = [{subjet: "", to: "", from: ""}}]
    // Allways the mails are sorted from the last mail until the cantMails that you set.
  

  /* Get Body Message returns the Body of Message by messageID*/
      EasyImapSmtpMail.getBodyMensagebyMessageID(messageID)
      .then(v =>{
          console.log(v)
      })

      //v = "This is a body of  Message"
  
  
  /* Get Body Message returns the Body of Message by messageID*/
      EasyImapSmtpMail.deleteMessages(UID)
      .then(v =>{
          console.log(v)
      })
      //In case of sms deleted succsess
     // v = ["true",0]
  
  /* Get Body Message returns the Body of Message by messageID*/
      EasyImapSmtpMail.sendEmailMessage(nameFrom,emailFrom, nameTo, emailTo, subjet, bodyMessage,attachment)
      .then(v =>{
          console.log(v)
      })
      //In case of sms send succsess
     // v = ["true",0]

 ```


## License

React Native is [MIT licensed](./LICENSE).

React Native documentation is [Creative Commons licensed](./LICENSE-docs).

