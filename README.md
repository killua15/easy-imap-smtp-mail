# easy-imap-smtp-mail
# [Easy Imap Smtp Mail to React Native](https://facebook.github.io/react-native/)
Fetch and send Emails using as main library Mailcore2, this module allow fetch, delete and send emails from your mail server using the protocol IMAP to get and delete your mails and the protocol SMTP to send mails.

## Getting Started
1 -  npm i -S easy-imap-smtp-mail or yarn add easy-imap-smtp-mail
2 - react-native link 
3- For IOS
  1- Open your proyerct /ios/{NAME_OF_PROYECT}.xcodeproj

  2- If EasyImapSmtpMail.xcodeproj is not add to the proyect then we must add manually to the proyect, right click on Libraries in our xcode proyect and select "Add Files {NAME_OF_PROYECT}" and add  EasyImapSmtpMail.xcodeproj. Also we add the mailcore2/build-mac/mailcore2.xcodeproj.Finaly we add the BWJSONMatcher/BWJSONMatcher.xcodeproj.

  3 - We go to the Settings {NAME_OF_PROYECT} and search "Build Phases", there we go to "Target Dependencies", pulse + button and search and add "static mailcore2 ios". Right there find "Link Binary With Libraries" and add "libBWJSONMatcher.a","CFNetwork.framework","libMailCore-ios.a" and "libEasyImapSmtpMail".

  4- Now in the same place we search "Build Setings", right there on the input of Search write "standard library" and change to "libstdc++ GNU C++". Then write right there "Other Flags" and paste this "-lctemplate-ios -letpan-ios -lxml2 -lsasl2 -liconv -ltidy -lz -lc++ -lresolv -stdlib=libc++ -ObjC".
  
  5- Build Proyect!!.
3- For Android

## Documentation
  import EasyImapSmtpMail from 'easy-imap-smtp-mail'

  /* Fetch Emails, this return an array who contains 2 arrays
    EasyImapSmtpMail.conectFetchEmail("imapServer(String)",portServer(int),"UserMail(String)","Password(String)",TypeConneccion(int),NumeroMails(int))
    .then(v =>{
      console.log(v)
    })

    v=[ 0 = ["IDMessage","BodyMessage",[Attachmet] 
        1 = [flags: flags,gmailMessageID:gmailMessageID,gmailThreadID: gmailThreadID header: {from: from, subject:           subjet", to: to, messageID:"messageID"}, modSeqValue: modSeqValue, originalFlags: originalFlags,                sequenceNumber: sequenceNumber, size: size uid: uid]]]
    
  */



## License

React Native is [MIT licensed](./LICENSE).

React Native documentation is [Creative Commons licensed](./LICENSE-docs).

