import type { RelationshipToStudent } from "../enums/RelationshipToStudent";

export interface Parent {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  relationshipToStudent: RelationshipToStudent;
}
