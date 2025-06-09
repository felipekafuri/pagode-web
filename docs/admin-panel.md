---
sidebar_position: 9
---

# Admin Panel

The admin panel functionality is considered to be in _beta_ and remains under active development, though all features described here are expected to be fully-functional.

## Features

The _admin panel_ currently includes:

- A completely dynamic UI to manage all entities defined by _Ent_.
- A section to monitor all background tasks and queues.

There are no separate templates or interfaces for the admin section. Users with admin access will see additional links on the default sidebar at the bottom. As with all default UI components, you can easily move these pages and links to a dedicated section, layout, etc. 

Clicking on the link for any given entity type will provide a pageable table of entities and the ability to add/edit/delete.

## Screenshots

### User Entity List
![User entity list](https://raw.githubusercontent.com/mikestefanello/readmeimages/main/pagoda/admin-user_list.png)

### User Entity Edit 
![User entity edit](https://raw.githubusercontent.com/mikestefanello/readmeimages/main/pagoda/admin-user_edit.png)

### Monitor Task Queues
![Manage task queues](https://raw.githubusercontent.com/mikestefanello/readmeimages/main/backlite/failed.png)

## Code Generation

In order to automatically and dynamically provide admin functionality for entities, code generation is used by means of leveraging Ent's [extension API](https://entgo.io/docs/extensions) which makes generating code using the Ent graph schema very easy. 

A [custom extension](https://github.com/occult/pagode/blob/master/ent/admin/extension.go) is provided to generate code that provides flat entity type structs and handler code that work directly with Echo. So, both of those are required in order for any of this to work. Whenever you modify one of your entity types or generate a new one, the admin code will also automatically generate.

The generated code provides a [handler](https://github.com/occult/pagode/blob/master/ent/admin/handler.go) that is then used by a provided [web handler](https://github.com/occult/pagode/blob/master/pkg/handlers/admin.go) to power all the routes used in the admin UI.

## Access

Only admin users can access the admin panel. If you haven't yet generated an admin user, follow these instructions:

```bash
make admin email=your@email.com
```

This will generate an admin account using that email address and print the randomly-generated password to the console.

## Considerations

Since the generated code is completely dynamic, all entity functionality related to creating and editing must be defined within your _Ent_ schema. Refer to the [User](https://github.com/occult/pagode/blob/master/ent/schema/user.go) entity schema as an example.

- Field validation must be defined within each entity field (ie, validating an email address in a _string_ field).
- Pre-processing must be defined within entity hooks (ie, hashing the user's password).
- _Sensitive_ fields will be omitted from the UI, and only modified if a value is provided during creation or editing.
- _Edges_ must be bound to an [edge field](https://entgo.io/docs/schema-edges#edge-field) if you want them visible and editable.

## Roadmap

- Determine which tests should be included and provide them.
- Inline validation.
- Either exposed sorting, or allow the _handler_ to be configured with sort criteria for each type.
- Exposed filters.
- Support all field types (types such as _JSON_ are currently not supported).
- Control which fields appear in the entity list table.
