const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true, // Automatically generated
        },
        name: {
            type: "varchar",
            nullable: true, // Adjust based on your requirements
        },
        email: {
            type: "varchar",
            unique: true, // Unique constraint
        },
        password: {
            type: "varchar",
        },
        board: {
            type: "varchar",
        },
        field: {
            type: "varchar",
        },
        standard: {
            type: "varchar",
        },
        dob: {
            type: "date",
        },
        age: {
            type: "int",
        },
        createdAt: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP", // Automatically set to current timestamp
        },
    },
});