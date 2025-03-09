export default class MagnaPouvoir extends foundry.abstract.TypeDataModel {
  
  /** @override */
  static LOCALIZATION_PREFIXES = [
    "MAGNA.Source"
  ];

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredNullableInteger = { required: true, nullable: true, integer: true, initial: null };
    const schema = {};

    schema.domaine = new fields.StringField({ required: true, nullable: false, initial: "vie" });
    schema.voie = new fields.StringField({ required: true, nullable: false, initial: "Voie des soins" });
    schema.portee = new fields.StringField({ required: true, nullable: false, initial: "Toucher" });
    schema.cibles = new fields.StringField({ required: true, nullable: false, initial: "" });
    schema.resume = new fields.StringField({ required: true, nullable: false, initial: "" });
    schema.description = new fields.HTMLField({ required: true, blank: true, textSearch: true });
    schema.rang = new fields.NumberField({ required: true, initial: 1, min: 0, max: 10  });
    schema.rang_min = new fields.NumberField({ required: true, initial: 0 , min: 0, max: 10 });
    schema.auraDeployee = new fields.BooleanField({ required: true, initial: false });
    schema.defaultAtt = new fields.StringField({ required: true, choices: SYSTEM.CAR_IND_MERGE, initial: "distpsi" });

    return schema;
  }
}
