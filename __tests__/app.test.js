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


describe('/GET incorrect path', () => {
    test('Responds with 404 if incorrect path specified', () => {
        return request(app)
        .get('/api/notTopics')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found")
        })  
      })
});


describe('GET /api/topics', () => {

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


describe('/GET api', () => {
    test('Responds with information on available api endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(endpoints)
        })  
      })
});


describe('/GET api/articles:article_id', () => {

    test('Responds with the correct article for the given article_id', () => {
        const article = {
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 100,
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
          }
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {  
        expect(body).toEqual(article)
        })  
      })


    test('Responds with 404 Not found for an article_id not found in the dataset', () => {
        return request(app)
        .get('/api/articles/999999')
        .expect(404)
        .then(({ body }) => {  
            expect(body.msg).toBe("Couldn't find requested article")
        })  
    });


    test('Resonds with 400 bad request for an invalid article_id', () => {
        return request(app)
        .get('/api/articles/not-an-id-number')
        .expect(400)
        .then(({ body }) => {  
            expect(body.msg).toBe("Bad request")
        })  
    });
});


describe('/GET /api/articles', () => {

    test('Responds with 200 & with array of articles', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(({ body }) => {
    const articles = body
    expect(articles).toHaveLength(13)
    expect(articles).toBeSortedBy("created_at",{descending: true,coerce:true})
        articles.forEach((article) => {
        expect(typeof article.author).toBe("string")
        expect(typeof article.title).toBe("string")
        expect(typeof article.article_id).toBe("number")
        expect(typeof article.topic).toBe("string")
        expect(typeof article.created_at).toBe("string")
        expect(typeof article.votes).toBe("number")
        expect(typeof article.article_img_url).toBe("string")
        expect(typeof article.comment_count).toBe("number")
        expect(article.body).toBe(undefined)
        })
    })  
    }) 
});


describe('GET /api/articles/:article_id/comments', () => {

  test('Responds with 200 and array of comments (for a valid article ID & where comments exist)', () => {
    return request(app)
    .get('/api/articles/1/comments')
    .expect(200)
    .then(({ body }) => {
        const comments = body
        expect(comments).toHaveLength(11)
        comments.forEach((comment) => {
            expect(typeof comment.comment_id).toBe("number")
            expect(typeof comment.votes).toBe("number")
            expect(typeof comment.created_at).toBe("string")
            expect(typeof comment.author).toBe("string")
            expect(typeof comment.body).toBe("string")
            expect(typeof comment.article_id).toBe("number")
        })
    })  
  });

  test('Responds with the list of comments sorted by date desc.', () => {
    return request(app)
    .get('/api/articles/1/comments')
    .expect(200)
    .then(({ body }) => {
        const comments = body
        expect(comments).toBeSortedBy("created_at",{descending: true})
    })  
  });


  test('Responds with 200 and empty array for a valid article_id which has no comments associated', () => {
  return request(app)
  .get('/api/articles/4/comments')
  .expect(200)
  .then(({ body }) => {  
  expect(body).toEqual([])
  })  
  });


  test('Responds with 404 when article_id is valid but non-existent', () => {
    return request(app)
    .get('/api/articles/99999/comments')
    .expect(404)
    .then(({ body }) => {  
    expect(body.msg).toBe("Article ID not found")
    })  
   });


   test('Responds with 400 Invalid article ID when article_id is not of a valid type', () => {
    return request(app)
    .get('/api/articles/not-an-id-number/comments')
    .expect(400)
    .then(({ body }) => {  
    expect(body.msg).toBe("Invalid article ID")
    })  
   });



});