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
      const { name, fee, roleId, user } = body;

      // Create data
      const newLevel = await db.level.create({
        data: {
          name: name,
          fee: fee,
          roleId: roleId,
          user: { connect: user },
        },
      });

      return NextResponse.json(
        {
          level: newLevel,
          message: "Level fee created successfully",
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
      const level = await db.level.findMany({
        select: {
          id: true,
          name: true,
          fee: true,
          roleId: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          createdAt: true,
        },
      });

      //return response JSON
      return NextResponse.json(
        {
          success: true,
          message: "List Data Level Fee",
          data: level,
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
