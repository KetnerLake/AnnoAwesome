import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export default async ( req, ctx ) => {
  const client = new S3Client( {
    region: process.env.AWS_S3_REGION,
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS,
      secretAccessKey: process.env.AWS_S3_SECRET
    }
  } );

  if( req.method === 'POST' ) {
    const body = await req.json();
    const command = new PutObjectCommand( {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `${body.url}.json`,
      Body: JSON.stringify( body ),
      ACL: 'public-read'
    } );
    const data = await client.send( command );
    return new Response( JSON.stringify( data ) );
  }

  if( req.method === 'DELETE' ) {
    const body = await req.json();
    const command = new DeleteObjectCommand( {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `${body.url}.json`
    } );
    const data = await client.send( command );
    return new Response( JSON.stringify( data ) );
  }
  
  return new Response( 'Not supported' );
};

export const config = {
  path: '/api/public'
};
