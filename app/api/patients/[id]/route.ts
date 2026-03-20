import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// import { PrismaClient } from '@prisma/client'
import { Types } from "mongoose";

// const prisma = new PrismaClient()


// get offer
export const GET = async (request: Request, context: { params: any }) => {
    const id = context.params.id;
    try {
      const patient = await prisma.patient.findUnique({
        where: {
          id: id,
        }
      }); 
      return new NextResponse(JSON.stringify(patient), { status: 200 });
    } catch (error) {
      return new NextResponse("Error in fetching Patient" + error, {
        status: 500,
      });
    }
  };








//update the service
export const PATCH = async (request: Request, context: { params: any }) => {
    const id = context.params.id;
    try {
      const body = await request.json();
      const {
        firstName, lastName, age, dateOfBirth, gender, phone, email,
        address, addressLine2, city, state, postalCode,
        paymentMethod, cashAmount, cardType, cardDetails, upiReceived,
      } = body
  
      if (!id) {
        return new NextResponse(
          JSON.stringify({ message: "Invalid Patient ID" }),
          {
            status: 400,
          }
        );
      }
  
      if (!Types.ObjectId.isValid(id)) {
        return new NextResponse(JSON.stringify({ message: "Invalid Patient ID"}), {
          status: 400,
        });
      }

      const updatedPatient = await prisma.patient.update({
        where: { id: id},
        data: {
                firstName, lastName, age, dateOfBirth, gender, phone, email,
                address, addressLine2, city, state, postalCode,
                paymentMethod, cashAmount, cardType, cardDetails, upiReceived,
              
        },
      });

      if (!updatedPatient) {
        return new NextResponse(
          JSON.stringify({
            message: "Patient not found or didn't update Patient Successfully.",
          }),
          {
            status: 400,
          }
        );
      }
  
      // Return a success response
      return new NextResponse(
        JSON.stringify({
          message: "Patient Updated Successfully",
          updatedPatient
        }),
        {
          status: 200,
        }
      );
    } catch (error) {
      return new NextResponse(
        JSON.stringify({
          message: "Error updating Patient",
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
  const id = context.params.id;
  try {
    if (!Types.ObjectId.isValid(id)) {
      return new NextResponse(JSON.stringify({ message: "Invalid PatientId" }), {
        status: 400,
      });
    }

    const patient= await prisma.patient.delete({
      where: {
        id: id,
      },
    });

    if (!patient) {
      return new NextResponse(JSON.stringify({ message: "Patient not found" }), {
        status: 404,
      });
    }

    // Return a success response
    return new NextResponse(
      JSON.stringify({
        message: "Patient deleted successfully",
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Error deleting Patient",
        error, 
      }),
      {
        status: 500,
      }
    );
  }
};