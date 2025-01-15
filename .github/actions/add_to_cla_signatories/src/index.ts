/**
 * Copyright 2025 Thousand Brains Project
 *
 * Copyright may exist in Contributors' modifications
 * and/or contributions to the work.
 *
 * Use of this source code is governed by the MIT
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
import * as core from "@actions/core";
import { DynamoDBClient, PutItemCommand, PutItemInput } from "@aws-sdk/client-dynamodb";
import { fromEnv } from "@aws-sdk/credential-providers";
import { marshall } from "@aws-sdk/util-dynamodb";

const claSignatoriesTableName = core.getInput("cla-signatories-table-name");
const claSignatoriesTableRegion = core.getInput("cla-signatories-table-region");
const claSignatory = core.getInput("cla-signatory");

const dynamodb = new DynamoDBClient(
    {
        credentials: fromEnv(),
        region: claSignatoriesTableRegion
    }
);
const putSignatory: PutItemInput =
{
    TableName: claSignatoriesTableName,
    Item: marshall(
        {
            created_at: new Date().toISOString(),
            username: claSignatory
        }
    )
}
await dynamodb.send(new PutItemCommand(putSignatory));