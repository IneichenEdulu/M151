import { buildSchema, graphql } from 'graphql';

// In diesem Beispiel wird GraphQL als Schnittstelle innerhalb der Appliklation benutzt.
// Es existiert also kein Serverprozess und die Schnittstelle ist nicht öffentlich.

//Schema wird mit einem Query-Typ mit dem Feld greet definiert. 
const schema = buildSchema(`
  type Query {
    greet: String
  }
`);

// Revolver versorgt die Anfrage mit einem bestimmten Wert. --> root-Objekt mit Funktion greet()
const root = {
  greet() {
    return 'Hello GraphQL!';
  },
};

// Abfrage an GraphQL-Schnittstelle formulieren: Schema, Abfrage, root-Objekt
// GraphQL-Funktion gibt Promise-Objekt zurück.
const response = await graphql(schema, '{ greet } ', root);
// Response-Objekt enthält neben weiteren Informationen eine data-Eigenschaft.
console.log(response.data.greet); // Ausgabe: Hello GraphQL!
// Bibliothek: npm install graphql
