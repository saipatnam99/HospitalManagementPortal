import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'
import { Types } from "mongoose";

const prisma = new PrismaClient()


// get offer
export const GET = async (request: Request, context: { params: any }) => {
    const appointmentId = context.params.appointmentId;
    try {
      const appointment = await prisma.appointment.findUnique({
        where: {
          id: appointmentId,
        }
      }); 
      return new NextResponse(JSON.stringify(appointment), { status: 200 });
    } catch (error) {
      return new NextResponse("Error in fetching doctor" + error, {
        status: 500,
      });
    }
  };


  export const PATCH = async (request: Request, context: { params: any }) => {
    const appointmentId = context.params.appointmentId;
    try {
      const body = await request.json();
      const {
        date,
        time,patientId,doctorId
        // firstName,
        // lastName,
        // gender,
        // phone,
        // address,
        // addressLine2,
        // city,
        // state,
        // postalCode,
        // email,
        // appliedBefore,
        // department,
        // procedure,
        // preferredDate,
        // preferredTime,
      } = body
  
      if (!appointmentId) {
        return new NextResponse(
          JSON.stringify({ message: "Invalid Offer ID" }),
          {
            status: 400,
          }
        );
      }
  
      if (!Types.ObjectId.isValid(appointmentId)) {
        return new NextResponse(JSON.stringify({ message: "Invalid offerId"}), {
          status: 400,
        });
      }

      const updatedAppointment= await prisma.appointment.update({
        where: { id: appointmentId},
        data: {
          date: new Date(date),
          time, patientId,doctorId,
            // firstName,
            // lastName,
            // gender,
            // phone,
            // address,
            // addressLine2,
            // city,
            // state,
            // postalCode,
            // email,
            // appliedBefore : appliedBefore === 'yes',
            // department,
            // procedure,
            // preferredDate: new Date(preferredDate), // Convert date string to Date object
            // preferredTime,
        },
      });

      if (!updatedAppointment) {
        return new NextResponse(
          JSON.stringify({
            message: "Offer not found or didn't update Offer Successfully.",
          }),
          {
            status: 400,
          }
        );
      }
  
      // Return a success response
      return new NextResponse(
        JSON.stringify({
          message: "Offer Updated Successfully",
          updatedAppointment
        }),
        {
          status: 200,
        }
      );
    } catch (error) {
      return new NextResponse(
        JSON.stringify({
          message: "Error updating Offer",
          error,
        }),
        {
          status: 500,
        }
      );
    }
};

export const DELETE = async (request: Request, context: { params: any }) => {
    const appointmentId = context.params.appointmentId;
    try {
      if (!Types.ObjectId.isValid(appointmentId)) {
        return new NextResponse(JSON.stringify({ message: "Invalid offerId" }), {
          status: 400,
        });
      }
  
      const appointment= await prisma.appointment.delete({
        where: {
          id: appointmentId,
        },
      });
  
      if (!appointment) {
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

