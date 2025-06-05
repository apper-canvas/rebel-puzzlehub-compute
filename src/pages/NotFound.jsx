import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <ApperIcon name="Puzzle" className="w-24 h-24 text-primary mx-auto" />
        </motion.div>
        
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">Puzzle Piece Missing!</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Looks like this page wandered off. Let's get you back to solving puzzles!
        </p>
        
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow inline-flex items-center space-x-2"
          >
            <ApperIcon name="Home" className="w-5 h-5" />
            <span>Back to Puzzles</span>
          </motion.button>
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound