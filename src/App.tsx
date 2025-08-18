import { Route, Routes } from "react-router";

import { Home, NoMatch } from "@/pages";
import Store from "@/pages/Store";
import Itinerary from "@/pages/Itinerary";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<Store />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/itinerary/:id" element={<Itinerary />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </>
  );
};

export default App;
