import { Knex } from "knex";

export interface IDatabaseService {
    db: Knex
}