# Midd Rides

[Midd Rides](https://middrides.com) is an app for the Midd Rides evening transportation service at Middlebury College.

Students, faculty, and staff can use the app to request a ride to and from any of the designated stops during normal operating hours. The app also features a map of the Middlebury campus with a bus icon showing the real-time location of the bus.

Midd Rides workers can use the app to view all ride requests in the order in which they were made, keep track of who has been picked up and who hasn't, and add, edit, and delete requests as necessary.

## Demo
Since much of the app is inaccessible to those without a middlebury.edu email, I have included video demos of the app in a [GitHub Page](https://woojinrichardson.github.io/middrides/) for the project.

## Tech

### Front end
- [React](https://reactjs.org)
- [Semantic UI](https://semantic-ui.com) (UI framework)
- [google-maps-react](https://github.com/fullstackreact/google-maps-react) (Google Maps React component)

### Back end
- [Firebase](https://firebase.google.com)
    - [Authentication](https://firebase.google.com/products/auth) (authentication using Google Sign-In)
    - [Cloud Firestore](https://firebase.google.com/products/firestore) (database, role-based access control)
    - [Hosting](https://firebase.google.com/products/hosting)
    - [Cloud Functions](https://firebase.google.com/products/functions) (backend JavaScript functions)
