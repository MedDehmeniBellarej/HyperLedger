/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';


const EcardContract = require('./lib/chainCode').EcardContract;
const UserContract = require('./lib/chainCode').UserContract;
const CourseContract = require('./lib/chainCode').CourseContract;

module.exports.CourseContract = CourseContract;
module.exports.EcardContract = EcardContract;
module.exports.UserContract = UserContract;
module.exports.contracts = [ CourseContract, EcardContract , UserContract];
