# Traviz - Travel Organizer App

![Traviz Banner](https://via.placeholder.com/800x200/3B82F6/FFFFFF?text=Traviz+-+Your+Ultimate+Travel+Companion)

A modern, cross-platform travel planning application built with **React** and **shadcn UI** components.  
Traviz helps travelers create, manage, and share detailed itineraries with an intuitive interface.

---

## ✨ Features

### Core Functionality

- **Trip Management**: Create and organize trips with destinations, dates, and participant details
- **Itinerary Planning**: Detailed daily schedules with activities, timing, and locations
- **Checklists**: Packing and preparation checklists with progress tracking
- **Document Storage**: Upload and access travel documents (tickets, reservations, etc.)
- **Notes**: Freeform memo section for travel ideas and tips

### Premium Features

- Unlimited trips (free version limited to 3 trips)
- Offline access to itineraries and documents
- Enhanced collaboration options
- Increased document storage capacity

---

## 🎨 User Experience

- Clean, modern interface following **shadcn UI** design principles
- Dark/Light mode support
- Responsive design for various screen sizes
- Accessibility features including screen reader support
- Web application with potential for mobile adaptation

---

## 🛠 Technology Stack

- **Frontend**: React with TypeScript
- **UI Components**: shadcn UI with Radix UI primitives
- **Backend**: Supabase for authentication and data storage
- **State Management**: Zustand
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd traviz
```

Install dependencies:

```bash
npm install
```

Set up environment variables:  
Create a `.env` file in the root directory with your API credentials:

```text
GEMINI_API_KEY=your_gemini_api_key_here
VITE_PUBLIC_SUPABASE_URL=your_supabase_url_here
VITE_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Start the development server:

```bash
npm run dev
```

### Building for Production

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

---

## 📂 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn-based components
│   └── itinerary/      # Itinerary-specific components
├── hooks/              # Custom React hooks
├── stores/             # Zustand state management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── pages/              # App pages
│   ├── Home/           # Home page with trip cards
│   ├── Itinerary/      # Itinerary detail view
│   ├── Schedule/       # Daily schedule view
│   ├── Checklist/      # Checklist management
│   ├── Documents/      # Document storage
│   ├── Memo/           # Notes section
│   └── Store/          # Premium features store
└── services/           # API and external services
    └── supabase/       # Supabase client and queries
```

---

## 📦 Key Dependencies

- `@supabase/supabase-js`: Database and authentication
- `@dnd-kit/core` & `@dnd-kit/sortable`: Drag and drop functionality
- `react-router`: Navigation
- `lucide-react`: Icons
- `zustand`: State management

---

## 🔑 Environment Variables

The application requires the following environment variables:

- **GEMINI_API_KEY**: API key for Gemini services (if used)
- **VITE_PUBLIC_SUPABASE_URL**: Your Supabase project URL
- **VITE_PUBLIC_SUPABASE_ANON_KEY**: Your Supabase anonymous API key

---

## 🤝 Contributing

We welcome contributions to **Traviz**! Please read our contributing guidelines before submitting pull requests.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

For support, email **support@traviz.app** or join our **Slack channel**.

---

## 🗺 Roadmap

- Integration with mapping services
- Real-time currency conversion
- Weather integration for destinations
- Advanced collaboration features
- Integration with booking platforms

---

## 🙏 Acknowledgments

- **shadcn UI** for the beautiful component library
- **Supabase** for the backend infrastructure
- **The React community** for excellent tools and resources

---

✨ **Traviz - Plan your journeys, create memories.**
