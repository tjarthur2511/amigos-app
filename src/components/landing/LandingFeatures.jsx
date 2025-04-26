import React from 'react';

const features = [
  {
    title: "Find Real Friends",
    description: "Discover amigos based on hobbies, passions, and real-world activities.",
    icon: "🎯",
  },
  {
    title: "Join Fun Grupos",
    description: "Create or join groups centered around your favorite adventures.",
    icon: "🌟",
  },
  {
    title: "Live Real Adventures",
    description: "Hang out online or in person with a community built for connection.",
    icon: "🚀",
  },
];

const LandingFeatures = () => {
  return (
    <section className="flex flex-col items-center py-12 bg-white">
      <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
        Why Join Amigos?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-6 rounded-2xl shadow-md hover:shadow-lg transition-all"
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LandingFeatures;
