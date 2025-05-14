# LiveWire

A modern news aggregation application.

![LiveWire Screenshot](https://via.placeholder.com/800x450.png?text=LiveWire+News+App)

## Features

- Display and filter news events from various sources
- Responsive design for desktop, tablet, and mobile
- Dark mode support for comfortable reading
- event saving and sharing capabilities
- Pagination for better performance with large datasets
- Accessibility enhancements for all users

## Project Structure

```
src/
├── components/      # React components
│   ├── Header.tsx   # Navigation header
│   ├── NewsFeed.tsx # Container for news events
│   ├── Newsevent.tsx # Individual event display
│   └── NotFound.tsx # 404 page component
├── services/        # API services
│   └── newsService.ts # News data fetching
├── types/           # TypeScript type definitions
│   └── index.ts     # Shared types
├── utils/           # Utility functions
│   └── helpers.ts   # Common helper functions
├── styles/          # CSS styles
│   └── styles.css   # Global styles
└── App.tsx          # Main app component
```

## Running the Application

### Prerequisites
- Node.js (v14.0.0 or newer)
- npm or yarn

### Installation
1. Clone the repository (if you haven't already)
2. Navigate to the project directory:
```
cd /Users/brendanchapuis/Projects/livewire
```
3. Install dependencies:
```
npm install
# or
yarn install
```

### Development Mode
To run the application in development mode:
```
npm start
# or
yarn start
```

This will start the development server, typically at http://localhost:3000

If you're getting a "Missing script: start" error, make sure your package.json has the proper scripts defined:
```
npm install react-scripts --save
```

### Production Build
To create a production build:
```
npm run build
# or
yarn build
```

The built files will be in the `build` or `dist` directory, which you can then deploy to a web server.

## Best Practices Used

- Proper TypeScript typing for all components and functions
- Responsive design with mobile-first approach
- Accessible components with proper ARIA attributes
- Error handling with user-friendly messages
- Performance optimizations (debouncing, memoization)
- Dark mode support with CSS variables

## Future Enhancements

- User authentication and profiles
- Personalized news recommendations based on reading history
- Offline reading capability with Service Workers
- Push notifications for breaking news
- Advanced filtering and sorting options
- Reading time estimates
- Social media integration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
