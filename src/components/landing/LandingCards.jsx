import React from 'react';

const tasks = [
  {
    title: "Finish Your Profile",
    description: "Add your name, photo, location, and preferred language to complete your profile.",
    icon: "👤",
  },
  {
    title: "Complete Your Quiz",
    description: "Answer a few quick questions to help match you with future Amigos.",
    icon: "📝",
  },
  {
    title: "Find Your First Amigo",
    description: "Browse suggested amigos based on your hobbies and activities.",
    icon: "🤝",
  },
  {
    title: "Join a Grupo",
    description: "Find or create a Grupo based on your favorite activities.",
    icon: "🌎",
  },
];

const LandingCards = () => {
  return (
    <section className="flex flex-col items-center py-12 bg-gray-50">
      <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
        Get Started in 4 Easy Steps
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full px-6">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            <div className="text-5xl mb-4">{task.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LandingCards;
