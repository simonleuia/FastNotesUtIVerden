# Assignment 3 – React Native Notes App

This application is a continuation of Assignment 2, where support for images in notes and notifications has been added.

The app is built using:
- React Native (Expo)
- Supabase (Auth, Database, Storage)
- Android Emulator (tested with Expo Go)

---

## Functionality

### User Management
- Users can sign up and log in
- Authentication is handled using Supabase Auth

### Notes
- Create new notes
- Edit existing notes
- Delete notes
- View a list of notes

---

## Camera Integration

- The app requests permission for:
  - Camera access
  - Media library access

- Users can:
  - Take a photo directly in the app
  - Select an image from the gallery

- The selected image is shown as a preview before saving
- Users can remove the selected image before saving

---

## Storage and Validation

- Images are validated before upload:
  - Maximum size: 15MB
  - Allowed formats: JPG, PNG, WebP

- Images are uploaded to Supabase Storage:
  - Bucket: `note-images`
  - Unique file names are used to prevent overwriting

- The image URL is stored in the database (`image_url`)
- The image is linked to the correct note

---

## UI/UX

- Loading state is shown during saving and uploading:
  - A spinner is displayed
  - The save button is disabled

- Images are displayed correctly:
  - No stretching
  - Proper aspect ratio (using `contain`)

- Images are shown:
  - As thumbnails in the notes list
  - In full view in the note detail screen

- Error messages are displayed when:
  - The file type is invalid
  - The file size exceeds the limit
  - The upload fails

---

## Notifications

- The app requests permission to send notifications
- A local notification is sent after a note is created
- The notification includes the title of the note
