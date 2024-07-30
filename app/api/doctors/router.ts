
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export const GET = async (request: Request) => { 
  try {
    const doctors = await prisma.doctor.findMany();
    return new NextResponse(JSON.stringify(doctors), {status: 200})
  } catch (error) {
    return new NextResponse("Error in fetching categories" + error,{
        status: 500,
    })

  }
};

export const POST = async (request: Request) => {
    try{ 
    const body = await request.json();
     //const { name } = body;
   const { fullName, email, phone, specialization, experience, address } = body;

    // const newDoctor = await prisma.doctor.create({
    //   data: {...body}
    // });
    
            const newDoctor = await prisma.doctor.create({
              data: {
                
                fullName,
                email,
                phone,
                specialization,
                experience,
                address
              },
            });

    return new NextResponse(
      JSON.stringify({ message: "Doctor is Added", doctor: newDoctor}),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Error in addind Doctor",
        error,
      }),
      {
        status: 500,
      }
    );
  }
};


// Register a new doctor
// app.post('/doctors', async (req, res) => {
//   const { fullName, email, phoneNumber, specialization, yearsOfExperience, clinicAddress } = req.body;

//   try {
//     const newDoctor = await prisma.doctor.create({
//       data: {
//         fullName,
//         email,
//         phoneNumber,
//         specialization,
//         yearsOfExperience,
//         clinicAddress
//       }
//     });
//     res.json(newDoctor);
//   } catch (error) {
//     res.status(500).json({ error: 'Unable to register doctor' });
//   }
// });
