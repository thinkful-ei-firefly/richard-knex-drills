'use strict';

require('dotenv').config()
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: process.env.DB_URL,
});

console.log('connection successful');

function searchByProduceName(searchTerm) {
    db
        .select('product_id', 'name', 'price', 'category')
        .from('amazong_products')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(res => {
            console.log(res);
        })
        .finally(() => db.destroy());
}

function searchShoppingList(searchTerm) {
    db
        .select('name', 'price', 'category')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(res => console.log(res))
        .finally(() => db.destroy());
}

function paginateProducts(page) {
    const productsPerPage = 10
    const offset = productsPerPage * (page -1)
    db
        .select('product_id', 'name', 'price', 'category')
        .from('amazong_products')
        .limit(productsPerPage)
        .offset(offset)
        .then(res => {
            console.log(res);
        })
        .finally(() => db.destroy());
}

function paginateShoppingList(page) {
    const productsPerPage = 6;
    const offset = productsPerPage * (page -1);
    db
        .select('name', 'price', 'category')
        .from('shopping_list')
        .limit(productsPerPage)
        .offset(offset)
        .then(res => console.log(res))
        .finally(() => db.destroy());
}

function getProductsWithImages() {
    db
        .select('product_id', 'name', 'price', 'category')
        .from('amazong_products')
        .whereNotNull('image')
        .then(res => console.log(res))
        .finally(() => db.destroy());
}

function mostPopularVideosForDays(days) {
    db
        .select('video_name', 'region')
        .count('date_viewed AS views')
        .where(
            'date_viewed',
            '>',
            db.raw(`now() - '?? days'::INTERVAL`, days)
        )
        .from('whopipe_video_views')
        .groupBy('video_name', 'region')
        .orderBy([
            { column: 'region', order: 'ASC' },
            { column: 'views', order: 'DESC' }
        ])
        .then(res => console.log(res))
        .finally(() => db.destroy());
}

function addedShoppingList(days_ago) {
    const date = new Date();
    date.setDate(date.getDate() - days_ago);
    db
        .select('name', 'price', 'category')
        .from('shopping_list')
        .where(
            'date_added',
            '>',
            date)
        .then(res => console.log(res))
        .finally(() => db.destroy());
}

// searchByProduceName('holo');
// paginateProducts(2);
// getProductsWithImages();
// mostPopularVideosForDays(30);
// searchShoppingList('beef');
// paginateShoppingList(3);
// addedShoppingList(5);


