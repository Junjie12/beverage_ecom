const { describe, it } = require('mocha');
const { expect } = require('chai');
const { app, server } = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
let baseUrl;

describe('Beverage API', () => {
    before(async () => {
        const { address, port } = await server.address();
        baseUrl = `http://${address == '::' ? 'localhost' : address}:${port}`;
    });

    after(() => {
        return new Promise((resolve) => {
            server.close(() => {
                resolve();
            });
        });
    });

    let count = 0;
    let beverageId; // Variable to store the ID of the resource

    describe('POST /add-beverage', () => {
        before((done) => {
            chai.request(baseUrl)
                .get('/view-beverages')
                .end((err, res) => {
                    count = res.body.length;
                    done();
                });
        });

        it('should return 400 for validation errors', (done) => {
            chai.request(baseUrl)
                .post('/add-beverage')
                .send({
                    name: 'Test Beverage',
                    image: 'test-image-url',
                    price: 'invalid-price', // Invalid price
                    category: 'Test Category',
                    description: 'Test Description',
                    rating: 6, // Invalid rating
                    quantity: 'invalid-quantity' // Invalid quantity
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.be.oneOf([
                        'Price must be a number.',
                        'Rating must be a number.',
                        'Rating must be between 1 and 5.',
                        'quantity must be a number.'
                    ]);
                    done();
                });
        });

        it('should return 201 and add the beverage for valid input', (done) => {
            chai.request(baseUrl)
                .post('/add-beverage')
                .send({
                    name: 'Test Beverage',
                    image: 'test-image-url',
                    price: 10,
                    category: 'Test Category',
                    description: 'Test Description',
                    rating: 4,
                    quantity: 100
                })
                .end((err, res) => {
                    if (err) {
                        console.error(err);
                    }
                    console.log('Response body:', res.body); // Log the response body for debugging
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('array'); // Adjusted to expect an array
                    expect(res.body.length).to.equal(count + 1); // Check if the array length increased by 1
                    beverageId = res.body[res.body.length - 1].id; // Store the ID of the newly added resource
                    done();
                });
        });

        it('should return 400 for missing required fields', (done) => {
            chai.request(baseUrl)
                .post('/add-beverage')
                .send({
                    name: 'Test Beverage',
                    image: 'test-image-url',
                    price: 10,
                    category: 'Test Category'
                    // Missing description, rating, and quantity
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.be.oneOf([
                        'Description is required.',
                        'Rating is required.',
                        'Quantity is required.'
                    ]);
                    done();
                });
        });

        it('should return 400 for invalid data types', (done) => {
            chai.request(baseUrl)
                .post('/add-beverage')
                .send({
                    name: 'Test Beverage',
                    image: 'test-image-url',
                    price: 'ten', // Invalid price type
                    category: 'Test Category',
                    description: 'Test Description',
                    rating: 'four', // Invalid rating type
                    quantity: 'hundred' // Invalid quantity type
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.be.oneOf([
                        'Price must be a number.',
                        'Rating must be a number.',
                        'Quantity must be a number.'
                    ]);
                    done();
                });
        });

        it('should return 400 for out of range rating', (done) => {
            chai.request(baseUrl)
                .post('/add-beverage')
                .send({
                    name: 'Test Beverage',
                    image: 'test-image-url',
                    price: 10,
                    category: 'Test Category',
                    description: 'Test Description',
                    rating: 10, // Rating out of range
                    quantity: 100
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('Rating must be between 1 and 5.');
                    done();
                });
        });
    });
});