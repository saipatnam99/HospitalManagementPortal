import { prisma } from "@/lib/prisma";
// import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
// const prisma = new PrismaClient();

export const GET = async (request: Request) => {
  try {
    const doctors = await prisma.doctor.findMany();
    return new NextResponse(JSON.stringify(doctors), { status: 200 })
  } catch (error) {
    return new NextResponse("Error in fetching doctors" + error, {
      status: 500,
    })

  }
};

export async function POST(req: Request) {
  const { email, fullName, phone, address, experience, specialization } = await req.json();

  // Hash password
  // const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newDoctor = await prisma.doctor.create({
      data: {
        email,
        fullName,
        phone,
        experience,
        specialization,
        address,
      },
    });
    return new NextResponse(
      JSON.stringify({ message: "Doctor is Added", doctor: newDoctor }),
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

}
