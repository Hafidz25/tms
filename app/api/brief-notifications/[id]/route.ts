import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { hash } from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/auth";

export const config = {
  api: {
    bodyParser: true,
  },
};

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOption);

  const briefNotif = await db.briefNotification.delete({
    where: { id: params.id },
  });

  return NextResponse.json(
    {
      success: true,
      message: "Delete brief notification successfully",
      data: briefNotif,
    },
    {
      status: 200,
    }
  );

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOption);

  const body = await req.json();
  const { read } = body;

  const briefNotif = await db.briefNotification.update({
    where: { id: params.id },
    data: {
      read: read,
    },
  });

  return NextResponse.json(
    {
      success: true,
      message: "Brief norification update successfully",
      data: briefNotif,
    },
    {
      status: 200,
    }
  );

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
