import { buildSchema } from 'graphql';
import expressGraphql from 'express-graphql';
import { getAll, save, remove } from './movie/model.js';

// Datentyp Movie mit der Struktur des Datensatzes für die Abfrage.
// Die id wird in den Int-Typ umgewandelt, das Ausrufezeichen hinter dem Typ bedeutet Pflichtfeld.
// Datentyp MovieInput mit Schlüsselwort input für den Input von Datensätzen. Die id ist hier optional.
// Query mit den Felder greet und movie für Query-Abfragen definiert.
// Mutation mit den Felder createMovie-Feld, updateMovie und deleteMovie.
const schema = buildSchema(`
  type Movie {
    id: Int!
    title: String!
    year: Int
    public: Int
    user: Int
  }

  input MovieInput {
    id: Int
    title: String!
    year: Int
    public: Int
    user: Int
  }

  type Query {
    greet: String
    movie(id: Int): [Movie]
  }

  type Mutation {
    createMovie(movie: MovieInput): Movie
    updateMovie(movie: MovieInput): Movie
    deleteMovie(id: Int!): Boolean
    }
`);

// Jede Schema-Ändeung braucht auch eine Anpassung an den Resolver-Funktionen.
// Sie können natürlich auch 2 Funktionen für die Abfragen machen. So würde z.B. ein Datensatz nicht als Array zurückgegeben.
const rootValue = {
  greet() {
    return 'Hello GraphQL';
  },
  async movie({ id }) {
    const movies = await getAll({ userId: 1 });
    if (id) {
      return movies.filter((movie) => movie.id === id);
    }
    return movies;
  },
  createMovie({ movie }) {
    return save(movie, 1);
  },
  async updateMovie({ movie }) {
    await save(movie, 1);
    return movie;
  },
  async deleteMovie({ id }) {
    await remove(id, 1);
    return true;
  },
};

export default expressGraphql.graphqlHTTP({
  schema,
  rootValue,
  graphiql: true, // Aktiviert das GraphiQL-Werkzeug
});

// Bemerkung: Die GraphQL-Schnittstelle ist ein Aufsatz auf die Businesslogik der Applikation. Die REST-Schnittstelle kann unverändert wiederverwendet werden.
// GraphQL unterstützt synchrone und asynchrone Operationen.
