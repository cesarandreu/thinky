---
layout: documentation
permalink: introduction/
---

## Introduction

#### What is thinky?

`thinky` is a light [Node.js](http://nodejs.org) ORM for [RethinkDB](http://rethinkdb.com).

It wraps the [rethinkdbdash](https://github.com/neumino/rethinkdbdash) driver and provide a few more features than the native
driver, like models, easy joins etc.

The goal of `thinky` is to make retrieving/saving/deleting joined documents from RethinkDB as
easy as possible.


#### What are the advantages of using thinky?

- __Less code to write__
    - It uses `rethinkdbdash` and connections are automatically created and kept in a pool.
    - It provides Models and handle joins in a nice and efficient way:
        - saving joined documents can be done with a single command: `saveAll`.
        - retrieving joined documents can be done with a single command: `getJoin`.
        - deleting  joined documents can be done with a single command: `deleteAll`.
    - Tables are automatically created.
    - Indexes for joins are automatically created.
- __Less headaches__
    - It validates documents before saving them, which saves you from saving incoherent data.
    - You do not have to remember the name of all your foreign keys.
    - Cursors are by default automatically coerced to arrays.
- __Easy to learn__
    - Chainable commands like in the driver.
    - All the commands available in the driver are also available with `thinky`.


#### What are the disadvantages of using thinky?

Nothing that I can think of.


#### Awesome, where should I start?


Take a look at:

- The [quickstart](/documentation/quickstart/)
- The [examples](https://github.com/neumino/thinky/tree/master/examples)
- The [API documentation](/documentation/api/thinky/)