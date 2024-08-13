
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export const GET = async (request: Request) => {
  try {
    const patients = await prisma.patient.findMany();
    return new NextResponse(JSON.stringify(patients), { status: 200 })
  } catch (error) {
    return new NextResponse("Error in fetching categories" + error, {
      status: 500,
    })

  }
};

export async function POST(req: Request) {
  const {
          firstName, lastName, age, dateOfBirth, gender, phone, email,
          address, addressLine2, city, state, postalCode,
          paymentMethod, cashAmount, cardType, cardDetails, upiReceived,
        } = await req.json();
 // const { email, fullName, phone, address, experience, specialization } = await req.json();

  // Hash password
  // const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newPatient = await prisma.patient.create({
      data: {
                  firstName,
                  lastName,
                  age: parseInt(age, 10),
          dateOfBirth: new Date(dateOfBirth),
                  gender,
                  phone,
                  email,
                  address,
                  addressLine2,
                  city,
                  state,
                  postalCode,
                  paymentMethod,
                  cashAmount,
                  cardType,
                  cardDetails,
                  upiReceived,
                },
              });
    return new NextResponse(
      JSON.stringify({ message: "Patient is Added", patient: newPatient }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Error in adding Patient",
        error,
      }),
      {
        status: 500,
      }
    );
  }
 
}


