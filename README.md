# Amigos Hangouts

<!-- TODO: Add Screenshot of HomePage Feed -->

Amigos Hangouts helps you connect with friends and like-minded people for real-world activities and online interaction. Discover new groups, share your experiences, and plan your next hangout!

## Key Features

*   **User Authentication:** Secure sign-up and login.
*   **Personalized Profiles:** Customize your profile and share a bit about yourself.
*   **Social Feed:** Share updates, photos, and videos with your Amigos and Grupos.
*   **Amigos Network:** Connect with friends and see their activity.
*   **Grupos (Groups):** Join or create groups based on shared interests, hobbies, or communities.
*   **Event Planning:** (Functionality suggested by `EventCard.jsx`, `Events.jsx`) Organize or discover local hangouts and events.
*   **Onboarding Quiz:** Answer a few questions on signup to help us suggest relevant Amigos and Grupos.
*   **Interactive Map for Hangouts:** (Functionality suggested by `MapHangoutButton.jsx`, `MapHangoutsModal.jsx`) Explore and mark locations for hangouts.
*   **Notifications:** Stay updated on relevant activity.

<!-- TODO: Add GIF of Group Creation or Event Planning Flow -->

## Tech Stack

*   **Frontend:**
    *   React
    *   Vite
    *   JavaScript (ES6+)
    *   Tailwind CSS (styling, in progress)
    *   i18n (for internationalization)
*   **Backend & Platform:**
    *   Firebase
        *   Firebase Authentication
        *   Firestore (Database)
        *   Firebase Storage (for images, videos)
*   **Development & Tooling:**
    *   npm
    *   ESLint

## Project Overview

Amigos Hangouts is built with a component-based architecture using React. Key directories include:

*   `src/components/`: Contains reusable UI components (common, navigation, cards, etc.).
*   `src/components/pages/`: Houses the main page components (HomePage, ProfilePage, AmigosPage, GruposPage, etc.).
*   `src/firebase.js`: Firebase configuration and initialization.
*   `src/context/`: React context for global state management (e.g., Auth, UserPreferences).
*   `src/utils/`: Utility functions used across the application.
*   `src/seeder/`: Scripts for seeding initial data into Firestore.

The application aims for a simple, intuitive layout, focusing on connecting users for social interaction and activities.

<!-- TODO: Add Screenshot of Profile Page or Grupos Page -->

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (which includes npm) installed on your machine.
*   A Firebase project set up. You will need to configure your Firebase credentials.

### Installation & Setup

1.  **Clone the repo:**
    ```sh
    git clone https://github.com/tjarthur2511/amigos-app.git
    cd amigos-app
    ```
2.  **Install NPM packages:**
    ```sh
    npm install
    ```
3.  **Set up Firebase:**
    *   Create a `.env` file in the root of the project.
    *   Add your Firebase project configuration keys to the `.env` file. Example variables (use your actual Firebase config values):
        ```env
        VITE_FIREBASE_API_KEY=your_api_key
        VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
        VITE_FIREBASE_PROJECT_ID=your_project_id
        VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
        VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
        VITE_FIREBASE_APP_ID=your_app_id
        ```
    *   Ensure your Firestore database is initialized and you have appropriate security rules set up. You can use `firestore.rules` and `storage.rules` in this repository as a starting point.

4.  **Run the development server:**
    The `package.json` uses Vite. The typical command to start the Vite development server is:
    ```sh
    npm run dev
    ```
    (Previously, the README mentioned `npm start`. If `npm run dev` doesn't work, please check the `scripts` section in `package.json` and update this step accordingly.)

    Open [http://localhost:5173](http://localhost:5173) (or the port Vite indicates) to view it in your browser.

### Available Scripts

*   `npm run dev`: Runs the app in development mode with Vite.
*   `npm run build`: Builds the app for production.
*   `npm test`: Launches the test runner (if configured).

## Further Details

For more in-depth information about the project's structure, component rules, and specific observations, please refer to:

*   [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
*   [Observations_Report.md](Observations_Report.md)

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

*(Note: As per `PROJECT_STRUCTURE.md`, there are strict rules about maintaining the existing layout and design. Please discuss any significant UI changes before undertaking them.)*
