/**
 * @file crudOps.js
 * @description This file contains CRUD operations for items using Express and SQLite.
 */

const express = require("express");
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

const db = new sqlite3.Database(':memory:');

// Create items table
db.serialize(() => {
    db.run("CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT, description TEXT, price REAL)", (err) => {
        if (err) {
            console.error("Error creating table:", err.message);
        }
    });
});

/**
 * @api {get} /api/items Retrieve all items
 * @apiName GetItems
 * @apiGroup Items
 */
router.get('/api/items', (req, res) => {
    db.all("SELECT * FROM items", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ items: rows });
    });
});

/**
 * @api {get} /api/items/:id Retrieve an item by its ID
 * @apiName GetItemById
 * @apiGroup Items
 * @apiParam {Number} id Item's unique ID.
 */
router.get('/api/items/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM items WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: "Item not found" });
            return;
        }
        res.json({ item: row });
    });
});

/**
 * @api {post} /api/items Create a new item
 * @apiName CreateItem
 * @apiGroup Items
 * @apiParam {String} name Item's name.
 * @apiParam {String} description Item's description.
 * @apiParam {Number} price Item's price.
 */
router.post('/api/items', (req, res) => {
    const { name, description, price } = req.body;
    if (!name || !description || price == null) {
        res.status(400).json({ error: "Name, description, and price are required" });
        return;
    }
    db.run("INSERT INTO items (name, description, price) VALUES (?, ?, ?)", [name, description, price], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID });
    });
});

/**
 * @api {put} /api/items/:id Update an existing item
 * @apiName UpdateItem
 * @apiGroup Items
 * @apiParam {Number} id Item's unique ID.
 * @apiParam {String} name Item's name.
 * @apiParam {String} description Item's description.
 * @apiParam {Number} price Item's price.
 */
router.put('/api/items/:id', (req, res) => {
    const id = req.params.id;
    const { name, description, price } = req.body;
    if (!name || !description || price == null) {
        res.status(400).json({ error: "Name, description, and price are required" });
        return;
    }
    db.run("UPDATE items SET name = ?, description = ?, price = ? WHERE id = ?", [name, description, price, id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: "Item not found" });
            return;
        }
        res.json({ changes: this.changes });
    });
});

/**
 * @api {delete} /api/items/:id Delete an item
 * @apiName DeleteItem
 * @apiGroup Items
 * @apiParam {Number} id Item's unique ID.
 */
router.delete('/api/items/:id', (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM items WHERE id = ?", [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: "Item not found" });
            return;
        }
        res.json({ changes: this.changes });
    });
});

module.exports = router;