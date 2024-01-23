export default class MagnaPJ extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = {};

    // Caractéristiques
    const caracteristiqueField = (label, label_short) =>
      new fields.SchemaField({
        valeur: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 15 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 10 }),
        label: new fields.StringField({ initial: label }),
        label_short: new fields.StringField({ initial: label_short }),
      });

    schema.caracteristiques = new fields.SchemaField(
      Object.values(SYSTEM.CARACTERISTIQUES).reduce((obj, caracteristique) => {
        obj[caracteristique.id] = caracteristiqueField(caracteristique.label, caracteristique.label_short);
        return obj;
      }, {})
    );

    // Indices  les indices sont des métghodes de l'objet actor

    // Compétences
    const competenceField = (label, defaultCarac) =>
      new fields.SchemaField({
        valeur: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 10 }),
        defaultCarac: new fields.StringField({ initial: defaultCarac }),
        label: new fields.StringField({ initial: label }),
      });

    schema.competences = new fields.SchemaField(
      Object.values(SYSTEM.COMPETENCES).reduce((obj, competence) => {
        obj[competence.id] = competenceField(competence.label, competence.defaultCarac);
        return obj;
      }, {})
    );

    // Compétences
    const combatField = (label, defaultCarac) =>
      new fields.SchemaField({
        valeur: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 10 }),
        defaultCarac: new fields.StringField({ initial: defaultCarac }),
        label: new fields.StringField({ initial: label }),
      });

    schema.combat = new fields.SchemaField(
      Object.values(SYSTEM.COMPETENCES_COMBAT).reduce((obj, competence) => {
        obj[competence.id] = combatField(competence.label, competence.defaultCarac);
        return obj;
      }, {})
    );

    (schema.competences_spe = new fields.SchemaField({
      artisanats: new fields.ArrayField(
        new fields.SchemaField({
          label: new fields.StringField({ required: true, initial: "" }),
          defaultCarac: new fields.StringField({ required: true, initial: "" }),
          valeur: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 10 }),
        })
      ),
      connaissances: new fields.ArrayField(
        new fields.SchemaField({
          label: new fields.StringField({ required: true, initial: "" }),
          defaultCarac: new fields.StringField({ required: true, initial: "" }),
          valeur: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 10 }),
        })
      ),
      langues: new fields.ArrayField(
        new fields.SchemaField({
          label: new fields.StringField({ required: true, initial: "" }),
          defaultCarac: new fields.StringField({ required: true, initial: "" }),
          valeur: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 10 }),
        })
      ),
      pilotage: new fields.ArrayField(
        new fields.SchemaField({
          label: new fields.StringField({ required: true, initial: "" }),
          defaultCarac: new fields.StringField({ required: true, initial: "" }),
          valeur: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 10 }),
        })
      ),
    })),
      // Vitalité
      (schema.vitalite = new fields.SchemaField({
        valeur: new fields.NumberField({ ...requiredInteger, initial: 0 }),
      }));

    // Mental
    schema.mental = new fields.SchemaField({
      valeur: new fields.NumberField({ ...requiredInteger, initial: 0 }),
    });

    // pex
    schema.pex = new fields.SchemaField({
      valeur: new fields.NumberField({ ...requiredInteger, initial: 0 }),
      total: new fields.NumberField({ ...requiredInteger, initial: 0 }),
    });

    // Capacité spéciale : Embedded Item ?

    // Equipement :
    schema.equipement = new fields.HTMLField({ required: true, blank: true });

    // Armes et armures : Embedded Item ?
    // Pouvoirs : Embedded Item ?

    schema.description = new fields.HTMLField({ required: true, blank: true });

    return schema;
  }
}
