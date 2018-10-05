
package com.reactlibrary;
import android.util.Base64InputStream;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.sun.mail.imap.IMAPFolder;
import com.sun.mail.imap.IMAPMessage;
import com.sun.mail.util.BASE64DecoderStream;
import com.sun.mail.util.BASE64EncoderStream;

import org.apache.commons.io.IOUtil;
import org.apache.commons.codec.binary.Base64;
import java.io.IOException;
import java.io.StringWriter;
import java.util.Properties;
import javax.mail.Address;
import javax.mail.Authenticator;
import javax.mail.BodyPart;
import javax.mail.Flags;
import javax.mail.Folder;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.NoSuchProviderException;
import javax.mail.Part;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Store;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;


public class RNEasyImapSmtpMailModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public RNEasyImapSmtpMailModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;

  }

  @Override
  public String getName() {
    return "RNEasyImapSmtpMail";
  }

  @ReactMethod
  public void conectFetchEmail(String hostname, int port, String user, String pass, int TypeC, 
                      int cantMail, Promise promise){
    IMAPFolder folder = null;
    Store store = null;
    String subject = null;
    Flags.Flag flag = null;

     try {
      // Authenticator auth = new MailAuthenticator();
       Properties props = System.getProperties();
       // server setting
       props.put("mail.imap.host", hostname);
       props.put("mail.imap.port", port);
       Session session = Session.getDefaultInstance(props,null);

       if(TypeC==0){
         store = session.getStore("imap");
       }else{
         store = session.getStore("imaps");
       }


       store.connect(hostname,port,user,pass);
       folder = (IMAPFolder) store.getFolder("INBOX");
       folder.open(Folder.READ_WRITE);
       Message messages[] = folder.getMessages();
       WritableArray AllPromises = Arguments.createArray();
       WritableArray mailsPromies = Arguments.createArray();
       WritableArray mailsPromies2 = Arguments.createArray();
       for (int i=messages.length-1; i>cantMail; i--){
         mailsPromies.pushMap((WritableMap) ParseMessage(messages[i],folder));
         String from = messages[i].getFrom()[0].toString();
         String to="";
         int leng = messages[i].getAllRecipients().length;
         to =messages[i].getAllRecipients()[0].toString();
         for (int y=0 ; y<leng; y++){

               to = messages[i].getAllRecipients()[y].toString();


         }
         String subjet = messages[i].getSubject();
         WritableMap header =Arguments.createMap();
         header.putString("from",from);
         header.putString("to",to);
         header.putString("subjet",subjet);
         mailsPromies2.pushMap(header);
         if(cantMail-1==0){
           break;
         }
         cantMail--;
       }
       AllPromises.pushArray(mailsPromies);
       AllPromises.pushArray(mailsPromies2);
      promise.resolve(AllPromises);
     }catch (Error e){
         promise.reject("Error", e);

     } catch (NoSuchProviderException e) {
       promise.reject("Error", e);
       e.printStackTrace();
     } catch (MessagingException e) {
       promise.reject("Error", e);
       e.printStackTrace();
     }
  }
  public WritableMap ParseMessage(Message m, IMAPFolder folder){
    WritableMap nw = Arguments.createMap();
    try {
      int messageID =(int)folder.getUID(m);
      String Body = getTextFromMessage(m);
      nw.putString("messageID", String.valueOf(messageID));
      nw.putString("BodyMessage", Body);
      nw.putString("Attachmet",getAttachmentMessage(m));
      nw.putString("AttachmetType",getAttachmentTypeMessage(m));
     // w.pushMap(nw);
    } catch (MessagingException e) {
      e.printStackTrace();
    } catch (IOException e) {
      e.printStackTrace();
    }

    return nw;
  }
  private String getTextFromMessage(Message message) throws MessagingException, IOException {
    String result = "";
    if (message.isMimeType("text/plain")) {
      result = message.getContent().toString();
    } else if (message.isMimeType("multipart/*")) {
      MimeMultipart mimeMultipart = (MimeMultipart) message.getContent();
      result = getTextFromMimeMultipart(mimeMultipart);
    }
    return result;
  }
  public String getTextFromMimeMultipart(
          MimeMultipart mimeMultipart)  throws MessagingException, IOException{
    String result = "";
    int count = mimeMultipart.getCount();
    for (int i = 0; i < count; i++) {
      BodyPart bodyPart = mimeMultipart.getBodyPart(i);
      if (bodyPart.isMimeType("text/plain")) {
        result = result + "\n" + bodyPart.getContent();
        break; // without break same text appears twice in my tests
      } else if (bodyPart.isMimeType("text/html")) {
        String html = (String) bodyPart.getContent();
        result =html;
      } else if (bodyPart.getContent() instanceof MimeMultipart){
        result = result + getTextFromMimeMultipart((MimeMultipart)bodyPart.getContent());
      }
    }
    return result;
  }
  public  String getAttachmentMessage(Message m) throws IOException, MessagingException {
      String file="";



      if(m.getContent() instanceof  Multipart){
         Multipart multipartMessage = (Multipart) m.getContent();
         for (int i=0; i < multipartMessage.getCount(); i++){
           Part p = multipartMessage.getBodyPart(i);
           String disposition = p.getDisposition();
           if((disposition != null) && ((disposition.equalsIgnoreCase(Part.ATTACHMENT))||
                                        ( disposition.equalsIgnoreCase(Part.INLINE)))){
             MimeBodyPart mimeBodyPart = (MimeBodyPart) p;
             file=mimeBodyPart.getEncoding();

             if(file.equals("base64")){
               BASE64DecoderStream file64 = (BASE64DecoderStream) mimeBodyPart.getContent();
               byte[] byteArray = IOUtil.toByteArray(file64);
               byte[] encode64 = Base64.encodeBase64(byteArray);
               file = new String(encode64,"UTF-8");
             }



           }
         }
      }
      return  file;
  }
  public  String getAttachmentTypeMessage(Message m) throws IOException, MessagingException {
    String file="";


    if(m.getContent() instanceof  Multipart){
      Multipart multipartMessage = (Multipart) m.getContent();
      for (int i=0; i < multipartMessage.getCount(); i++){
        Part p = multipartMessage.getBodyPart(i);
        String disposition = p.getDisposition();
        if((disposition != null) && ((disposition.equalsIgnoreCase(Part.ATTACHMENT))||
                ( disposition.equalsIgnoreCase(Part.INLINE)))){
          MimeBodyPart mimeBodyPart = (MimeBodyPart) p;
          file=mimeBodyPart.getContentType();



        }
      }
    }
    return  file;
  }

  @ReactMethod
  public void deleteMessages(String hostname, int port, String user, String pass, int TypeC,String messageID,Promise promise){
    IMAPFolder folder = null;
    Store store = null;
    String subject = null;
    Flags.Flag flag = null;

    try {
      Authenticator auth = new MailAuthenticator();
      Properties props = System.getProperties();
      // server setting
      props.put("mail.imap.host", hostname);
      props.put("mail.imap.port", port);
      Session session = Session.getDefaultInstance(props,null);

      if(TypeC==0){
        store = session.getStore("imap");
      }else{
        store = session.getStore("imaps");
      }


      store.connect(hostname,port,user,pass);
      folder = (IMAPFolder) store.getFolder("INBOX");
      folder.open(Folder.READ_WRITE);
      Message m = folder.getMessageByUID((long) Double.parseDouble(messageID));
      m.setFlag(Flags.Flag.DELETED,true);
      folder.close(true);
      WritableMap header =Arguments.createMap();
      header.putString("delete","true");
      promise.resolve(header);
    }catch (Error e){
      promise.reject("Error", e);

    } catch (NoSuchProviderException e) {
      promise.reject("Error", e);
      e.printStackTrace();
    } catch (MessagingException e) {
      promise.reject("Error", e);
      e.printStackTrace();
    }
  }
  @ReactMethod
  public void sendEmailMessage(String smtpHost, int smtpPort, final String user, final String pass, int typeConn, int  typeAuth,
                               String nameFrom, String emailFrom, String nameTo, String emailTo, String subjet,
                               String bodyMessage, String attachment, Promise promise){

    Properties properties = new Properties();
    properties.setProperty("mail.smtp.auth","true");
    properties.setProperty("mail.smtp.host",smtpHost);
    properties.setProperty("mail.smtp.port", String.valueOf(smtpPort));

    Session session = Session.getInstance(properties,
            new Authenticator() {
              @Override
              protected PasswordAuthentication getPasswordAuthentication() {
                return  new PasswordAuthentication(user,pass);
              }
            });

    Message msg = new MimeMessage(session);
    try {
      msg.setFrom(new InternetAddress(emailFrom));
      msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(emailTo));
      msg.setSubject(subjet);
      msg.setText(subjet);


      Transport.send(msg);
      WritableMap header =Arguments.createMap();
      header.putString("send","true");
      promise.resolve(header);
    } catch (MessagingException e) {
      e.printStackTrace();
    }


  }
}