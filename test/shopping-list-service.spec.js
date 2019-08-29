'use strict';

const ListService = require('../src/shopping-list-service');
const knex = require('knex');

describe(`List Service object`, () => {

    let db;

    let testListItems = [
        {
            id: 1,
            name: 'carrots',
            price: '3.00',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: false,
            category: 'Main'
        },
        {
            id: 2,
            name: 'eggs',
            price: '4.00',
            date_added: new Date('2100-05-22T16:28:32.615Z'),
            checked: false,
            category: 'Breakfast'
        },
        {
            id: 3,
            name: 'sandwich',
            price: '5.00',
            date_added: new Date('1919-12-22T16:28:32.615Z'),
            checked: false,
            category: 'Lunch'
        }
    ];

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL 
        });
    });

    before(() => db('shopping_list').truncate());

    afterEach(() => db('shopping_list').truncate());

    after(() => db.destroy());

    context(`Given shopping list has no data`, () => {

        it(`getAllItems() resolves an empty array`, () => {
            return ListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql([]);
                });
        });

        it(`insertItem() adds item to 'shopping_list' and resolves id`, () => {
            const newItem = {
                name: 'Oreos',
                price: '3.50',
                date_added: new Date('1939-07-12T15:17:42.595Z'),
                checked: false,
                category: 'Snack'
            };

            return ListService.insertItem(db, newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        name: newItem.name,
                        price: newItem.price,
                        date_added: newItem.date_added,
                        checked: false,
                        category: newItem.category
                    });
                });
        });
    });

    context(`Given shopping list has data`, () => {

        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testListItems);
        });

        it(`getAllItems resolves all items from 'shopping_list'`, () =>  {
            return ListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(testListItems);
                });
        });

        it(`getById resolves item with correct id from 'shopping_list'`, () => {
            const thirdId = 3;
            const thirdItem = testListItems[thirdId - 1];

            return ListService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: thirdId,
                        name: thirdItem.name,
                        price: thirdItem.price,
                        date_added: thirdItem.date_added,
                        checked: false,
                        category: thirdItem.category
                    });
                });
        });

        it(`deletItem removes item from 'shopping_list'`, () => {
            const listItem = 3;
            return ListService.deleteItem(db, listItem)
                .then(() => ListService.getAllItems(db))
                .then(allItems => {
                    const expected = testListItems.filter(item => item.id !== listItem);
                    expect(allItems).to.eql(expected);
                });
        });

        it(`updateItem updates an item in the 'shopping_list'`, () => {
            const idOfItemToUpdate = 3;
            const newItemData = {
                name: 'updatedName',
                price: '100.00',
                date_added: new Date(),
                checked: false,
                category: 'Main'
            };

            return ListService.updateItem(db, idOfItemToUpdate, newItemData)
                .then(() => ListService.getById(db, idOfItemToUpdate))
                .then(actual => {
                    expect(actual).to.eql({
                        id: idOfItemToUpdate,
                        ...newItemData
                    });
                });
        });
    });

    //add out testlistitems
        //update item

});