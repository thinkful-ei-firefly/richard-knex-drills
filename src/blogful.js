'use strict';

require('dotenv').config();
const knex = require('knex');
const ArticleService = require('./articles-service');

const db = knex({
    client: 'pg',
    connection: process.env.DB_URL,
});

//Use all the ArticlesService methods!!
ArticleService.getAllArticles(db)
    .then(articles => console.log(articles))
    .then(() => {
        ArticleService.insertArticle(db, {
            title: 'New title',
            content: 'New content',
            date_published: new Date();
        })
    })
    .then(newArticle => {
        console.log(newArticle)
        return ArticleService.updateArticle(
            db,
            newArticle.id,
            { title: 'Updated title' }
        )
        .then(() => ArticleService.getById(db, newArticle.id))
    })
    .then(Article => {
        console.log(article)
        return ArticleService.deleteArticle(db, article.id)
    })
