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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOption);

  if (session?.user.role === "Admin") {
    const payslips = await db.payslips.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Delete payslip successfully",
        data: payslips,
      },
      {
        status: 200,
      }
    );
  } else {
    return NextResponse.json(
      { error: "You dont have access" },
      {
        status: 403,
      }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOption);

  if (session?.user.role === "Admin") {
    const body = await req.json();
    const {
      userId,
      regularFee,
      period,
      presence,
      transportFee,
      thrFee,
      otherFee,
      totalFee,
      position,
      levelId,
    } = body;

    const payslip = await db.payslips.update({
      where: { id: params.id },
      data: {
        userId: userId,
        period: period,
        regularFee: regularFee,
        presence: presence,
        transportFee: transportFee,
        thrFee: thrFee,
        otherFee: otherFee,
        totalFee: totalFee,
        position: position,
        levelId: levelId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "User update successfully",
        data: payslip,
      },
      {
        status: 200,
      }
    );
  } else {
    return NextResponse.json(
      { error: "You dont have access" },
      {
        status: 403,
      }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOption);

  if (
    session?.user.role === "Admin" ||
    session?.user.role === "Customer Service" ||
    session?.user.role === "Team Member"
  ) {
    try {
      //get all posts
      const payslips = await db.payslips.findUnique({
        select: {
          id: true,
          userId: true,
          period: true,
          regularFee: true,
          presence: true,
          transportFee: true,
          thrFee: true,
          otherFee: true,
          totalFee: true,
          position: true,
          levelId: true,
        },
        where: { id: params.id },
      });

      //return response JSON
      return NextResponse.json(
        {
          success: true,
          message: "Data Payslips",
          data: payslips,
        },
        {
          status: 200,
        }
      );
    } catch (error) {
      return NextResponse.json(
        { error: "Internal Server Error", message: error },
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
