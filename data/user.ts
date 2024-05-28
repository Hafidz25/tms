import { random } from "lodash-es";
import { fakerID_ID as faker } from "@faker-js/faker";
import { Roles, User } from "@/types/user";
import { nanoid } from "nanoid";

interface CreateUserProps {
  amount?: number;
  role?: Roles | undefined;
}

const userRole: Roles[] = ["Admin", "Customer Server", "Team Member"];

function createUser({ amount = 1, role }: CreateUserProps): User[] {
  const result: User[] = [];

  for (let x = 0; x < amount; x++) {
    const [firstName, lastName] = faker.person.fullName().split(" ");

    result.push({
      id: nanoid(4),
      name: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName }),
      role: role ? role : userRole[random(1, 2)],
    });
  }

  return result;
}

export const userList: User[] = [
  ...createUser({ amount: 9 }),
  {
    id: nanoid(4),
    name: "Abaz",
    email: "abaz@gmail.com",
    role: "Admin",
  },
];

