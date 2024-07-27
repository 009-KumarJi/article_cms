import {Role} from "../models/role.model.js";

Role.insertMany([
    {
        name: "Admin",
        permissions: {
            create: true,
            read: true,
            update: true,
            delete: true,
        },
    },
    {
        name: "Moderator",
        permissions: {
            create: true,
            read: true,
            update: true,
            delete: false,
        },
    },
    {
        name: "User",
        permissions: {
            create: false,
            read: true,
            update: false,
            delete: false,
        },
    },
]).then(r => {
    console.log(r);
})