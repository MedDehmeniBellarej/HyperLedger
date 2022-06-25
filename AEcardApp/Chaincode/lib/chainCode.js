/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');


function uuidv4() {
    function random(){
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return random() + random() + '-' + random() +
     '-' + random() + '-' + random() + '-' + random() + random() + random();
}

class EcardContract extends Contract {

    async InitLedger(ctx) {
        const ECardModel = [
            {
                ID: 'Bard-Card',
                Owner: 'Bard',
                Balance: 500,
            },
            {
                ID: 'Max-Card',
                Owner: 'Max',
                Balance: 500,
            }, 
            {
                ID : '35c655e0-a5d7-4835-b8ae-5200026be1c1-Card',
                Owner: '35c655e0-a5d7-4835-b8ae-5200026be1c1' ,
                Balance: 0,
            }
        ];

        for (const card of ECardModel) {
            card.docType = 'card';
            await ctx.stub.putState(card.ID, Buffer.from(JSON.stringify(card)));
            console.info(`Asset ${card.ID} initialized`);
        }
    }

    async CreateECardModel( ctx, ownerid) {
        const userCard = {
            ID: ownerid + '-Card',
            Owner: ownerid,
            Balance: 0,
        };
        userCard.docType = 'card';
        await ctx.stub.putState(userCard.ID, Buffer.from(JSON.stringify(userCard)));
        return JSON.stringify(userCard);
    }

    async GetBalance(ctx, Owner) {
        const cardAsBytes = await ctx.stub.getState(Owner+'-Card'); // get the car from chaincode state
        if (!cardAsBytes || cardAsBytes.length === 0) {
            throw new Error(`${Owner} Card does not exist`);
        }
        const card = JSON.parse(cardAsBytes.toString());
        if (card.docType !== 'card'){
           throw new Error(`${Owner} Card does not exist`);
        }
        console.log(cardAsBytes.toString());
        return card.Balance.toString();
    }

    async TopupECard(ctx, ownerid, Balance) {
        console.info('============= START : Add Balance ===========');


        const cardAsBytes = await ctx.stub.getState(ownerid +'-Card');
        if (!cardAsBytes || cardAsBytes.length === 0) {
            throw new Error(`${ownerid} Card does not exist`);
        }

        const card = JSON.parse(cardAsBytes.toString());
        let X = parseFloat(Balance);
        let oldbalnce = parseFloat(card.Balance); 
        card.Balance = X + oldbalnce ; 
        await ctx.stub.putState(card.ID, Buffer.from(JSON.stringify(card)));  
        console.info('============= END : Add Balance ===========');
        return JSON.stringify(card);
    }

    async updateBalnce(ctx, ownerid, Balance) {
        console.info('============= START : Add Balance ===========');

        const cardAsBytes = await ctx.stub.getState(ownerid+'-Card');
        if (!cardAsBytes || cardAsBytes.length === 0) {
            throw new Error(`${ownerid} Card does not exist`);
        }
        const card = JSON.parse(cardAsBytes.toString());
        let X = parseFloat(Balance);
        let oldbalnce = parseFloat(card.Balance); 
        card.Balance = oldbalnce - X; 
        await ctx.stub.putState(card.ID, Buffer.from(JSON.stringify(card)));  
        console.info('============= END : Add Balance ===========');
        return JSON.stringify(card);
    }



}

class UserContract extends Contract {

    async InitLedger(ctx) {
        const userCard = [
            {
                ID: 'Bard',
            },
            {
                ID: 'Max',
            },
            
        ];

        for (const user of userCard) {
            user.docType = 'user';
            await ctx.stub.putState(user.ID, Buffer.from(JSON.stringify(user)));
            console.info(`Asset ${user.ID} initialized`);
        }
    }
    async CreateUser(ctx, ID) {
        const user = {
            ID : ID
        };
        user.docType = 'user';
        await ctx.stub.putState(user.ID, Buffer.from(JSON.stringify(user)));
        return JSON.stringify(user);

    }
    async queryUser(ctx, UserID) {
        const carAsBytes = await ctx.stub.getState(UserID);
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${UserID} does not exist`);
        }
        const user = JSON.parse(carAsBytes.toString());
        if (user.docType !== 'user'){
           throw new Error(`${Owner} Card does not exist`);
        }
        console.log(carAsBytes.toString());
        return carAsBytes.toString();
    }
    async queryAllTeachers(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {

                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            if (record.docType === 'user'){
                allResults.push({ Key: key, Record: record });
            }
            
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }
}

class CourseContract extends Contract {

    async InitLedger(ctx) {
        const Course = [
            {
                Id: '1c57347c-4a1b-4614-b8d1-8a0b8b132291',
                name : 'Cours_1',
                owner : 'Max',
                amount : 50 ,
            },
            {
                Id: '1c57347c-4a1b-4554-b8d1-8a0b8b132291',
                name : 'Cours_2',
                owner : 'Max',
                amount : 100 ,
            },
            {
                Id:'2c57347c-4a1b-4554-b8d1-8a0b8b132291',
                name : 'Cours_3',
                owner : 'Max',
                amount : 150 ,
            },
            
        ];

        for (const user of Course) {
            user.docType = 'course';
            await ctx.stub.putState(user.Id, Buffer.from(JSON.stringify(user)));
            console.info(`Asset ${user.Id} initialized`);
        }
    }
    async CreateCourse(ctx, id , Name , ownerId , Amount) {
        
        const Course = {
            Id: id,
            name : Name,
            owner : ownerId,
            amount : Amount ,
        };
        Course.docType = 'course';
        await ctx.stub.putState(Course.Id, Buffer.from(JSON.stringify(Course)));
        return JSON.stringify(Course);
    }

    async queryCourse(ctx, courseId) {
        const carAsBytes = await ctx.stub.getState(courseId);
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${courseId} does not exist`);
        }
        const user = JSON.parse(carAsBytes.toString());
        if (user.docType !== 'course'){
           throw new Error(`${Owner} Course does not exist`);
        }
        console.log(carAsBytes.toString());
        return carAsBytes.toString();
    }

    async GetAmount(ctx, courseId) {
        
        const carAsBytes = await ctx.stub.getState(courseId);
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${courseId} does not exist`);
        }
        const user = JSON.parse(carAsBytes.toString());
        if (user.docType !== 'course'){
           throw new Error(`${Owner} Course does not exist`);
        }
        console.log(carAsBytes.toString());
        return user.amount.toString();
    }

    async queryAllCourse(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {

                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            if (record.docType === 'course'){
                allResults.push({ Key: key, Record: record });
            }
            
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }
}

module.exports.CourseContract = CourseContract;
module.exports.EcardContract = EcardContract;
module.exports.UserContract = UserContract;

