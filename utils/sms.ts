// utils/sendSms.ts
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const client = twilio(accountSid, authToken);

export const sendSms = async (to: string, message: string) => {
  try {
    if (!to) {
      throw new Error('The "to" phone number is required');
    }

    console.log('Sending SMS to:', to); // Log the recipient's phone number
    console.log('Message:', message); // Log the message content

    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    console.log('SMS sent successfully:', response.sid);
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
};
