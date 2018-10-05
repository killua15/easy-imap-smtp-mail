package com.reactlibrary;

import java.net.PasswordAuthentication;

public class MailAuthenticator extends javax.mail.Authenticator {
    private String username = "a";
    private String password = "123";
    public MailAuthenticator() {
        super();
    }

    @Override
    protected javax.mail.PasswordAuthentication getPasswordAuthentication() {
        return new javax.mail.PasswordAuthentication(username,password);
    }
}
