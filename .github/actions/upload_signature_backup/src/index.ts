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
import { PutObjectCommand, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";
import { readFile } from "node:fs/promises";
import { basename } from "node:path";

const signatureBackupBucketName = core.getInput("signature-backup-bucket-name");
const signatureBackupBucketRegion = core.getInput("signature-backup-bucket-region");
const signatureArtifactPath = core.getInput("signature-artifact-path");
const signatureArtifactName = basename(signatureArtifactPath);

const s3 = new S3Client(
    {
        credentials: fromEnv(),
        region: signatureBackupBucketRegion
    }
);
const putObject: PutObjectCommandInput =
{
    Bucket: signatureBackupBucketName,
    Key: signatureArtifactName,
    Body: await readFile(signatureArtifactPath)
}
try
{
    await s3.send(new PutObjectCommand(putObject));
}
catch (error)
{
    core.setFailed(`Failed to upload signature backup: ${error}`);
}