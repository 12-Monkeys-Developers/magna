import { SYSTEM } from "../config/system.mjs";

export default class MagnaArme extends foundry.abstract.TypeDataModel {
    static defineSchema() {
      const fields = foundry.data.fields;
      const requiredNullableInteger = { required: true, nullable: true, integer: true, initial: null };
      const schema = {};
  
      schema.degats = new fields.NumberField({ required: true, initial: 2 });
      schema.competence = new fields.StringField({ required: false, blank: true, choices: SYSTEM.COMPETENCES_COMBAT, initial: "mainsnues" });
      schema.description = new fields.HTMLField({ required: false, blank: true, textSearch: true });
      return schema;
    }
  }