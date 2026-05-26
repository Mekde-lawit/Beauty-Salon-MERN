import AboutUs from "../components/AboutUs";
import BranchList from "../components/Branches";
import Contact from "../components/Contact";
import Hero from "../components/Hero";
import Services from "../components/Services";
import TeamMembers from "../components/TeamMembers";
import "./../App.css";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <Services />
      <AboutUs />
      <TeamMembers />
      <BranchList />
      <Contact />
    </div>
  );
};

export default HomePage;
