#import "EasyImapSmtpMail.h"
#import <React/RCTLog.h>
#import <MailCore/MailCore.h>
#import "BWJSONMatcher/NSObject+BWJSONMatcher.h"
#import "BWJSONMatcher/BWJSONMatcher.h"
@implementation EasyImapSmtpMail

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(aa:(RCTResponseSenderBlock)callback)
{
  // Your implementation here
 // callback(@[[NSNull null], hostName]);
}
RCT_REMAP_METHOD(connectFechMail,
                  hostNameE:(NSString *)hostName
                  portE:(int )port
                  userNameE:(NSString *)userName
                  passE:(NSString *)pass
                  typeConnectionE:(int )typeConnection
                  cantMailE:(int) cantMail
                 findEventsWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject
                 ){
  MCOIMAPSession *session = [[MCOIMAPSession alloc] init];
  [session setHostname:hostName];
  [session setPort:port];
  [session setUsername:userName];
  [session setPassword:pass];
  if(typeConnection==0){
    [session setConnectionType:MCOConnectionTypeClear];
  }else if (typeConnection==1){
    [session setConnectionType:MCOConnectionTypeStartTLS];
  }else{
    [session setConnectionType:MCOConnectionTypeTLS];
  }
  
  MCOIMAPMessagesRequestKind requestKind = MCOIMAPMessagesRequestKindFullHeaders;
  
  NSString *folder = @"INBOX";
  
  MCOIndexSet *uids = [MCOIndexSet indexSetWithRange:MCORangeMake(1, UINT64_MAX)];
  
  __block NSMutableArray* EasyMails = [[NSMutableArray alloc] init];
  __block NSMutableArray* EasyHeaders = [[NSMutableArray alloc] init];
  __block NSMutableArray * datosFetches = [[NSMutableArray alloc] init];
  
  //Operacion para fetch all mensages
  MCOIMAPFetchMessagesOperation *fetchOperation = [session fetchMessagesOperationWithFolder:folder requestKind:requestKind uids:uids];
  [fetchOperation start:^(NSError * error, NSArray * fetchedMessages, MCOIndexSet * vanishedMessages) {
    int hasta= cantMail;
    
    for(int i=(int)[fetchedMessages count]-1; i>1;  i--){
    
      if(hasta>0){
        MCOIMAPMessage *m = fetchedMessages[i];
        MCOIMAPFetchContentOperation *operation = [session fetchMessageOperationWithFolder:@"INBOX" uid:m.uid];
      
        [operation start:^(NSError *error, NSData *data) {
          MCOMessageParser *messageParser = [[MCOMessageParser alloc] initWithData:data];
        
          NSMutableArray * datosMessage = [[NSMutableArray alloc] init];
          
          NSString* msgHTMLBody = [messageParser htmlBodyRendering];
          msgHTMLBody = [[msgHTMLBody mco_flattenHTML] stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];
          [datosMessage addObject:[messageParser header].messageID];
          [datosMessage addObject:msgHTMLBody];
          NSArray * attachment =[messageParser attachments];
          [datosMessage addObject:attachment];
          
          [EasyHeaders addObject:datosMessage];
          [datosFetches addObject:fetchedMessages[i]];
          
          if(i==0 || hasta-1==0){
          
            [EasyMails addObject:EasyHeaders];
             [EasyMails addObject:datosFetches];
            
            if(EasyMails){
              NSString *jsonObject = [EasyMails toJSONObject];
              NSLog(@"mis correos %@", EasyMails);
              resolve(jsonObject);
              return;
            }else{
              reject(@"no_events", @"Error Promise", error);
              return;
            }
          }
        }];
      }else{
        break;
      }
      hasta--;
    }
  }];
}
RCT_REMAP_METHOD(deleteMessages,
                 hostNameE:(NSString *)hostName
                 portE:(int )port
                 userNameE:(NSString *)userName
                 passE:(NSString *)pass
                 typeConnectionE:(int )typeConnection
                 sequenseNumberE:(int )sequenseNumber
                 findEventsWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject
                 )
{
  MCOIMAPSession *session = [[MCOIMAPSession alloc] init];
  [session setHostname:hostName];
  [session setPort:port];
  [session setUsername:userName];
  [session setPassword:pass];
  if(typeConnection==0){
    [session setConnectionType:MCOConnectionTypeClear];
  }else if (typeConnection==1){
    [session setConnectionType:MCOConnectionTypeStartTLS];
  }else{
    [session setConnectionType:MCOConnectionTypeTLS];
  }
  int MailNumber =sequenseNumber;
  MCOIMAPMessagesRequestKind requestKind = MCOIMAPMessagesRequestKindFullHeaders;
  
  NSString *folder = @"INBOX";
  MCOIndexSet *uids = [MCOIndexSet indexSetWithRange:MCORangeMake(1, UINT64_MAX)];
  MCOIMAPFetchMessagesOperation *fetchOperation = [session fetchMessagesOperationWithFolder:folder requestKind:requestKind uids:uids];
  [fetchOperation start:^(NSError * error, NSArray * fetchedMessages, MCOIndexSet * vanishedMessages) {
    
    for (int i=(int)[fetchedMessages count]-1; i>0; i--) {
      MCOIMAPMessage *m =fetchedMessages[i];
      
      if(MailNumber==[m uid]){
          MCOMessageFlag newFlag= [m flags];
          newFlag |= MCOMessageFlagDeleted;
          newFlag |= MCOMessageFlagFlagged;
          MCOIndexSet * uid = [MCOIndexSet indexSetWithIndex:m.uid];
          MCOIMAPOperation * op = [session storeFlagsOperationWithFolder:folder uids:uid kind:MCOIMAPStoreFlagsRequestKindSet flags:newFlag];
          [op start:^(NSError *  error) {
            if(!error){
              
              MCOIMAPOperation * delOP = [session expungeOperation:@"INBOX"];
              NSMutableArray * arrayPromise =[[NSMutableArray alloc] init];
              [arrayPromise addObject:@"true"];
              [arrayPromise addObject:@"0"];
              [delOP start:^(NSError *  error) {
                if(!error){
                  resolve(@"delete_success");
                  NSLog(@"Flag chage successfuly");
                }else{
                  reject(@"no_deleted", @"Error Promise", error);
                }
               
              }];
            }
            
          }];
      }
    }
  }];

  
}
RCT_REMAP_METHOD(sendEmailMessage,
                  smtpHost:(NSString *)hostName
                  smtpPortE:(int )port
                  userNameE:(NSString *)userName
                  passE:(NSString *)pass
                  typeConnectionE:(int )typeConnection
                  typeAuthE:(int )typeAuth
                  nameFromE:(NSString * )nameFrom
                  mailFromE:(NSString * )mailFrom
                  nameToE:(NSString * )nameTo
                  mailToE:(NSString * )mailTo
                  subjetE:(NSString * )subjet
                  bodyMessageE:(NSString * )bodyMessage
                  attachmentE:(NSString * )attachment
                 findEventsWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject
                 )
{
  MCOSMTPSession *smtpSession = [[MCOSMTPSession alloc] init];
  smtpSession.hostname = hostName;
  smtpSession.port = port;
  smtpSession.username = userName;
  smtpSession.password = pass;
  if(typeAuth == 0){
    
     smtpSession.authType = MCOAuthTypeSASLNone;
  }else if(typeAuth==1){
     smtpSession.authType = MCOAuthTypeSASLPlain;
  }else if(typeAuth==2){
    smtpSession.authType = MCOAuthTypeSASLLogin;
  }
  
  smtpSession.connectionType = MCOConnectionTypeTLS;
  
  MCOMessageBuilder *builder = [[MCOMessageBuilder alloc] init];
  MCOAddress *from = [MCOAddress addressWithDisplayName:nameFrom
                                                mailbox:mailFrom];
  MCOAddress *to = [MCOAddress addressWithDisplayName:nameTo
                                              mailbox:mailTo];
  [[builder header] setFrom:from];
  [[builder header] setTo:@[to]];
  [[builder header] setSubject:subjet];
  if(![attachment isEqualToString:@""]){
    //NSData * data = [[NSData  alloc] ini]
    
    NSString *attachmentPath = attachment;
    MCOAttachment *attachment = [MCOAttachment attachmentWithContentsOfFile:attachmentPath];
    [builder addAttachment:attachment];
  }
  
  [builder setHTMLBody:bodyMessage];
  NSData * rfc822Data = [builder data];
  
  MCOSMTPSendOperation *sendOperation =
  [smtpSession sendOperationWithData:rfc822Data];
  [sendOperation start:^(NSError *error) {
    if(error) {
      reject(@"no_deleted", @"Error Promise", error);
      NSLog(@"Error sending email: %@", error);
    } else {
      NSLog(@"Successfully sent email!");
      NSMutableArray * arrayPromise =[[NSMutableArray alloc] init];
      [arrayPromise addObject:@"true"];
      [arrayPromise addObject:@"0"];
    }
  }];
  
  
}


@end
