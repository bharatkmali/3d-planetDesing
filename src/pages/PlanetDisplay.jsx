import { motion } from "framer-motion";

export default function PlanetDisplay({ planet }) {
  const { name, galaxy, diameter, dayLength, temperature, climate, image } = planet;

  return (
    <motion.div
      key={name}
      className="flex flex-col items-center justify-center text-center text-white mt-8"
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -50 }}
      transition={{ duration: 1 }}
    >
      <h1 className="planet-title">{name}</h1>

      <div className="flex flex-wrap justify-center gap-10 mt-6 text-gray-300 text-sm">
        <div><span className="block text-gray-400">GALAXY</span>{galaxy}</div>
        <div><span className="block text-gray-400">DIAMETER</span>{diameter}</div>
        <div><span className="block text-gray-400">DAY LENGTH</span>{dayLength}</div>
        <div><span className="block text-gray-400">AVG TEMP</span>{temperature}</div>
        <div><span className="block text-gray-400">CLIMATE</span>{climate}</div>
      </div>

      <motion.img
        src={image}
        alt={name}
        className="planet-float w-[550px] mt-12"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
      />
    </motion.div>
  );
}
