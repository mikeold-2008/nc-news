const request = require('supertest')
const app = require('../app')
const data = require("../db/data/test-data/index")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const endpoints = require("../endpoints.json")

beforeAll(() => {
    return seed(data)
})

afterAll(() => {
    return db.end()
})


describe('GET/api/topics', () => {
    test('Responds with 200 code & with array of topics, each with: slug, description ', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          const topics = body
          expect(topics).toHaveLength(3)
          topics.forEach((topic) => {
              expect(typeof topic.slug).toBe("string")
              expect(typeof topic.description).toBe("string")
          })
        })  
      })     
});

describe('/GET incorrect path', () => {
    test('Responds with 404 if incorrect path specified', () => {
        return request(app)
        .get('/api/notTopics')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found")
        })  
      })
});


describe('/GET api', () => {
    test('Responds information on available api endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(endpoints)
        })  
      })
});