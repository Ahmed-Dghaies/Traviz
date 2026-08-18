import { Route, Routes } from "react-router";

import { Home, NoMatch } from "@/pages";
import Itinerary from "@/pages/Itinerary";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/itinerary/:id" element={<Itinerary />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </>
  );
};

export default App;
