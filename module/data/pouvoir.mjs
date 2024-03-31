export default class MagnaPouvoir extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredNullableInteger = { required: true, nullable: true, integer: true, initial: null };
    const schema = {};

    schema.domaine = new fields.StringField({ required: true, nullable: false, initial: "vie" });
    schema.voie = new fields.StringField({ required: true, nullable: false, initial: "" });
    schema.portee = new fields.StringField({ required: true, nullable: false, initial: "Toucher" });
    schema.cibles = new fields.StringField({ required: true, nullable: false, initial: "" });
    schema.resume = new fields.StringField({ required: true, nullable: false, initial: "" });
    schema.description = new fields.HTMLField({ required: true, blank: true, textSearch: true });
    schema.rang = new fields.NumberField({ required: true, initial: 1 });
    schema.rang_min = new fields.NumberField({ required: true, initial: 0 });
    schema.auraDeployee = new fields.BooleanField({ required: true, initial: false });

    return schema;
  }
}
