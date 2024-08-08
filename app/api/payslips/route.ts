import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { hash } from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/auth";

// export const config = {
//   api: {
//     bodyParser: true,
//   },
// };

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOption);

  if (session?.user.role === "Admin") {
    try {
      const body = await req.json();
      const {
        userId,
        regularFee,
        period,
        presence,
        transportFee,
        totalFee,
        additionalFee,
      } = body;

      // Create data
      const newPayslip = await db.payslips.create({
        data: {
          userId: userId,
          regularFee: regularFee,
          additionalFee: additionalFee,
          period: period,
          presence: presence,
          transportFee: transportFee,
          totalFee: totalFee,
        },
      });

      return NextResponse.json(
        {
          payslip: newPayslip,
          message: "Payslip created successfully",
        },
        { status: 201 },
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        {
          status: 500,
        },
      );
    }
  } else {
    return NextResponse.json(
      { error: "You dont have access" },
      {
        status: 403,
      },
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOption);

  if (
    session?.user.role === "Admin" ||
    session?.user.role === "Customer Service" ||
    session?.user.role === "Team Member"
  ) {
    try {
      //get all posts
      const payslips = await db.payslips.findMany({
        select: {
          id: true,
          userId: true,
          period: true,
          regularFee: true,
          additionalFee: true,
          presence: true,
          transportFee: true,
          totalFee: true,
          createdAt: true,
        },
      });

      //return response JSON
      return NextResponse.json(
        {
          success: true,
          message: "List Data Payslips",
          data: payslips,
        },
        {
          status: 200,
        },
      );
    } catch (error) {
      return NextResponse.json(
        { error: "Internal Server Error" },
        {
          status: 500,
        },
      );
    }
  } else {
    return NextResponse.json(
      { error: "You dont have access" },
      {
        status: 403,
      },
    );
  }
}
