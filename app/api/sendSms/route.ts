import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const apiKey = '6d034298'; // Replace with your Vonage API Key
const apiSecret = 'pXwzNNJANz0vVfru'; // Replace with your Vonage API Secret
const fromNumber = 'YOUR_VONAGE_NUMBER'; // Replace with your Vonage phone number

async function sendSms(to: string, message: string) {
  try {
    const response = await axios.post('https://rest.nexmo.com/sms/json', null, {
      params: {
        api_key: apiKey,
        api_secret: apiSecret,
        to,
        from: fromNumber,
        text: message,
      },
    });

    if (response.data.messages[0].status !== '0') {
      throw new Error(`SMS failed with status: ${response.data.messages[0].status}`);
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { phoneNumbers, message } = await req.json();

    if (!phoneNumbers || !Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
      return NextResponse.json({ message: 'Phone numbers are required' }, { status: 400 });
    }

    if (!message) {
      return NextResponse.json({ message: 'Message content is required' }, { status: 400 });
    }

    for (const phoneNumber of phoneNumbers) {
      await sendSms(phoneNumber, message);
    }

    return NextResponse.json({ message: 'SMS sent successfully' }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in sending SMS:', error.message);
      return NextResponse.json({ message: 'Error in sending SMS', error: error.message }, { status: 500 });
    } else {
      console.error('Unknown error in sending SMS:', error);
      return NextResponse.json({ message: 'Unknown error in sending SMS' }, { status: 500 });
    }
  }
}
