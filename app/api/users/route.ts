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
      const { name, email, password, role, roleMemberId, levelId } = body;

      // Check email
      const existingUserByEmail = await db.user.findUnique({
        where: { email: email },
      });
      if (existingUserByEmail) {
        return NextResponse.json(
          { user: null, message: "User with this email already exists" },
          { status: 409 },
        );
      }

      // Hash password
      const hashedPassword = await hash(password, 10);

      // Create data
      const newUser = await db.user.create({
        data: {
          name: name,
          email: email,
          password: hashedPassword,
          role: role,
          roleMemberId: roleMemberId,
          levelId: levelId,
        },
      });

      const { password: newUserPassword, ...rest } = newUser;

      return NextResponse.json(
        {
          user: rest,
          message: "User created successfully",
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
      const users = await db.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          roleMemberId: true,
          levelId: true,
          briefs: true,
          feedbacks: true,
          briefNotification: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      //return response JSON
      return NextResponse.json(
        {
          success: true,
          message: "List Data Users",
          data: users,
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
