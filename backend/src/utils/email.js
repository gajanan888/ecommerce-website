const nodemailer = require('nodemailer');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendOrderConfirmation = async (userEmail, orderData) => {
  try {
    const htmlContent = `
      <h2>Order Confirmation</h2>
      <p>Thank you for your purchase!</p>
      <p><strong>Order ID:</strong> ${orderData._id}</p>
      <p><strong>Total Amount:</strong> $${orderData.totalPrice}</p>
      <p><strong>Status:</strong> ${orderData.status}</p>
      <h3>Items:</h3>
      <ul>
        ${orderData.items
          .map(
            (item) =>
              `<li>${item.name} x ${item.quantity} - $${item.price}</li>`
          )
          .join('')}
      </ul>
      <p>Your order will be shipped soon. Track your order using Order ID.</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Order Confirmation - #${orderData._id}`,
      html: htmlContent,
    });

    logger.info(`Order confirmation email sent to ${userEmail}`);
  } catch (error) {
    logger.error('Failed to send order confirmation email:', error);
  }
};

const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const htmlContent = `
      <h2>Welcome to Our E-commerce Store!</h2>
      <p>Hi ${userName},</p>
      <p>Thank you for registering with us. We're excited to have you on board!</p>
      <p>Start exploring our products and enjoy exclusive offers.</p>
      <p>Best regards,<br>The Store Team</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Welcome to Our Store',
      html: htmlContent,
    });

    logger.info(`Welcome email sent to ${userEmail}`);
  } catch (error) {
    logger.error('Failed to send welcome email:', error);
  }
};

const sendShippingUpdate = async (userEmail, orderData) => {
  try {
    const htmlContent = `
      <h2>Order Shipped!</h2>
      <p>Your order has been shipped!</p>
      <p><strong>Order ID:</strong> ${orderData._id}</p>
      <p><strong>Tracking Number:</strong> ${
        orderData.trackingNumber || 'N/A'
      }</p>
      <p>Track your shipment using the tracking number above.</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Your Order Shipped - #${orderData._id}`,
      html: htmlContent,
    });

    logger.info(`Shipping update email sent to ${userEmail}`);
  } catch (error) {
    logger.error('Failed to send shipping email:', error);
  }
};

module.exports = {
  sendOrderConfirmation,
  sendWelcomeEmail,
  sendShippingUpdate,
};
