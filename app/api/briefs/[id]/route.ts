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

  if (
    session?.user.role === "Admin" ||
    session?.user.role === "Customer Service"
  ) {
    const briefs = await db.brief.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Delete brief successfully",
        data: briefs,
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

  if (
    session?.user.role === "Admin" ||
    session?.user.role === "Customer Service" ||
    session?.user.role === "Team Member"
  ) {
    const body = await req.json();
    const { title, deadline, content, status, assign } = body;

    const briefs = await db.brief.update({
      where: { id: params.id },
      data: {
        title: title,
        deadline: deadline,
        content: content,
        status: status,
        assign: { set: assign },
      },
    });

    const newBriefNotif = await db.briefNotification.create({
      data: {
        message: `Status brief "${briefs.title}" just updated to ${briefs.status}`,
        briefId: briefs.id,
        assign: { connect: assign },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Brief update successfully",
        data: briefs,
        notification: newBriefNotif,
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
    const briefs = await db.brief.findUnique({
      select: {
        id: true,
        title: true,
        deadline: true,
        content: true,
        status: true,
        assign: true,
        authorId: true,
        feedback: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { id: params.id },
    });

    //return response JSON
    return NextResponse.json(
      {
        success: true,
        message: "Data Briefs",
        data: briefs,
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
