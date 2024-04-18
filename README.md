# Northcoders News API

**Summary**

This probject is a backend API for a social media news and comment service. Users are able to read and post articles and comments, and upvote their favourites. This project was built using Node, PSQL and Express. Test-driven development performed with Jest and Supertest.

Hosted Link: https://nc-news-ldv7.onrender.com/api/

**Requirements**

Dependencies:
psql v. 15.6
node v. 18.13    
dotenv v. 16.0.0
express v. 4.19.2
pg v. 8.7.3

Dev Dependencies:
husky v. 8.0.2
jest v. 27.5.1
jest-extended v. 2.0.0
jest-sorted v. 1.0.15
pg-format v. 1.0.4
supertest v.6.3.4


**Setup**

First fork and clone the repo: https://github.com/mikeold-2008/nc-news

You'll then need to install dependencines listed above using the npm install command

In order to connect to the two local databases, you will need to add a .env.test and a .env.development file to your repo, each containing the relevant access credentials. Make sure to add these to the .gitignore file.
Add PGDATABASE=nc_news_test to the .env.test file
Add PGDATABASE=nc_news to the .env.development file



**Endpoints**

You will find a list of available endpoints and their descriptions example uses in the endpoints.json file, which can also be accessed using GET: /api