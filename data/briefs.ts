import { toDate } from "date-fns";
import { random } from "lodash-es";
import { Brief, BriefsStatus } from "@/types/brief";
import { nanoid } from "nanoid";
import { CreateSeederProps } from "@/types/seeder";

type AssignBrief = Pick<Brief, "assign">;
type CreateBriefsProps = Partial<AssignBrief> & CreateSeederProps;

const BRIEF_STATUS: BriefsStatus[] = [
  "Assigned",
  "In Review",
  "Waiting for Client Feedback",
  "Correction",
  "In Progress",
  "Need Review",
  "Done",
];

export function createBriefs({
  amount = 1,
  assign,
}: CreateBriefsProps): Brief[] {
  const result: Brief[] = [];

  for (let x = 0; x < amount; x++) {
    const TIME = toDate(Date.now());

    result.push({
      id: nanoid(4),
      authorId: nanoid(4),
      description: `Deskripsi Brief ${x + 1}`,
      title: `Judul Brief ${x + 1}`,
      status: BRIEF_STATUS[random(0, BRIEF_STATUS.length - 1)],
      createdAt: TIME,
      updatedAt: TIME,
      assign: !!assign ? assign : [],
      content: "",
      feedback: [],
    });
  }

  return result;
}
