import { toDate } from "date-fns";
import { random } from "lodash-es";
import { Brief, BriefsStatus } from "@/types/briefs";
import { nanoid } from "nanoid";
import { CreateSeederProps } from "@/types/seeder";

type AssignBrief = Pick<Brief, "assign">;
type CreateBriefsProps = Partial<AssignBrief> & CreateSeederProps;

const BRIEF_STATUS: BriefsStatus[] = ['Assigned', 'Correction', 'Done', 'In Review', 'Waiting Client Feedback'];

export function createBriefs({
  amount = 1,
  assign,
}: CreateBriefsProps): Brief[] {
  const result: Brief[] = [];

  for (let x = 0; x < amount; x++) {
    const TIME = toDate(Date.now());

    result.push({
      id: nanoid(4),
      title: `Judul Brief ${x + 1}`,
      status: BRIEF_STATUS[random(0, 4)],
      createdAt: TIME,
      updatedAt: TIME,
      assign: !!assign ? assign : [],
      content: "",
    });
  }

  return result;
}
