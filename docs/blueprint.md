# **App Name**: Chartly

## Core Features:

- Email/Password Authentication: Provide login via email and password using Firebase Authentication.
- Google Sign-In: Offer login via Google sign-in using Firebase Authentication.
- File Upload: Allow users to upload CSV, XLSX, and JSON files using a drag-and-drop interface or a file picker.
- In-Browser File Parsing: Parse uploaded files (CSV, XLSX, JSON) in the browser using PapaParse and xlsx libraries.
- Dynamic Chart Generation: Automatically generate charts (Line, Bar, Pie, Scatter, Radar, Gauge) using ECharts based on the data type detected in the uploaded file. No tool use is expected for these detections.
- Responsive Chart Display: Display charts in a responsive grid layout that adapts to different screen sizes.
- Auth persistence: Ensure user authentication is persistent, so users remain logged in across sessions.

## Style Guidelines:

- Primary color: Soft Blue (#64B5F6) to evoke a sense of calm and reliability, appropriate for data visualization.
- Background color: Light Gray (#F0F4F8), very low saturation, for a clean, distraction-free workspace.
- Accent color: Soft Green (#81C784), analogous to the primary color but with a different saturation and brightness, used for key actions and highlights.
- Font pairing: 'Inter' (sans-serif) for both headlines and body text to provide a modern, clean, and readable interface.
- Use minimalist icons from a library like FontAwesome or Feather icons for common actions and file types.
- Implement a clean, light theme with rounded cards, subtle shadows, and consistent padding using Tailwind CSS.
- Add subtle animations to charts on render to enhance the user experience.