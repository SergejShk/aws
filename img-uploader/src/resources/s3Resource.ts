import type { AWS } from '@serverless/typescript';

export const s3Resource: AWS["resources"]["Resources"] = {
    ImageBucket: {
        Type: "AWS::S3::Bucket",
        Properties: {
            BucketName: "${self:service}-image-bucket",
        }
    },
    ImageBucketAllowPublicReadPolicy: {
        Type: "AWS::S3::BucketPolicy",
        Properties: {
            Bucket: {
              Ref: "ImageBucket",
            },
            PolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                    {
                        Sid: "AllAccess",
                        Effect: "Allow",
                        Principal: "*",
                        Action: "s3:*",
                        Resource: "arn:aws:s3:::img-uploader-image-bucket/*"
                    }
                ]
            }
        }
    }
}