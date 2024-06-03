import { random } from "lodash-es";
import { fakerID_ID as faker } from "@faker-js/faker";
import { Roles, User } from "@/types/user";
import { nanoid } from "nanoid";
import { CreateSeederProps } from "@/types/seeder";

const USER_ROLE: Roles[] = ["Admin", "Customer Service", "Team Member"];
export const SUPER_ACCOUNT: User = {
  id: nanoid(4),
  name: "Abaz",
  email: "abaz@gmail.com",
  role: "Admin",
};

export function createUser({ amount = 1 }: CreateSeederProps): User[] {
  const result: User[] = [];

  for (let x = 0; x < amount; x++) {
    const [firstName, lastName] = faker.person.fullName().split(" ");

    result.push({
      id: nanoid(4),
      name: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName }),
      role: USER_ROLE[random(1, 2)],
    });
  }

  return result;
}

/**
 * @deprecated gunakan util `createUser` daripada variable ini! 
 * */
export const userList: User[] = [
  ...createUser({ amount: 9 }),
  {
    id: nanoid(4),
    name: "Abaz",
    email: "abaz@gmail.com",
    role: "Admin",
  },
];
