const request = require('supertest');
const express = require('express');
const crudOps = require('../routes/ops/crudOps');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());
app.use('/', crudOps);

describe('CRUD Operations', () => {
    let db;

    beforeAll((done) => {
        db = new sqlite3.Database(':memory:', (err) => {
            if (err) {
                return done(err);
            }
            db.run("CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT, description TEXT, price REAL)", done);
        });
    });

    afterAll((done) => {
        db.close(done);
    });

    describe('POST /api/items', () => {
        it('should create a new item', async () => {
            const res = await request(app)
                .post('/api/items')
                .send({ name: 'Item 1', description: 'Description 1', price: 10.0 });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('id');
        });

        it('should return 400 if name, description, or price is missing', async () => {
            const res = await request(app)
                .post('/api/items')
                .send({ name: 'Item 2', description: 'Description 2' });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('GET /api/items', () => {
        it('should retrieve all items', async () => {
            const res = await request(app).get('/api/items');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('items');
            expect(res.body.items).toBeInstanceOf(Array);
        });
    });

    describe('GET /api/items/:id', () => {
        it('should retrieve an item by its ID', async () => {
            const postRes = await request(app)
                .post('/api/items')
                .send({ name: 'Item 3', description: 'Description 3', price: 20.0 });
            const id = postRes.body.id;
            const res = await request(app).get(`/api/items/${id}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('item');
            expect(res.body.item).toHaveProperty('id', id);
        });

        it('should return 404 if item is not found', async () => {
            const res = await request(app).get('/api/items/999');
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('PUT /api/items/:id', () => {
        it('should update an existing item', async () => {
            const postRes = await request(app)
                .post('/api/items')
                .send({ name: 'Item 4', description: 'Description 4', price: 30.0 });
            const id = postRes.body.id;
            const res = await request(app)
                .put(`/api/items/${id}`)
                .send({ name: 'Updated Item 4', description: 'Updated Description 4', price: 35.0 });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('changes', 1);
        });

        it('should return 404 if item is not found', async () => {
            const res = await request(app)
                .put('/api/items/999')
                .send({ name: 'Non-existent Item', description: 'Non-existent Description', price: 40.0 });
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('DELETE /api/items/:id', () => {
        it('should delete an item', async () => {
            const postRes = await request(app)
                .post('/api/items')
                .send({ name: 'Item 5', description: 'Description 5', price: 50.0 });
            const id = postRes.body.id;
            const res = await request(app).delete(`/api/items/${id}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('changes', 1);
        });

        it('should return 404 if item is not found', async () => {
            const res = await request(app).delete('/api/items/999');
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('error');
        });
    });
});