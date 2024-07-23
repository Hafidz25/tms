import type { DateRange } from "react-day-picker";
import type { User } from "./user";

export type BriefsStatus =
  | "Assigned"
  | "In Review"
  | "In Progress"
  | "Waiting for Client"
  | "Correction"
  | "Need Review"
  | "Done";

export interface Brief {
  id: string;
  title: string;

  /**
   * Type `content` perlu refactor.
   * Type ini menyimpan data json yang diserialisasi.
   * Gunakan teknik Type-Safe JSON Serialization.
   * @see {@link https://hackernoon.com/mastering-type-safe-json-serialization-in-typescript}
   * */
  content: string;

  status: BriefsStatus;
  assign: User[];
  createdAt: Date;
  updatedAt: Date;
  deadline?: DateRange | undefined;
}
