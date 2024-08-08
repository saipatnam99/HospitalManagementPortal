
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export const GET = async (request: Request) => {
  try {
    const doctors = await prisma.doctor.findMany();
    return new NextResponse(JSON.stringify(doctors), { status: 200 })
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
      JSON.stringify({ message: "Doctor is Added", patient: newPatient }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Error in adding Doctor",
        error,
      }),
      {
        status: 500,
      }
    );
  }
  //   return NextResponse.json({ newDoctor }, { status: 201 });
  // } catch (error) {
  //   return NextResponse.json({ message: 'Error creating doctor' }, { status: 500 });
  // }
}

// import { NextApiRequest, NextApiResponse } from 'next';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export default async function POST(req: NextApiRequest, res: NextApiResponse) {

//     const {
//       firstName, lastName, age, dateOfBirth, gender, phone, email,
//       address, addressLine2, city, state, postalCode,
//       paymentMethod, cashAmount, cardType, cardDetails, upiReceived,
//     } = req.body;

//     try {
//       const patient = await prisma.patient.create({
//         data: {
//           firstName,
//           lastName,
//           age,
//           dateOfBirth: new Date(dateOfBirth),
//           gender,
//           phone,
//           email,
//           address,
//           addressLine2,
//           city,
//           state,
//           postalCode,
//           paymentMethod,
//           cashAmount,
//           cardType,
//           cardDetails,
//           upiReceived,
//         },
//       });

//       res.status(200).json(patient);
//     } catch (error) {
//       res.status(500).json({ error: "Failed to register patient" });
//     }
  
// }
