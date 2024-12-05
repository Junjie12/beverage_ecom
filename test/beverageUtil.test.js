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
    let beverageId; 

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
                    image: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.orderfreshmed.com%2Fproduct%2Fcoke-can%2F70&psig=AOvVaw1e18kBCcbP0b_90KVwTStC&ust=1731062756254000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJiQz7aFyokDFQAAAAAdAAAAABAE',
                    price: '1', 
                    category: 'Test Category',
                    description: 'Test Description',
                    rating: 3, 
                    quantity: 'invalid-quantity' // wrong quantity
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('Quantity must be a number.');
                    done();
                });
        });
        it('should return 201 and add the beverage for valid input', (done) => {
            chai.request(baseUrl)
                .post('/add-beverage')
                .send({
                    name: 'coke',
                    image: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.orderfreshmed.com%2Fproduct%2Fcoke-can%2F70&psig=AOvVaw1e18kBCcbP0b_90KVwTStC&ust=1731062756254000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJiQz7aFyokDFQAAAAAdAAAAABAE',
                    price: 1.50,
                    category: 'soft drink',
                    description: 'Test Description',
                    rating: 4,
                    quantity: 2
                })
                .end((err, res) => {
                    if (err) {
                        console.error(err);
                    }
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object'); 
                    expect(res.body).to.have.property('id'); 
                    beverageId = res.body.id; // Store the ID of the newly added resource
                    done();
                });
        });

        it('should return 400 for missing required fields', (done) => {
            chai.request(baseUrl)
                .post('/add-beverage')
                .send({
                    name: 'Test Beverage',
                    image: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.orderfreshmed.com%2Fproduct%2Fcoke-can%2F70&psig=AOvVaw1e18kBCcbP0b_90KVwTStC&ust=1731062756254000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJiQz7aFyokDFQAAAAAdAAAAABAE',
                    price: 10,
                    category: 'Test Category'
                    // Missing values
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('All fields are required.');
                    done();
                });
        });

        
                });
        });
