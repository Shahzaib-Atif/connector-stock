# Connector-Stock — Client

This is the frontend application for the Connector-Stock management system, built with **React 19** and **Vite**. It provides a modern, responsive interface for managing sample registrations, tracking inventory, and generating labels.

## Tech Stack

- **Core**: React 19, TypeScript, Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Icons**: Lucide React, Heroicons

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server:
```bash
npm start
```

## Production Build

To build the application for production:
```bash
npm run build
```
The output will be generated in the `dist` folder. 

> [!NOTE]
> The NestJS backend is configured to serve this `dist` folder directly in production environments, providing a unified deployment experience.

## Features

- **Sample Creation Wizard**: Guided multi-step process for creating samples using Order (ENC) or Budget (ORC) data.
- **Inventory Management**: Real-time tracking of connector and accessory stock.
- **Responsive Design**: Optimized for both desktop and mobile usage in industrial environments.

## Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
