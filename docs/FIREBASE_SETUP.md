# Firebase setup

Nomad Weddings now uses Firebase as the official persistence layer when the public Firebase config is present.

## Environment

Copy `.env.example` to `.env.local` and fill the values from Firebase Console:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

If these values are missing, the app starts in local fallback mode with an empty database. It does not load the old demo seed.

## Firestore collections

The app syncs these collections in real time:

```text
leads
clients
events
vendors
vendorPrices
eventServices
tasks
calendarItems
documents
communications
parejaProfiles
reuniones
checklistItems
emailRecords
workspacePages
workspaceBlocks
notificationRecords
companyFinanceRecords
```

Every document uses its app `id` as the Firestore document id.

## Storage

Provider image uploads are stored at:

```text
vendors/{vendorId}/{generated-file-name}
```

The public download URL is added to the vendor `images` array.

## Production rules

For a real deployment, enable Firebase Authentication and restrict reads/writes to authenticated team members. A minimal starting point:

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

```js
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /vendors/{vendorId}/{fileName} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Do not use open public write rules in production.
