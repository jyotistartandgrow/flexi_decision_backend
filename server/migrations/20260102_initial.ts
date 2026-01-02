import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("workspaces", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.string("name").notNullable();
    t.string("slug").unique().notNullable();
    t.string("plan").notNullable().defaultTo("free");
    t.jsonb("settings").defaultTo("{}");
    t.boolean("active").notNullable().defaultTo(true);
    t.timestamp("deleted_at", { useTz: true }).nullable();
    t.timestamp("created_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("users", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.string("email").notNullable();
    t.string("name");
    t.string("password_hash");
    t.uuid("workspace_id").references("id").inTable("workspaces").onDelete("CASCADE");
    t.string("role").notNullable().defaultTo("viewer");
    t.jsonb("metadata").defaultTo("{}");
    t.boolean("active").notNullable().defaultTo(true);
    t.timestamp("deleted_at", { useTz: true }).nullable();
    t.timestamp("created_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("boards", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.uuid("workspace_id").references("id").inTable("workspaces").onDelete("CASCADE");
    t.string("name").notNullable();
    t.string("visibility").notNullable().defaultTo("public");
    t.jsonb("settings").defaultTo("{}");
    t.boolean("active").notNullable().defaultTo(true);
    t.timestamp("deleted_at", { useTz: true }).nullable();
    t.timestamp("created_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("feedback_items", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.uuid("board_id").references("id").inTable("boards").onDelete("CASCADE");
    t.uuid("workspace_id").references("id").inTable("workspaces").onDelete("CASCADE");
    t.text("title").notNullable();
    t.text("body");
    t.string("status").defaultTo("idea");
    t.jsonb("custom_fields").defaultTo("{}");
    t.uuid("duplicate_of").nullable();
    t.boolean("active").notNullable().defaultTo(true);
    t.timestamp("deleted_at", { useTz: true }).nullable();
    t.timestamp("created_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("votes", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.uuid("feedback_item_id").references("id").inTable("feedback_items").onDelete("CASCADE");
    t.uuid("user_id").references("id").inTable("users").nullable();
    t.uuid("customer_id").nullable();
    t.decimal("weight", 10, 2).defaultTo(1);
    t.string("type").defaultTo("upvote");
    t.string("source").nullable();
    t.boolean("active").notNullable().defaultTo(true);
    t.timestamp("deleted_at", { useTz: true }).nullable();
    t.timestamp("created_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("roadmap_items", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.uuid("workspace_id").references("id").inTable("workspaces").onDelete("CASCADE");
    t.string("title").notNullable();
    t.string("status").notNullable().defaultTo("planned");
    t.string("time_horizon").defaultTo("later");
    t.integer("position").defaultTo(0);
    t.jsonb("meta").defaultTo("{}");
    t.boolean("active").notNullable().defaultTo(true);
    t.timestamp("deleted_at", { useTz: true }).nullable();
    t.timestamp("created_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("changelogs", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.uuid("workspace_id").references("id").inTable("workspaces").onDelete("CASCADE");
    t.string("title");
    t.text("body");
    t.string("category");
    t.timestamp("scheduled_at", { useTz: true }).nullable();
    t.timestamp("published_at", { useTz: true }).nullable();
    t.boolean("active").notNullable().defaultTo(true);
    t.timestamp("deleted_at", { useTz: true }).nullable();
    t.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("changelogs");
  await knex.schema.dropTableIfExists("roadmap_items");
  await knex.schema.dropTableIfExists("votes");
  await knex.schema.dropTableIfExists("feedback_items");
  await knex.schema.dropTableIfExists("boards");
  await knex.schema.dropTableIfExists("users");
  await knex.schema.dropTableIfExists("workspaces");
}
