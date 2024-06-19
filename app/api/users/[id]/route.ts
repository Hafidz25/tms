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
    const users = await db.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Delete user successfully",
        data: users,
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
    const { name, email, password, role } = body;

    // Hash password
    //   const hashedPassword = await hash(password, 10);
    const users = await db.user.update({
      where: { id: params.id },
      data: {
        name: name,
        email: email,
        //   password: hashedPassword,
        role: role,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "User update successfully",
        data: users,
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

  try {
    //get all posts
    const user = await db.user.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        briefs: true,
      },
      where: { id: params.id },
    });

    //return response JSON
    return NextResponse.json(
      {
        success: true,
        message: "Data User",
        data: user,
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

  // if (
  //   session?.user.role === "Admin" ||
  //   session?.user.role === "Customer Service" ||
  //   session?.user.role === "Team Member"
  // ) {

  // } else {
  //   return NextResponse.json(
  //     { error: "You dont have access" },
  //     {
  //       status: 403,
  //     }
  //   );
  // }
}
