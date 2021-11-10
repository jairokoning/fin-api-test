import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class UpdateStatementAddSenderId1635755617247 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn(
        'statements',
        new TableColumn(
          {
            name: 'sender_id',
            type: 'uuid',
            isNullable: true,
          },
        ),
      )

      await queryRunner.createForeignKey("statements", new TableForeignKey({
        columnNames: ["sender_id"],
        name: "FK_USERS_STATAMENTS",
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE"
    }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropForeignKey("statements", "FK_USERS_STATAMENTS");
      await queryRunner.dropColumn("statements", "sender_id");
    }

}
