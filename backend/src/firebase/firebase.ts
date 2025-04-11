import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
  } as admin.ServiceAccount),
  storageBucket: process.env.FIREBASE_BUCKET,
});

const bucket = admin.storage().bucket();

export async function uploadToFirebase(localPath: string, destination: string): Promise<string> {
  await bucket.upload(localPath, {
    destination,
    metadata: {
      contentType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    },
  });

  await bucket.file(destination).makePublic();

  return `https://storage.googleapis.com/${bucket.name}/${destination}`;
}
