import nodemailer from 'nodemailer';
import { format } from 'date-fns';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const emailService = {
  async sendInvoiceEmail(to: string, invoice: any) {
    const dueDate = new Date(invoice.due_date * 1000);
    const formattedDueDate = format(dueDate, 'MMMM dd, yyyy');

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: `Invoice #${invoice.number} from Titan Cloud AI`,
      html: `
        <h2>Invoice #${invoice.number}</h2>
        <p>Due Date: ${formattedDueDate}</p>
        <p>Amount Due: $${(invoice.amount_due / 100).toFixed(2)}</p>
        <p>View your invoice: ${invoice.hosted_invoice_url}</p>
      `,
    });
  },

  async sendPaymentReminder(to: string, invoice: any) {
    const dueDate = new Date(invoice.due_date * 1000);
    const formattedDueDate = format(dueDate, 'MMMM dd, yyyy');

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: `Payment Reminder: Invoice #${invoice.number} Due Soon`,
      html: `
        <h2>Payment Reminder</h2>
        <p>This is a friendly reminder that invoice #${invoice.number} is due on ${formattedDueDate}.</p>
        <p>Amount Due: $${(invoice.amount_due / 100).toFixed(2)}</p>
        <p>Pay now: ${invoice.hosted_invoice_url}</p>
      `,
    });
  },

  async sendOverdueNotice(to: string, invoice: any) {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: `Overdue Payment Notice: Invoice #${invoice.number}`,
      html: `
        <h2>Overdue Payment Notice</h2>
        <p>Invoice #${invoice.number} is now overdue.</p>
        <p>Amount Due: $${(invoice.amount_due / 100).toFixed(2)}</p>
        <p>Please make your payment as soon as possible to avoid service interruption.</p>
        <p>Pay now: ${invoice.hosted_invoice_url}</p>
      `,
    });
  },
};