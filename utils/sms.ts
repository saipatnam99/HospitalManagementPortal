import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { date, time, phoneNumbers } = req.body;

  try {
    if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
      throw new Error('phoneNumbers must be a non-empty array');
    }

    const apiKey = '6d034298'; // Replace with your Vonage API Key
    const apiSecret = 'pXwzNNJANz0vVfru'; // Replace with your Vonage API Secret
    const fromNumber = '7032596476'; // Replace with your Vonage phone number

    const smsPromises = phoneNumbers.map(phoneNumber =>
      axios.post('https://rest.nexmo.com/sms/json', null, {
        params: {
          api_key: apiKey,
          api_secret: apiSecret,
          to: phoneNumber,
          from: fromNumber,
          text: `Your appointment is scheduled on ${date} at ${time}.`,
        },
      })
    );

    const smsResponses = await Promise.all(smsPromises);

    const failedMessages = smsResponses.filter(response => response.data.messages[0].status !== '0');

    if (failedMessages.length) {
      throw new Error('Some messages failed to send');
    }

    res.status(200).json({ message: 'Messages sent successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
