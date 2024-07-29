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
    const payslips = await db.levelFee.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Delete level fee successfully",
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
    const { level, reqularFee } = body;

    // Hash password
    //   const hashedPassword = await hash(password, 10);
    const levelUpdate = await db.levelFee.update({
      where: { id: params.id },
      data: {
        level: level,
        regularFee: reqularFee,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Level fee update successfully",
        data: levelUpdate,
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
      const payslips = await db.levelFee.findUnique({
        select: {
          id: true,
          level: true,
          regularFee: true,
        },
        where: { id: params.id },
      });

      //return response JSON
      return NextResponse.json(
        {
          success: true,
          message: "Data Level Fee",
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
