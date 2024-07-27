// helper/roles.js
import { Role } from "../models/role.model.js";

const getAllRoles = async () => {
    const roles = await Role.find();
    return roles.map(role => ({
        name: role.name,
        permissions: Object.keys(role.permissions).filter(permission => role.permissions[permission])
    }));
};

export { getAllRoles };
