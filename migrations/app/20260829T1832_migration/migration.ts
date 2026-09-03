#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/0c7a5ceb83623e6c81b2683141870605c7fdc74618dd64734a7106b90311c602/contract';
import endContract from '../../snapshots/0c7a5ceb83623e6c81b2683141870605c7fdc74618dd64734a7106b90311c602/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createNativeEnumType({
        schema: 'public',
        typeName: 'CampusSize',
        members: ['SMALL', 'MEDIUM', 'LARGE'],
      }),
      this.createNativeEnumType({
        schema: 'public',
        typeName: 'UserRole',
        members: ['STUDENT', 'UNIVERSITY_REP', 'ADMIN'],
      }),
      this.createTable({
        schema: 'public',
        table: 'StudentProfile',
        columns: [
          col('actScore', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('budgetRange', 'int4[]', { codecRef: { codecId: 'pg/int4@1', many: true } }),
          col('campusVibes', 'text[]', { codecRef: { codecId: 'pg/text@1', many: true } }),
          col('careerGoals', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('classRank', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('country', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('dateOfBirth', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('extracurriculars', 'text[]', { codecRef: { codecId: 'pg/text@1', many: true } }),
          col('firstName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('gpa', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('graduationYear', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('highSchool', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('lastName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('major', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('phone', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('preferredLocations', 'text[]', { codecRef: { codecId: 'pg/text@1', many: true } }),
          col('preferredMajors', 'text[]', { codecRef: { codecId: 'pg/text@1', many: true } }),
          col('preferredRegion', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('priority', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('satScore', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('size', '"CampusSize"', {
            codecRef: { codecId: 'pg/enum@1', typeParams: { typeName: 'CampusSize' } },
          }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['userId'], { name: 'StudentProfile_pkey' })],
      }),
      this.createTable({
        schema: 'public',
        table: 'UniversityProfile',
        columns: [
          col('accpetanceRate', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('annualTuition', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('avgGpaCutOff', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('location', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('universityName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['userId'], { name: 'UniversityProfile_pkey' })],
      }),
      this.createTable({
        schema: 'public',
        table: 'User',
        columns: [
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamp-temporal@1', typeParams: { precision: 3 } },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('onboardingStep', 'int4', { default: lit(0), codecRef: { codecId: 'pg/int4@1' } }),
          col('password', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('role', '"UserRole"', {
            notNull: true,
            default: lit('STUDENT'),
            codecRef: { codecId: 'pg/enum@1', typeParams: { typeName: 'UserRole' } },
          }),
        ],
        constraints: [primaryKey(['id'], { name: 'User_pkey' })],
      }),
      this.addUnique({
        schema: 'public',
        table: 'StudentProfile',
        constraint: 'StudentProfile_userId_key',
        columns: ['userId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'User',
        constraint: 'User_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'User',
        index: 'User_email_key',
        columns: ['email'],
        extras: { unique: true },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'StudentProfile',
        foreignKey: {
          name: 'StudentProfile_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'UniversityProfile',
        foreignKey: {
          name: 'UniversityProfile_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
