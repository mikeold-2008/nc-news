const request = require('supertest')
const app = require('../app')
const data = require("../db/data/test-data/index")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const endpoints = require("../endpoints.json")


beforeEach(() => {
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


    test('PATCH 200: Responds with updated article vote count when passed a valid article ID (positive number)', () => {
      let voteNumber = {inc_votes: 50}
      let updatedArticle = {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        votes: 150
      }
      return request(app)
      .patch('/api/articles/1')
      .send(voteNumber)
      .expect(200)
      .then(({ body }) => {  
        expect(body).toMatchObject(updatedArticle)
      })  
    });

    test('PATCH 200: Responds with updated article vote count when passed a valid article ID (negative number)', () => {
    let voteNumber = {inc_votes: -50}
    let updatedArticle =  {
      title: "Sony Vaio; or, The Laptop",
      topic: "mitch",
      author: "icellusedkars",
      votes: -50
    }
    return request(app)
    .patch('/api/articles/2')
    .send(voteNumber)
    .expect(200)
    .then(({ body }) => {  
      expect(body).toMatchObject(updatedArticle)
    })  
    });


    test('PATCH 404: Responds with not found for invalid article ID number', () => {
    let voteNumber = {inc_votes: 50}
    return request(app)
    .patch('/api/articles/9999')
    .send(voteNumber)
    .expect(404)
    .then(({ body }) => {  
      expect(body.msg).toBe("Article ID not found")
    })  
    });


    test('PATCH 400: Responds with bad request for invalid fields', () => {
    let voteNumber = {inc_votes: "not-a-number"}
    return request(app)
    .patch('/api/articles/1')
    .send(voteNumber)
    .expect(400)
    .then(({ body }) => {  
    expect(body.msg).toBe("Bad request")
    })  
    });

    test('PATCH 400: Responds with bad request for missing fields', () => {
      let voteNumber = {}
      return request(app)
      .patch('/api/articles/1')
      .send(voteNumber)
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


   test('POST 404: Responds with error when article id which is valid but non-existent', () => {
    let commentToAdd = {
      username: 'rogersop',
      body: 'Foo bar'
    }
    return request(app)
    .post('/api/articles/9999/comments')
    .send(commentToAdd)
    .expect(400)
    .then(( {body} ) => { 
      expect(body.msg).toBe("Bad request")
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


describe('/api/comments/:comment_id', () => {

  test('DELETE 204: Responds with empty object upon successful comment deletion', () => {
    return request(app)
    .delete('/api/comments/1')
    .expect(204)
    .then(({ body }) => {
      expect(body).toEqual({})
    })  
  });

  test('DELETE 404: Responds with error when trying to delete comment that doesnt exist', () => {
    return request(app)
    .delete('/api/comments/999999')
    .expect(404)
    .then(({ body }) => {
      expect(body).toEqual({msg:"Not found"})
    })  
  });

  test('DELETE 400: Responds with error when trying to delete comment with invalid id', () => {
    return request(app)
    .delete('/api/comments/not-an-id-number')
    .expect(400)
    .then(({ body }) => {
      expect(body).toEqual({msg:"Bad request"})
    })  
  });

});
 

describe('/api/users', () => {
  
  test('GET 200: Responds with list of users', () => {
    return request(app)
    .get('/api/users')
    .expect(200)
    .then(({body}) => {
      const {users} = body
      expect(users.length).not.toBe(0)
      users.forEach((user) => {
        expect(typeof user.username).toBe("string")
        expect(typeof user.name).toBe("string")
        expect(typeof user.avatar_url).toBe("string")
      })
    })    
  });

  test('GET 404: Responds with not found when given invalid path', () => {
    return request(app)
    .get('/api/notusers')
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Not found")
    })    
  });


});
