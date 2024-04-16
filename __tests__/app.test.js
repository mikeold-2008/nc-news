const request = require('supertest')
const app = require('../app')
const data = require("../db/data/test-data/index")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const endpoints = require("../endpoints.json")
const { postComments } = require('../controllers/comments.controllers')

beforeAll(() => {
    return seed(data)
})

afterAll(() => {
    return db.end()
})


describe('/incorrectpath', () => {
    test('GET 404: Responds with error if incorrect path specified', () => {
        return request(app)
        .get('/api/notTopics')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found")
        })  
      })
});


describe('/api', () => {
  test('GET 200: Responds with information on available api endpoints', () => {
      return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpoints)
      })  
    })
});

describe('/api/topics', () => {

    test('GET 200: Responds with 200 code & with array of topics, each with: slug, description ', () => {
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


describe('/api/articles:article_id', () => {

    test('GET 200: Responds with the correct article for the given article_id', () => {
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


    test('GET 404: Responds with 404 for an article_id not found', () => {
        return request(app)
        .get('/api/articles/999999')
        .expect(404)
        .then(({ body }) => {  
            expect(body.msg).toBe("Couldn't find requested article")
        })  
    });


    test('GET 400: Resonds with error for an invalid article_id', () => {
        return request(app)
        .get('/api/articles/not-an-id-number')
        .expect(400)
        .then(({ body }) => {  
            expect(body.msg).toBe("Bad request")
        })  
    });
});


describe('/api/articles', () => {

    test('GET 200: Responds with 200 & with array of articles', () => {
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


describe('/api/articles/:article_id/comments', () => {

  test('GET 200: Responds with 200 and array of comments (for a valid article ID & where comments exist)', () => {
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

  test('GET 200: Responds with the list of comments sorted by date desc.', () => {
    return request(app)
    .get('/api/articles/1/comments')
    .expect(200)
    .then(({ body }) => {
        const comments = body
        expect(comments).toBeSortedBy("created_at",{descending: true})
    })  
  });


  test('GET 200: Responds with 200 and empty array for a valid article_id which has no comments associated', () => {
  return request(app)
  .get('/api/articles/4/comments')
  .expect(200)
  .then(({ body }) => {  
  expect(body).toEqual([])
  })  
  });


  test('GET 404: Responds with not found when article_id is valid but non-existent', () => {
    return request(app)
    .get('/api/articles/99999/comments')
    .expect(404)
    .then(({ body }) => {  
    expect(body.msg).toBe("Article ID not found")
    })  
   });


   test('GET 400: Responds with error ID when article_id is not of a valid type', () => {
    return request(app)
    .get('/api/articles/not-an-id-number/comments')
    .expect(400)
    .then(({ body }) => {  
    expect(body.msg).toBe("Invalid article ID")
    })  
   });


   test('POST 201: Responds with created comment upon successful POST', () => {
    let commentToAdd = {
      username: 'rogersop',
      body: 'Foo bar'
    }
    return request(app)
    .post('/api/articles/1/comments')
    .send(commentToAdd)
    .expect(201)
    .then(( result ) => { 
      expect(result.body.comment).toMatchObject({
        author: 'rogersop',
        body: 'Foo bar',
        article_id: 1
      })
      expect(result.body.comment.hasOwnProperty("votes")).toBe(true);
      expect(result.body.comment.hasOwnProperty("created_at")).toBe(true);
    })  
   });


   test('POST 400: Responds with error when passed a body with missing information', () => {
    let commentToAdd = {
      username: 'rogersop'
    }
    return request(app)
    .post('/api/articles/1/comments')
    .send(commentToAdd)
    .expect(400)
    .then(( {body} ) => { 
      expect(body.msg).toBe("Missing required information")
    })  
   });


   test('POST 400: Responds with error when article id which is valid but non-existent', () => {
    let commentToAdd = {
      username: 'rogersop',
      body: 'Foo bar'
    }
    return request(app)
    .post('/api/articles/99999/comments')
    .send(commentToAdd)
    .expect(404)
    .then(( {body} ) => { 
      expect(body.msg).toBe("Article ID not found")
    })  
   });


   test('POST 400: Responds with error when given invalid article id', () => {
    let commentToAdd = {
      username: 'rogersop',
      body: 'Foo bar'
    }
    return request(app)
    .post('/api/articles/not-an-article-id/comments')
    .send(commentToAdd)
    .expect(400)
    .then(({ body }) => {  
    expect(body.msg).toBe("Invalid article ID")
    })
   });

   test("POST: 400 responds with error message when given a non-existent username", () => {
    let commentToAdd = { 
      username: "notausername",
      body: "Foo bar" 
    }
    return request(app)
      .post("/api/articles/1/comments")
      .send(commentToAdd)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });


   


});


