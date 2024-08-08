import { random } from "lodash-es";
import { fakerID_ID as faker } from "@faker-js/faker";
import { Brief, BriefsStatus } from "@/types/brief";
import { nanoid } from "nanoid";
import { CreateSeederProps } from "@/types/seeder";

type CreateBriefsProps = Partial<Pick<Brief, "assign">> & CreateSeederProps;

const BRIEF_STATUS: BriefsStatus[] = [
  "Assigned",
  "In Review",
  "Waiting for Client Feedback",
  "Correction",
  "In Progress",
  "Need Review",
  "Done",
];

const YEAR_DELIMITER = 3;
const DAYS_DELIMITER = 4;
const REF_DATE = new Date(Date.now());

export function createBriefs({
  amount = 1,
  assign,
}: CreateBriefsProps): Brief[] {
  return Array.from({ length: amount }).map((item, i) => {
    const DATE_DETERMINER = random(0, YEAR_DELIMITER);

    const FROM =
      DATE_DETERMINER === 0
        ? faker.date.recent({ days: DAYS_DELIMITER, refDate: REF_DATE })
        : faker.date.past({ years: YEAR_DELIMITER });

    const TO = REF_DATE;

    const createdAt = faker.date.between({
      from: FROM,
      to: TO,
    });

    const updatedAt =
      DATE_DETERMINER === 0
        ? REF_DATE
        : faker.date.recent({ days: DAYS_DELIMITER - 1 });

    return {
      id: nanoid(4),
      authorId: nanoid(4),
      description: `Deskripsi Brief ${i + 1}`,
      title: `Judul Brief ${i + 1}`,
      status: BRIEF_STATUS[random(0, BRIEF_STATUS.length - 1)],
      createdAt,
      updatedAt,
      assign: !!assign ? assign : [],
      content: "",
      feedback: [],
    };
  });
}
