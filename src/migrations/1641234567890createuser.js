const { MigrationInterface, QueryRunner, Table } = require("typeorm");

class CreateUsersTable1641234567890 {
    async up(queryRunner) {
        // Create the 'users' table
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true, // Automatically generated
                    },
                    {
                        name: "name",
                        type: "varchar",
                        isNullable: true, // Adjust based on your requirements
                    },
                    {
                        name: "email",
                        type: "varchar",
                        isUnique: true, // Unique constraint
                    },
                    {
                        name: "password",
                        type: "varchar",
                    },
                    {
                        name: "board",
                        type: "varchar",
                    },
                    {
                        name: "field",
                        type: "varchar",
                    },
                    {
                        name: "standard",
                        type: "varchar",
                    },
                    {
                        name: "dob",
                        type: "date",
                    },
                    {
                        name: "age",
                        type: "int",
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP", // Automatically set to current timestamp
                    },
                ],
            })
        );
    }

    async down(queryRunner) {
        // Drop the 'users' table if it exists
        await queryRunner.dropTable("users");
    }
}

module.exports = CreateUsersTable1641234567890;