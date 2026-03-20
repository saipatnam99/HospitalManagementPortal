import { NextResponse } from "next/server";
// import { PrismaClient } from '@prisma/client'
import { Types } from "mongoose";
import { prisma } from "@/lib/prisma";
// const prisma = new PrismaClient()


// get Doctor
export const GET = async (request: Request, context: { params: any }) => {
    const doctorId = context.params.doctorId;
    try {
      const doctor = await prisma.doctor.findUnique({
        where: {
          id: doctorId,
        }
      }); 
      return new NextResponse(JSON.stringify(doctor), { status: 200 });
    } catch (error) {
      return new NextResponse("Error in fetching doctor" + error, {
        status: 500,
      });
    }
  };








//update the service
export const PATCH = async (request: Request, context: { params: any }) => {
    const doctorId = context.params.doctorId;
    try {
      const body = await request.json();
      const {
        fullName, email, phone,address,specialization,experience
      } = body
  
      if (!doctorId) {
        return new NextResponse(
          JSON.stringify({ message: "Invalid Doctor  ID" }),
          {
            status: 400,
          }
        );
      }
  
      if (!Types.ObjectId.isValid(doctorId)) {
        return new NextResponse(JSON.stringify({ message: "Invalid doctorId"}), {
          status: 400,
        });
      }

      const updatedDoctor = await prisma.doctor.update({
        where: { id: doctorId},
        data: {
            fullName, email, phone,address,specialization,experience
        },
      });

      if (!updatedDoctor) {
        return new NextResponse(
          JSON.stringify({
            message: "Doctor not found or didn't update Doctor Successfully.",
          }),
          {
            status: 400,
          }
        );
      }
  
      // Return a success response
      return new NextResponse(
        JSON.stringify({
          message: "Doctor Updated Successfully",
          updatedDoctor
        }),
        {
          status: 200,
        }
      );
    } catch (error) {
      return new NextResponse(
        JSON.stringify({
          message: "Error updating Doctor",
          error,
        }),
        {
          status: 500,
        }
      );
    }
};


//delete the Offer
export const DELETE = async (request: Request, context: { params: any }) => {
  const doctorId = context.params.doctorId;
  try {
    if (!Types.ObjectId.isValid(doctorId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid doctorId" }), {
        status: 400,
      });
    }

    const doctor= await prisma.doctor.delete({
      where: {
        id: doctorId,
      },
    });

    if (!doctor) {
      return new NextResponse(JSON.stringify({ message: "Doctor not found" }), {
        status: 404,
      });
    }

    // Return a success response
    return new NextResponse(
      JSON.stringify({
        message: "doctor deleted successfully",
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Error deleting Doctor",
        error, 
      }),
      {
        status: 500,
      }
    );
  }
};