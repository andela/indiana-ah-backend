
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * @description Send email notification
 * @param {string} receiverEmail
 * @param {string} subject
 * @param {string} html
 */

const sendEmail = (receiverEmail, subject, html) => {
  sgMail.send({
    to: receiverEmail,
    from: 'no-reply@authors-haven.com',
    subject,
    html
  });
};

export default sendEmail;
