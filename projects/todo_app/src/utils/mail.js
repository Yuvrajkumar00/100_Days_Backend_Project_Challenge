import config from "../configs/config.js";
import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendMail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            // Appears in header & footer of e-mails
            name: 'Mailgen',
            link: 'https://mailgen.js/'
            // Optional product logo
            // logo: 'https://mailgen.js/img/logo.png'
        }
    });

    const emailBody = mailGenerator.generate(options.mailgenContent);

    const emailText = mailGenerator.generatePlaintext(options.mailgenContent);

    const transporter = nodemailer.createTransport({
        host: config.MAILTRAP_HOST,
        port: config.MAILTRAP_PORT,
        secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
        auth: {
            user: config.MAILTRAP_USERNAME,
            pass: config.MAILTRAP_PASSWORD,
        },
    });

    const mail = {
        from: "yuvrajkumar9572@gmail.com", // sender address
        to: options.email, // list of recipients
        subject: options.subject, // subject line
        text: emailText, // plain text body
        html: emailBody, // HTML body
    }

    await transporter.sendMail(mail);
}


const emailVerificationMailgenContent = (name, verificationUrl) => {
    return {
        body: {
            name: name,
            intro: 'Welcome to Mailgen! We\'re very excited to have you on board.',
            action: {
                instructions: 'To get started with Mailgen, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Confirm your account',
                    link: verificationUrl,
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
}

export {emailVerificationMailgenContent, sendMail}