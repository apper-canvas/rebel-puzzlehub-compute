import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const InfoCard = ({ icon, value, label, iconColor = 'text-gray-700' }) => {
  return (
    <div className="glass-effect px-4 py-2 rounded-xl">
      <div className="flex items-center space-x-2">
        <ApperIcon name={icon} className={`w-5 h-5 ${iconColor}`} />
        <span className="text-sm font-medium">{label}: {value}</span>
      </div>
    </div>
  )
}

export default InfoCard