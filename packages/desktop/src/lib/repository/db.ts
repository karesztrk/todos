import Database from "@tauri-apps/plugin-sql";
import type { BasicStore, Todo, Cell } from "@todotrk/web/repository/db";
import { createCustomPersister } from "tinybase/persisters/with-schemas";
import {
  createQueries,
  createStore,
  type NoValuesSchema,
  type Queries,
  type Store as SchemaStore,
} from "tinybase/with-schemas";

const schema = {
  todos: {
    text: { type: "string" },
    done: { type: "boolean" },
    date: { type: "string", default: undefined },
    created: { type: "string" },
  },
} as const;

class Store implements BasicStore {
  store: SchemaStore<[typeof schema, NoValuesSchema]>;
  queries: Queries<[typeof schema, NoValuesSchema]>;

  constructor() {
    this.store = createStore().setTablesSchema(schema);

    this.queries = createQueries(this.store);
    Database.load("sqlite:sqlite.db").then((db) => {
      const persister = createCustomPersister(
        this.store,
        async () => {
          const data = await db.select<Todo[]>(
            "SELECT id, text, done, date, created FROM todos",
          );
          const todos = data.reduce<Record<Todo["id"], Todo>>((acc, todo) => {
            acc[todo.id] = todo;
            return acc;
          }, {});
          return [{ todos }, {}];
        },
        async (getContent) => {
          // eslint-disable-next-line
          console.log("save");
          db.execute("DELETE FROM todos");

          const tables = getContent()[0];
          for (const id in tables.todos) {
            const todo = tables.todos[id];
            await db.execute(
              "INSERT INTO todos (id, text, done, date, created) VALUES ($1, $2, $3, $4, $5)",
              [id, todo.text, todo.done ? 1 : 0, todo.date, todo.created],
            );
          }

          // this.persistedJson = JSON.stringify(getContent());
        },
        (listener) => setInterval(listener, 1000),
        (interval) => clearInterval(interval),
        console.warn,
        1,
      );

      persister.startAutoLoad().catch(console.error);
      persister.startAutoSave().catch(console.error);
    });

    this.queries.setQueryDefinition("query", "todos", ({ select }) => {
      select("text");
      select("done");
      select("date");
      select("created");
    });
  }

  getAllTodos(): Todo[] {
    return this.queries
      .getResultSortedRowIds("query", "created", true)
      .map(
        (rowId) =>
          ({ ...this.queries.getResultRow("query", rowId), id: rowId }) as Todo,
      )
      .map((row) => ({
        ...row,
        date: typeof row.date === "string" ? new Date(row.date) : undefined,
      }));
  }

  setCell(rowId: string, cell: Cell, value: any) {
    this.store.setCell("todos", rowId, cell, value);
  }

  deleteCell(rowId: string, cellId: Cell) {
    this.store.delCell("todos", rowId, cellId);
  }

  getRow(rowId: string) {
    return this.store.getRow("todos", rowId);
  }

  setRow(id: string, data: Record<string, any>) {
    this.store.setRow("todos", id, data);
  }
}

export default Store;
