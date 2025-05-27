# Academia Pulse Portal

Academia Pulse Portal is a comprehensive platform designed for academic institutions to streamline faculty and research management. It enables faculty members to manage their academic activities, research publications, professional development, and more. Heads of Departments (HODs) can monitor progress and generate insightful reports.

## Features

- **Faculty Dashboard:** Manage publications, projects, patents, workshops, awards, timetables, memberships, student projects, and teaching materials.
- **Research Management:** Upload and manage research publications, patents, and funded projects.
- **Professional Development:** Track FDP certifications, workshops, awards, and professional memberships.
- **Student Projects:** Supervise and manage student projects and teaching materials.
- **Timetable Management:** Organize and upload teaching schedules.
- **Reports Generation:** Generate comprehensive reports with advanced filtering and export options.
- **Secure & Reliable:** Role-based access control with secure file storage and data protection.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend/Database:** Supabase
- **State Management:** React Query
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or above)
- npm / yarn / pnpm

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-org/academia-pulse-portal.git
   cd academia-pulse-portal-main
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. **Configure Supabase:**
   - Update the `supabase/config.toml` file with your Supabase project credentials.

4. **Start the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open in browser:**
   - Visit [http://localhost:8080](http://localhost:8080)

## Project Structure

```
├── public/               # Static assets
├── src/
│   ├── components/       # UI components and forms
│   ├── hooks/            # Custom React hooks
│   ├── integrations/     # Supabase integration
│   ├── lib/              # Utility functions
│   ├── pages/            # Page components
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── index.html            # HTML template
├── tailwind.config.ts    # Tailwind CSS config
├── vite.config.ts        # Vite config
└── README.md             # Project documentation
```

## Customization

- Update branding, images, and meta tags in `index.html` as needed.
- Modify Supabase integration in `src/integrations/supabase/` for your backend setup.

## License

This project is maintained by the Academia Team.  
See [LICENSE](LICENSE) for more information.

---
**Note:** This project is not affiliated with Lovable or any AI code generation service. All code and content are tailored for academic use.

