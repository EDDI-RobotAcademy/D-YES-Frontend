import AWS from "aws-sdk";

const AWS_BUCKET_NAME = `${process.env.REACT_APP_AWS_BUCKET_NAME}`;
const AWS_BUCKET_REGION = process.env.REACT_APP_AWS_BUCKET_REGION;
const AWS_IDENTITY_POOL_ID = `${process.env.REACT_APP_AWS_BUCKET_IDENTITY_POOL_ID}`;

export function awsS3Config(): AWS.S3 {
  AWS.config.update({
    region: AWS_BUCKET_REGION,
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: AWS_IDENTITY_POOL_ID,
    }),
  });
  return new AWS.S3({
    apiVersion: "2006-03-01",
    params: {
      Bucket: AWS_BUCKET_NAME,
    },
  });
}

export function uploadFileAwsS3(mainFile: File) {
  const s3 = awsS3Config();
  s3.upload(
    {
      Bucket: AWS_BUCKET_NAME,
      Key: mainFile.name,
      Body: mainFile,
      ACL: "public-read",
    },
    (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("이미지 업로드 성공");
    }
  );
}

export function uploadFilesAwsS3(detailsFiles: File[]) {
  const s3 = awsS3Config();
  detailsFiles.forEach((file: File) => {
    s3.upload(
      {
        Bucket: AWS_BUCKET_NAME,
        Key: file.name,
        Body: file,
        ACL: "public-read",
      },
      (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(`이미지 ${file.name} 업로드 성공`);
      }
    );
  });
}

export function deleteAwsS3File(key: string) {
  const s3 = awsS3Config();
  s3.deleteObject(
    {
      Bucket: AWS_BUCKET_NAME,
      Key: key,
    },
    (err: Error, data: AWS.S3.DeleteObjectOutput) => {
      if (err) {
        return;
      }
      alert("삭제 완료");
    }
  );
}
