'use client';

import { Tab } from '@headlessui/react';
import Image from 'next/image';
import { useEffect, useRef, useState, Fragment } from 'react';
import { FaUser, FaProjectDiagram, FaMedal, FaUsers, FaEnvelope, FaRobot } from 'react-icons/fa';

const TABS = [
  { name: 'About', icon: <FaUser /> },
  { name: 'Projects', icon: <FaProjectDiagram /> },
  { name: 'Skills & Awards', icon: <FaMedal /> },
  { name: 'Leadership', icon: <FaUsers /> },
  { name: 'Contact', icon: <FaEnvelope /> },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Typewriter({ text, speed = 30 }) {
  const [displayed, setDisplayed] = useState('');
  const [mounted, setMounted] = useState(false);
  const timeoutRef = useRef();

  useEffect(() => {
    setMounted(true);
    return () => clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setDisplayed('');
    let i = 0;
    function tick() {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i < text.length) {
        timeoutRef.current = setTimeout(tick, speed);
      }
    }
    if (text && text.length > 0) {
      timeoutRef.current = setTimeout(tick, speed);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [text, mounted, speed]);

  if (!mounted) return <span>{text}</span>;
  return <span>{displayed}</span>;
}

function StarsBackground({ totalPositions = 1000, minActiveDuration = 3000, maxActiveDuration = 10000, minDelay = 500, maxDelay = 4000 }) {
  const [stars, setStars] = useState([]);
  const timeoutsRef = useRef({});

  // Generate all star positions once
  useEffect(() => {
    const newStars = Array.from({ length: totalPositions }, (_, i) => ({
      id: i,
      top: Math.random() * 100, // percent
      left: Math.random() * 100, // percent
      size: Math.random() * 2 + 2, // px
      active: false,
      opacity: 0,
    }));
    setStars(newStars);
    return () => {
      // Clear all timeouts on unmount
      Object.values(timeoutsRef.current).forEach(clearTimeout);
    };
  }, [totalPositions]);

  // Helper to activate a star
  const activateStar = (starIdx) => {
    setStars((prev) => {
      const updated = [...prev];
      updated[starIdx] = { ...updated[starIdx], active: true };
      return updated;
    });
    // Fade in
    setTimeout(() => {
      setStars((prev) => {
        const updated = [...prev];
        updated[starIdx] = { ...updated[starIdx], opacity: 1 };
        return updated;
      });
    }, 10); // allow DOM update
    // Schedule deactivation
    const duration = Math.random() * (maxActiveDuration - minActiveDuration) + minActiveDuration;
    timeoutsRef.current[`deactivate-${starIdx}`] = setTimeout(() => deactivateStar(starIdx), duration);
  };

  // Helper to deactivate a star
  const deactivateStar = (starIdx) => {
    setStars((prev) => {
      const updated = [...prev];
      updated[starIdx] = { ...updated[starIdx], opacity: 0 };
      return updated;
    });
    // After fade out, set active to false and schedule next activation
    setTimeout(() => {
      setStars((prev) => {
        const updated = [...prev];
        updated[starIdx] = { ...updated[starIdx], active: false };
        return updated;
      });
      // Schedule next activation
      const delay = Math.random() * (maxDelay - minDelay) + minDelay;
      timeoutsRef.current[`activate-${starIdx}`] = setTimeout(() => activateStar(starIdx), delay);
    }, 500); // fade out duration
  };

  // On mount, randomly activate some stars
  useEffect(() => {
    if (stars.length === 0) return;
    // Activate a random 10% of stars initially
    const initialActive = Math.floor(totalPositions * 0.1);
    const indices = Array.from({ length: totalPositions }, (_, i) => i).sort(() => Math.random() - 0.5);
    indices.slice(0, initialActive).forEach((idx) => {
      const delay = Math.random() * (maxDelay - minDelay) + minDelay;
      timeoutsRef.current[`activate-${idx}`] = setTimeout(() => activateStar(idx), delay);
    });
    return () => {
      Object.values(timeoutsRef.current).forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stars.length]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="bg-white rounded-full absolute transition-opacity duration-500"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            pointerEvents: 'none',
          }}
        />
      ))}
    </div>
  );
}

function AnimatedBackground() {
  // SVG blobs for animated background
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <svg className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] opacity-30 animate-blob1" viewBox="0 0 200 200"><path fill="#60a5fa" d="M44.8,-67.2C56.7,-59.2,63.7,-44.2,68.2,-29.7C72.7,-15.2,74.7,-1.2,72.2,12.2C69.7,25.6,62.7,38.3,52.2,48.2C41.7,58.1,27.7,65.2,13.2,68.2C-1.3,71.2,-16.3,70.1,-29.2,63.2C-42.1,56.3,-52.9,43.6,-60.2,29.7C-67.5,15.8,-71.3,0.7,-68.7,-13.2C-66.1,-27.1,-57.1,-39.8,-45.6,-47.7C-34.1,-55.6,-20.1,-58.7,-5.2,-56.7C9.7,-54.7,19.4,-47.2,44.8,-67.2Z" transform="translate(100 100)" /></svg>
      <svg className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] opacity-20 animate-blob2" viewBox="0 0 200 200"><path fill="#818cf8" d="M44.8,-67.2C56.7,-59.2,63.7,-44.2,68.2,-29.7C72.7,-15.2,74.7,-1.2,72.2,12.2C69.7,25.6,62.7,38.3,52.2,48.2C41.7,58.1,27.7,65.2,13.2,68.2C-1.3,71.2,-16.3,70.1,-29.2,63.2C-42.1,56.3,-52.9,43.6,-60.2,29.7C-67.5,15.8,-71.3,0.7,-68.7,-13.2C-66.1,-27.1,-57.1,-39.8,-45.6,-47.7C-34.1,-55.6,-20.1,-58.7,-5.2,-56.7C9.7,-54.7,19.4,-47.2,44.8,-67.2Z" transform="translate(100 100)" /></svg>
    </div>
  );
}

function FloatingChatShell() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        className="bg-blue-600 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center text-2xl hover:bg-blue-700 transition-all animate-bounce"
        onClick={() => setOpen((o) => !o)}
        aria-label="Chat with me"
      >
        <FaRobot />
      </button>
      {open && (
        <div className="mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-blue-200 dark:border-blue-900 p-4 animate-fadein flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <FaRobot className="text-blue-500" />
            <span className="font-bold text-lg">Chat with Daniel</span>
          </div>
          <div className="flex-1 min-h-[120px] max-h-48 overflow-y-auto text-sm text-gray-700 dark:text-gray-200 mb-2 bg-gray-50 dark:bg-gray-800 rounded p-2">This is a placeholder for an interactive chatbot. {/* TODO: Integrate OpenAI API here */}</div>
          <form className="flex gap-2">
            <input className="flex-1 rounded border px-2 py-1 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" placeholder="Ask me anything..." disabled />
            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition" disabled>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-white to-blue-50 dark:from-[#0a0a0a] dark:to-[#171717] overflow-x-hidden">
      <StarsBackground count={100} />
      <AnimatedBackground />
      <header className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between py-10 px-6 gap-8">
        {/* Portrait Placeholder with floating animation */}
        <div className="w-40 h-40 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center overflow-hidden border-4 border-blue-400 shadow-lg mb-4 sm:mb-0 animate-float hover:scale-110 transition-transform duration-300">
          {/* Replace src with your portrait image */}
          <span className="text-gray-400 text-lg select-none">Portrait<br/>Placeholder</span>
        </div>
        <div className="flex-1 flex flex-col items-center sm:items-start">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-2 animate-slidein">Daniel Ganjali</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-1 animate-slidein delay-100">North York, Toronto, Canada</p>
          <p className="text-md text-gray-500 dark:text-gray-400 animate-slidein delay-200">Grade 10 @ University of Toronto Schools (UTS) | Class of 2027</p>
          <div className="flex gap-4 mt-3 animate-slidein delay-300">
            <a href="https://github.com/DanielGanjali" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline hover:text-blue-800 dark:hover:text-blue-400 transition-colors duration-200">GitHub</a>
            <a href="#" className="text-blue-600 hover:underline hover:text-blue-800 dark:hover:text-blue-400 transition-colors duration-200">LinkedIn</a>
            <a href="#" className="text-blue-600 hover:underline hover:text-blue-800 dark:hover:text-blue-400 transition-colors duration-200">Email</a>
            <a href="#" className="text-blue-600 hover:underline hover:text-blue-800 dark:hover:text-blue-400 transition-colors duration-200">Website</a>
          </div>
        </div>
      </header>
      <main className="w-full max-w-4xl mx-auto flex-1 flex flex-col">
        <Tab.Group>
          <Tab.List className="flex space-x-2 rounded-xl bg-blue-100/60 dark:bg-blue-900/30 p-2 mb-8 mx-4 overflow-x-auto relative">
            {TABS.map((tab, idx) => (
              <Tab as={Fragment} key={tab.name}>
                {({ selected }) => (
                  <button
                    className={classNames(
                      'flex items-center gap-2 px-5 py-2.5 text-base font-semibold rounded-lg transition-all duration-200 relative group',
                      selected
                        ? 'bg-blue-500 text-white shadow-lg scale-105'
                        : 'text-blue-700 dark:text-blue-200 hover:bg-blue-200/60 dark:hover:bg-blue-800/40 hover:scale-105'
                    )}
                  >
                    <span className="text-lg transition-transform duration-300 group-hover:scale-125">{tab.icon}</span>
                    <span>{tab.name}</span>
                    <span
                      className={classNames(
                        'absolute left-4 right-4 bottom-1 h-1 rounded bg-blue-400 transition-all duration-300',
                        'group-hover:opacity-80',
                        selected ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                      )}
                    ></span>
                  </button>
                )}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="flex-1">
            {/* About Tab (About + Education) */}
            <Tab.Panel>
              <div className="py-8 px-2 animate-fadein">
                <h2 className="text-2xl font-bold mb-2">About Me</h2>
                <p className="mb-4 text-lg text-gray-700 dark:text-gray-200"><Typewriter text={"Hi, I'm Daniel Ganjali! I'm a Grade 10 student at the University of Toronto Schools (UTS), passionate about robotics, artificial intelligence, and social-impact-driven engineering. I enjoy building technically impressive projects that combine software and hardware to solve real-world challenges. I lead one of Ontario's top robotics teams, build applied AI systems, and contribute to my community."} speed={15} /></p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-1">Personal</h3>
                    <ul className="list-disc ml-6 text-gray-700 dark:text-gray-200 space-y-1">
                      <li>Age: 15</li>
                      <li>Location: North York, Toronto, Canada</li>
                      <li>School: University of Toronto Schools (UTS)</li>
                      <li>Graduation Year: 2027</li>
                      <li>GPA: 4.0 (Grade 9 & 10)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Academic Honors</h3>
                    <ul className="list-disc ml-6 text-gray-700 dark:text-gray-200 space-y-1">
                      <li>Dean’s List, School Pin</li>
                      <li>Honor Roll in CCC Senior, CCC Junior, and Beaver</li>
                      <li>Top scorer in AMC, BCC</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Tab.Panel>
            {/* Projects Tab */}
            <Tab.Panel>
              <div className="py-8 px-2 animate-fadein grid grid-cols-1 md:grid-cols-2 gap-6">
                <h2 className="text-2xl font-bold mb-4 md:col-span-2">Projects</h2>
                {/* Project Cards */}
                {[{
                  title: 'TetherAI',
                  desc: 'Forecasts homeless shelter traffic using weather and historical data',
                  tech: 'LSTM model, FastAPI backend, interactive dashboard',
                  extra: 'Built for NGOs to plan resources better.'
                }, {
                  title: 'Predictra',
                  desc: 'Lightweight KPI forecasting platform for small businesses',
                  tech: 'Most Scalable Startup at SpurHacks 2025, 2nd Best AI Startup at SpurHacks',
                  extra: 'Led model development and infrastructure.'
                }, {
                  title: 'ByteBite',
                  desc: 'ML-powered food bank inventory and spoilage tracker',
                  tech: 'Built with local food banks',
                  extra: '3rd Place at social-impact hackathon.'
                }, {
                  title: 'PerfectPosture',
                  desc: 'Posture monitoring and correction system using pose estimation',
                  tech: 'Built with OpenCV and TensorFlow',
                  extra: 'Published at CAIAC 2025 – Canada\'s largest undergraduate AI conference.'
                }, {
                  title: 'COVID-19 Simulator',
                  desc: 'Simulates virus spread, mask use, and vaccine impact',
                  tech: 'Built in Python with NumPy and Matplotlib',
                  extra: 'Used in classrooms as an educational tool.'
                }].map((proj) => (
                  <div key={proj.title} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-5 flex flex-col gap-2 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-blue-100 dark:border-blue-900 animate-fadein">
                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">{proj.title}</h3>
                    <p className="text-gray-700 dark:text-gray-200">{proj.desc}</p>
                    <p className="text-xs text-blue-500 dark:text-blue-300">{proj.tech}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{proj.extra}</p>
                  </div>
                ))}
              </div>
            </Tab.Panel>
            {/* Skills & Awards Tab */}
            <Tab.Panel>
              <div className="py-8 px-2 animate-fadein">
                <h2 className="text-2xl font-bold mb-4">Skills & Awards</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-1">Technical Skills</h3>
                    <ul className="list-disc ml-6 text-gray-700 dark:text-gray-200 space-y-1">
                      <li><b>Languages:</b> Python, Java, C++, JavaScript, HTML/CSS</li>
                      <li><b>Frameworks/Tools:</b> TensorFlow, PyTorch, OpenCV, FastAPI, React, Arduino, ROS, Git</li>
                      <li><b>Topics:</b> Machine Learning, Reinforcement Learning, NLP, Computer Vision, Simulation, Robotics, Edge AI</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Spoken Languages</h3>
                    <ul className="list-disc ml-6 text-gray-700 dark:text-gray-200 space-y-1">
                      <li>English (Fluent)</li>
                      <li>Persian (Fluent)</li>
                      <li>French (Elementary)</li>
                      <li>Mandarin (Elementary)</li>
                    </ul>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="font-semibold mb-1">Awards & Certifications</h3>
                    <ul className="list-disc ml-6 text-gray-700 dark:text-gray-200 space-y-1">
                      <li>Most Scalable Startup – SpurHacks (Predictra)</li>
                      <li>2nd Best AI Startup – SpurHacks</li>
                      <li>3rd Place Hackathon – ByteBite</li>
                      <li>DeepLearning.AI Specialization (Andrew Ng)</li>
                      <li>RCM Level 9 Piano – Completed 2025</li>
                      <li>UTS School Pin</li>
                      <li>CCC Senior Score: 50 (Top 70 in Canada)</li>
                      <li>CCC and Beaver Computing Challenge Honor Roll</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Tab.Panel>
            {/* Leadership Tab */}
            <Tab.Panel>
              <div className="py-8 px-2 animate-fadein">
                <h2 className="text-2xl font-bold mb-4">Leadership & Extracurriculars</h2>
                <ul className="list-disc ml-6 text-gray-700 dark:text-gray-200 space-y-1">
                  <li>Captain, UTS Robotics Team (Ranked 5th in Ontario, Qualified for Worlds)</li>
                  <li>Volunteer, Food Banks (logistics and tech consulting)</li>
                  <li>Environmental Volunteer, YRES (30+ hours)</li>
                  <li>Competitive Swimmer and Certified Lifeguard (Bronze Cross, NLS, etc.)</li>
                  <li>Competitive Coder (CCC Honor Roll, CCO candidate)</li>
                  <li>Entrepreneurship: FBLA: 12th in Canada, Blue Ocean Competition: Finalist</li>
                  <li>Robotics Summer Camp Organizer and Instructor</li>
                </ul>
              </div>
            </Tab.Panel>
            {/* Contact Tab */}
            <Tab.Panel>
              <div className="py-8 px-2 flex flex-col items-center animate-fadein">
                <h2 className="text-2xl font-bold mb-2">Contact</h2>
                <div className="flex flex-col gap-2 text-gray-700 dark:text-gray-200">
                  <span><span className="font-semibold">GitHub:</span> <a href="https://github.com/DanielGanjali" className="text-blue-600 hover:underline hover:text-blue-800 dark:hover:text-blue-400 transition-colors duration-200" target="_blank" rel="noopener noreferrer">https://github.com/DanielGanjali</a></span>
                  <span><span className="font-semibold">LinkedIn:</span> <a href="#" className="text-blue-600 hover:underline hover:text-blue-800 dark:hover:text-blue-400 transition-colors duration-200">[your LinkedIn]</a></span>
                  <span><span className="font-semibold">Email:</span> <a href="#" className="text-blue-600 hover:underline hover:text-blue-800 dark:hover:text-blue-400 transition-colors duration-200">[your email]</a></span>
                  <span><span className="font-semibold">Website:</span> <a href="#" className="text-blue-600 hover:underline hover:text-blue-800 dark:hover:text-blue-400 transition-colors duration-200">[your portfolio site]</a></span>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </main>
      <footer className="w-full text-center text-xs text-gray-400 py-4">&copy; {new Date().getFullYear()} Daniel Ganjali. All rights reserved.</footer>
      <FloatingChatShell />
    </div>
  );
}
