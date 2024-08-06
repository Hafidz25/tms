import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

export type ReturnSetup = ReturnType<typeof setup>;

export function setup(jsx: JSX.Element) {
  return {
    ...render(jsx),
    user: userEvent.setup(),
  };
}
