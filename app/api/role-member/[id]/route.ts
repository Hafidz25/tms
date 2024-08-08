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
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOption);

  if (session?.user.role === "Admin") {
    const role = await db.roleMember.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Delete role member successfully",
        data: role,
      },
      {
        status: 200,
      },
    );
  } else {
    return NextResponse.json(
      { error: "You dont have access" },
      {
        status: 403,
      },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOption);

  if (session?.user.role === "Admin") {
    const body = await req.json();
    const { name, user } = body;

    // Hash password
    //   const hashedPassword = await hash(password, 10);
    const roleUpdate = await db.roleMember.update({
      where: { id: params.id },
      data: {
        name: name,
        user: { set: user },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Role member update successfully",
        data: roleUpdate,
      },
      {
        status: 200,
      },
    );
  } else {
    return NextResponse.json(
      { error: "You dont have access" },
      {
        status: 403,
      },
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOption);

  if (
    session?.user.role === "Admin" ||
    session?.user.role === "Customer Service" ||
    session?.user.role === "Team Member"
  ) {
    try {
      //get all posts
      const role = await db.roleMember.findUnique({
        select: {
          id: true,
          name: true,
          level: {
            select: {
              id: true,
              name: true,
              fee: true,
            },
          },
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
        where: { id: params.id },
      });

      //return response JSON
      return NextResponse.json(
        {
          success: true,
          message: "Data role member",
          data: role,
        },
        {
          status: 200,
        },
      );
    } catch (error) {
      return NextResponse.json(
        { error: "Internal Server Error", message: error },
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
