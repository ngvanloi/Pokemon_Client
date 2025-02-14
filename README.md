# Frontend Angular 18 Application

A web application built using Angular 18 that displays a responsive interface with modern features. This application fetches data from a backend API and displays it in an intuitive user-friendly design. It uses Angular CLI, RxJS for handling asynchronous data, and Tailwind CSS for styling.

## Setup and Running Instructions

### Prerequisites

Before getting started, ensure that you have the following software installed:

- [Node.js](https://nodejs.org/en/) (version 14.x or higher)
- [Angular CLI](https://angular.io/cli) (version 18.x or higher)
- [Git](https://git-scm.com/)

### Steps to run the project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ngvanloi/Pokemon_Client.git
   cd Pokemon_Client
   ```

2. **Install dependencies**:
   Run the following command to install the required dependencies:
   ```bash
   npm install
   ```

3. **Start the development server**:
   To start the app locally, use:
   ```bash
   ng serve
   ```

4. **Access the application**:
   Open your web browser and navigate to `http://localhost:4200/` to view the application in action.

### Building for Production

To generate a production build of the application, run:

```bash
ng build --prod
```

The build files will be generated in the `dist/` directory, and you can deploy them to your desired hosting service.
