import AWS from "aws-sdk";

const AWS_BUCKET_NAME = `${process.env.REACT_APP_AWS_BUCKET_NAME}`;
const AWS_BUCKET_REGION = process.env.REACT_APP_AWS_BUCKET_REGION;
const AWS_IDENTITY_POOL_ID = `${process.env.REACT_APP_AWS_BUCKET_IDENTITY_POOL_ID}`;

function awsS3Config(): AWS.S3 {
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

export async function uploadFileAwsS3(mainFile: File) {
  const s3 = awsS3Config();
  try {
    await s3
      .upload({
        Bucket: AWS_BUCKET_NAME,
        Key: mainFile.name,
        Body: mainFile,
        ACL: "public-read",
      })
      .promise();

    console.log("이미지 업로드 성공");

    const latestObjectVersion = await getLatestObjectVersion(AWS_BUCKET_NAME, mainFile.name);

    console.log("여기까지 가니");
    console.log("Latest Object Version:", latestObjectVersion);

    return latestObjectVersion;
  } catch (err) {
    console.error("Error uploading file:", err);
  }
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

async function getLatestObjectVersion(bucketName: string, objectKey: string) {
  const s3 = awsS3Config();
  const listObjectVersionsParams = {
    Bucket: bucketName,
    Prefix: objectKey,
  };

  const objectVersions = await s3.listObjectVersions(listObjectVersionsParams).promise();

  if (objectVersions.Versions && objectVersions.Versions.length > 0) {
    const latestVersion = objectVersions.Versions[0]; // 최신 버전은 리스트의 첫 번째 요소
    return latestVersion.VersionId;
  } else {
    throw new Error("No object versions found.");
  }
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

export const getImageUrl = (imagePath: string) => {
  return (
    "https://" + AWS_BUCKET_NAME + ".s3." + AWS_BUCKET_REGION + ".amazonaws.com/" + `${imagePath}`
  );
};
