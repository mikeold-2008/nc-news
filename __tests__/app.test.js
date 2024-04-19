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

    test('GET 200: Responds with the correct article for the given article_id, with comment count total', () => {
        const article = {
            article_id: 1,
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number)
          }
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {  
        expect(body).toMatchObject(article)
        })  
      })

    test('GET 404: Responds with 404 for an article_id not found', () => {
        return request(app)
        .get('/api/articles/999999')
        .expect(404)
        .then(({ body }) => {  
            expect(body.msg).toBe("Not found")
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
      const voteNumber = {inc_votes: 50}
      const updatedArticle = {
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
    const voteNumber = {inc_votes: -50}
    const updatedArticle =  {
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
    const voteNumber = {inc_votes: 50}
    return request(app)
    .patch('/api/articles/9999')
    .send(voteNumber)
    .expect(404)
    .then(({ body }) => {  
      expect(body.msg).toBe("Not found")
    })  
    });

    test('PATCH 400: Responds with bad request for invalid fields', () => {
    const voteNumber = {inc_votes: "not-a-number"}
    return request(app)
    .patch('/api/articles/1')
    .send(voteNumber)
    .expect(400)
    .then(({ body }) => {  
    expect(body.msg).toBe("Bad request")
    })  
    });

    test('PATCH 400: Responds with bad request for missing fields', () => {
      const voteNumber = {}
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
    const {articles} = body
    expect(articles.length).not.toBe(0)
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

    test('GET 200: (Filter) Responds with 200 & array of articles filtered by topic', () => {
      return request(app)
      .get('/api/articles?topic=mitch')
      .expect(200)
      .then(({ body }) => {
      const {articles} = body
      expect(articles.length).not.toBe(0)
      expect(articles).toBeSortedBy("created_at",{descending: true,coerce:true})
          articles.forEach((article) => {
          expect(typeof article.author).toBe("string")
          expect(typeof article.title).toBe("string")
          expect(typeof article.article_id).toBe("number")
          expect(typeof article.created_at).toBe("string")
          expect(typeof article.votes).toBe("number")
          expect(typeof article.article_img_url).toBe("string")
          expect(typeof article.comment_count).toBe("number")
          expect(article.body).toBe(undefined)
          expect(article.topic).toEqual("mitch")
          })
      })  
      }) 

    test('GET 200: (Filter) Responds with 200 & ignores invalid filter crtieria, returns array of all articles', () => {
        return request(app)
        .get('/api/articles?notatopic=mitch')
        .expect(200)
        .then(({ body }) => {
        const {articles} = body
        expect(articles.length).not.toBe(0)
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

    test('GET 404: (Filter) Responds with not found when filtering by topic that doesnt exist', () => {
        return request(app)
        .get('/api/articles?topic=notatopic')
        .expect(404)
        .then(({ body }) => {
        expect(body.msg).toBe("Not found")
        })  
      }) 

    test('GET 200: (Sort) Responds with 200 & data sorted by given criteria (returns array of articles)', () => {
        return request(app)
        .get('/api/articles?sort_by=article_id&order=asc')
        .expect(200)
        .then(({ body }) => {
        const {articles} = body
        expect(articles.length).not.toBe(0)
        expect(articles).toBeSortedBy("article_id",{coerce:true})
        })  
    }) 

    test('GET 200: (Sort) Responds with 200 & default sort order if not specified (returns array of articles)', () => {
      return request(app)
      .get('/api/articles?sort_by=article_id')
      .expect(200)
      .then(({ body }) => {
      const {articles} = body
      expect(articles.length).not.toBe(0)
      expect(articles).toBeSortedBy("article_id",{descending:true,coerce:true})
      })  
    }) 

    test('GET 200: (Sort & Filter) Responds with 200 & array of sorted articles when filtered by topic)', () => {
      return request(app)
      .get('/api/articles?topic=mitch&sort_by=article_id&order=asc')
      .expect(200)
      .then(({ body }) => {
      const {articles} = body
      expect(articles.length).not.toBe(0)
      articles.forEach((article) => {
        expect(article.topic).toEqual("mitch")
      })
      expect(articles).toBeSortedBy("article_id",{coerce:true})
      })  
    }) 

    test('GET 400: (Sort) Responds with 400/bad request if sort criteria is invalid', () => {
    return request(app)
    .get('/api/articles?sort_by=not-a-sort-column')
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request")
    })  
    }) 

    test('GET 400: (Sort) Responds with 400/bad request if sort order is invalid', () => {
    return request(app)
    .get('/api/articles?sort_by=article_id&order=not-a-sort-order')
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request")
    })  
    }) 

    test('GET 200: (Pagination) Responds with 200 & with array of paginated articles (default values)', () => {
      return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
      const {total_count,articles} = body
      expect(articles).toHaveLength(10)
      expect(articles).toBeSortedBy("created_at",{descending: true,coerce:true})
      expect(total_count).toBe(13)
      })  
    }) 

    test('GET 200: (Pagination) Responds with 200 & with array of paginated articles (specified values, sort and filter applied)', () => {
      return request(app)
      .get('/api/articles?limit=5&p=2&sort_by=article_id&order=asc&topic=mitch')
      .expect(200)
      .then(({ body }) => {
      const {total_count,articles} = body
      expect(articles).toHaveLength(5)
      expect(articles).toBeSortedBy("article_id",{coerce:true})
      expect(total_count).toBe(12)
      articles.forEach((article) => {
      expect(article.article_id).toBeGreaterThan(5)
      })
      })  
    }) 

    test('GET 400: (Pagination) Responds with bad request when invalid limit given', () => {
      return request(app)
      .get('/api/articles?limit=not-a-limit&p=1')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request")
      })  
    }) 

    test('GET 400: (Pagination) Responds with bad request when invalid p value given', () => {
      return request(app)
      .get('/api/articles?limit=10&p=-1')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request")
      })  
    }) 


    test('GET 404: (Pagination) Responds with bad request when invalid limit value given', () => {
      return request(app)
      .get('/api/articles?limit=-1&p=1')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request")
      })  
    }) 
  


});


describe('/api/articles/:article_id/comments', () => {

  test('GET 200: Responds with 200 and array of comments (for a valid article ID & where comments exist)', () => {
    return request(app)
    .get('/api/articles/1/comments')
    .expect(200)
    .then(({ body }) => {
        const {comments} = body
        expect(comments.length).not.toBe(0)
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
        const {comments} = body
        expect(comments).toBeSortedBy("created_at",{descending: true})
    })  
  });


  test('GET 404: Responds with 404 and empty array for a valid article_id which has no comments associated', () => {
  return request(app)
  .get('/api/articles/4/comments')
  .expect(404)
  .then(({ body }) => {  
  expect(body.msg).toEqual("Not found")
  })  
  });


  test('GET 404: Responds with not found when article_id is valid but non-existent', () => {
    return request(app)
    .get('/api/articles/99999/comments')
    .expect(404)
    .then(({ body }) => {  
    expect(body.msg).toBe("Not found")
    })  
   });


   test('GET 400: Responds with error ID when article_id is not of a valid type', () => {
    return request(app)
    .get('/api/articles/not-an-id-number/comments')
    .expect(400)
    .then(({ body }) => {  
    expect(body.msg).toBe("Bad request")
    })  
   });


   test('POST 201: Responds with created comment upon successful POST', () => {
    const commentToAdd = {
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


   test('POST 201: Responds with created comment upon successful POST, ignoring extraneuous information', () => {
    const commentToAdd = {
      username: 'rogersop',
      body: 'Foo bar',
      notafield: "notavalue"
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
    const commentToAdd = {
      username: 'rogersop'
    }
    return request(app)
    .post('/api/articles/1/comments')
    .send(commentToAdd)
    .expect(400)
    .then(( {body} ) => { 
      expect(body.msg).toBe("Bad request")
    })  
   });


   test('POST 400: Responds with error when article id which is valid but non-existent', () => {
    const commentToAdd = {
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
    const commentToAdd = {
      username: 'rogersop',
      body: 'Foo bar'
    }
    return request(app)
    .post('/api/articles/not-an-article-id/comments')
    .send(commentToAdd)
    .expect(400)
    .then(({ body }) => {  
    expect(body.msg).toBe("Bad request")
    })
   });

   test("POST 400: responds with error message when given a non-existent username", () => {
    const commentToAdd = { 
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


  test('GET 200: (Pagination) Responds with 200 & with array of paginated comments (default pagination))', () => {
    return request(app)
    .get('/api/articles/1/comments?limit=10&p=1')
    .expect(200)
    .then(({ body }) => {
    const {total_count,comments} = body
    expect(comments).toHaveLength(10)
    expect(total_count).toBe(11)
    })  
  }) 

  test('GET 200: (Pagination) Responds with 200 & with array of paginated articles (specified values)', () => {
    return request(app)
    .get('/api/articles/1/comments?limit=5&p=1')
    .expect(200)
    .then(({ body }) => {
    const {total_count,comments} = body
    expect(comments).toHaveLength(5)
    expect(total_count).toBe(11)
    })  
  }) 

  test('GET 400: (Pagination) Responds with bad request when invalid limit given', () => {
    return request(app)
    .get('/api/articles/1/comments?limit=not-a-limit&p=1')
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request")
    })  
  }) 

  test('GET 400: (Pagination) Responds with bad request when invalid p value given', () => {
    return request(app)
    .get('/api/articles/1/comments?limit=10&p=-1')
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request")
    })  
  }) 


  test('GET 404: (Pagination) Responds with bad request when invalid limit value given', () => {
    return request(app)
    .get('/api/articles/1/comments?limit=-1&p=1')
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request")
    })  
  }) 

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

});


describe('/api/users/:username', () => {
  
  test('GET 200: Responds with the requested user', () => {
    const userObject = {
      username: expect.any(String),
      name: expect.any(String),
      avatar_url: expect.any(String)
    }
    return request(app)
    .get('/api/users/butter_bridge')
    .expect(200)
    .then(({body}) => {
    const {user} = body        
      expect(user).toMatchObject(userObject)
    })    
  });


  test('GET 404: Responds with 404 if username doesnt exist', () => {
    return request(app)
    .get('/api/users/not-a-username')
    .expect(404)
    .then(({body}) => {     
      expect(body.msg).toEqual("Not found")
    })    
  });


  
  });
  

