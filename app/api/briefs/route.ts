import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { hash } from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import { assignIn } from "lodash-es";

export const config = {
  api: {
    bodyParser: true,
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, deadline, content, status, assign } = body;

    // Create data
    const newBrief = await db.brief.create({
      data: {
        title: title,
        deadline: deadline,
        content: content,
        status: "Assigned",
        assign: { connect: assign },
      },
    });

    return NextResponse.json(
      {
        brief: newBrief,
        message: "Brief created successfully",
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
}

export async function GET() {
  try {
    //get all posts
    const briefs = await db.brief.findMany({
      select: {
        id: true,
        title: true,
        deadline: true,
        content: true,
        status: true,
        assign: true,
        feedback: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    //return response JSON
    return NextResponse.json(
      {
        success: true,
        message: "List Data Briefs",
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
}

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const users = await db.user.delete({
//     where: { id: params.id },
//   });

//   return NextResponse.json(
//     {
//       success: true,
//       message: "Delete user successfully",
//       data: users,
//     },
//     {
//       status: 200,
//     }
//   );
// }
