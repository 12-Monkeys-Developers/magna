export default class MagnaPNJ extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = {};

    schema.difficulte = new fields.NumberField({ ...requiredInteger, initial: 0});

    // Points de vie
    schema.pv = new fields.SchemaField({
        valeur: new fields.NumberField({ ...requiredInteger, initial: 5}),
        max :  new fields.NumberField({ ...requiredInteger, initial: 5})
    });

    schema.description = new fields.HTMLField({required: true, blank: true});
    
    return schema;
  }
}
