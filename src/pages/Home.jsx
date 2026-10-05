import React from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Services from '../components/Services';
import Profile from '../components/Profile';
import Transformations from '../components/Transformations';
import Testimonials from '../components/Testimonials';
import FitnessTools from '../components/FitnessTools';
import Plans from '../components/Plans';

const Home = () => {
  return (
    <main>
      <Hero />
      <Stats />
      <Services />
      <Profile />
      <Transformations />
      <Testimonials />
      <FitnessTools />
      <Plans />
    </main>
  );
};

export default Home;
