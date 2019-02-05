
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 *
 * @param {*} receiverEmail
 * @param {*} subject
 * @param {*} html
 */

const sendEmail = (receiverEmail, subject, html) => {
  sgMail.send({
    to: receiverEmail,
    from: 'AuthorsHaven@Andela.com',
    subject,
    html
  });
};

export default sendEmail;
