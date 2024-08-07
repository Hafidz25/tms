import type { DateRange } from "react-day-picker";
import type { User } from "./user";
import type { Feedback } from "./feedback";

export type BriefsStatus =
  | "Assigned"
  | "In Review"
  | "Waiting for Client Feedback"
  | "Correction"
  | "In Progress"
  | "Need Review"
  | "Done";

export interface Brief {
  id: string;
  authorId: string;
  title: string;
  description: string;

  /**
   * Type `content` perlu refactor.
   * Type ini menyimpan data json yang diserialisasi.
   * Gunakan teknik Type-Safe JSON Serialization.
   * @see {@link https://hackernoon.com/mastering-type-safe-json-serialization-in-typescript}
   * */
  content: string;

  status: BriefsStatus;
  feedback: Feedback[];
  assign: User[];
  createdAt: Date;
  updatedAt: Date;
  deadline?: DateRange | undefined;
}
