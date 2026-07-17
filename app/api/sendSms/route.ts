import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

async function sendSms(to: string, message: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    return {
      success: true,
      demoMode: true,
      message: `Demo SMS ready for ${to}: ${message}`,
    };
  }

  const client = twilio(accountSid, authToken);
  const result = await client.messages.create({
    body: message,
    from: fromNumber,
    to,
  });

  return { success: true, demoMode: false, sid: result.sid };
}

export async function POST(req: NextRequest) {
  try {
    const { phoneNumbers, message } = await req.json();

    if (!phoneNumbers || !Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
      return NextResponse.json({ message: "Phone numbers are required" }, { status: 400 });
    }

    if (!message) {
      return NextResponse.json({ message: "Message content is required" }, { status: 400 });
    }

    const results = await Promise.all(phoneNumbers.map((phoneNumber: string) => sendSms(phoneNumber, message)));

    return NextResponse.json({ message: "Reminder queued successfully", results }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in sending SMS:", error.message);
      return NextResponse.json({ message: "Error in sending SMS", error: error.message }, { status: 500 });
    }

    console.error("Unknown error in sending SMS:", error);
    return NextResponse.json({ message: "Unknown error in sending SMS" }, { status: 500 });
  }
}
