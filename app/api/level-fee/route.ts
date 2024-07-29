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
      const { level, regularFee } = body;

      // Create data
      const newPayslip = await db.levelFee.create({
        data: {
          level: level,
          regularFee: regularFee,
        },
      });

      return NextResponse.json(
        {
          payslip: newPayslip,
          message: "Level fee created successfully",
        },
        { status: 201 }
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        {
          status: 500,
        }
      );
    }
  } else {
    return NextResponse.json(
      { error: "You dont have access" },
      {
        status: 403,
      }
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
      const payslips = await db.levelFee.findMany({
        select: {
          id: true,
          level: true,
          regularFee: true,
          createdAt: true,
        },
      });

      //return response JSON
      return NextResponse.json(
        {
          success: true,
          message: "List Data Level Fee",
          data: payslips,
        },
        {
          status: 200,
        }
      );
    } catch (error) {
      return NextResponse.json(
        { error: "Internal Server Error" },
        {
          status: 500,
        }
      );
    }
  } else {
    return NextResponse.json(
      { error: "You dont have access" },
      {
        status: 403,
      }
    );
  }
}
