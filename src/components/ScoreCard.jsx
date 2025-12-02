import { Box, Typography, LinearProgress } from '@mui/material'

function ScoreCard({ title, score, description, color }) {
  const getColor = (score) => {
    if (score >= 80) return 'success'
    if (score >= 60) return 'warning'
    return 'error'
  }

  const getGradient = (color) => {
    const gradients = {
      blue: 'from-blue-500 to-cyan-500',
      green: 'from-green-500 to-emerald-500',
      purple: 'from-purple-500 to-pink-500',
      orange: 'from-orange-500 to-red-500',
    }
    return gradients[color] || gradients.blue
  }

  return (
    <Box className={`p-6 border-2 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br ${getGradient(color)} bg-opacity-5`}>
      <Box className="flex justify-between items-center mb-3">
        <Typography variant="h6" className="font-bold text-gray-800">
          {title}
        </Typography>
        <Box className={`px-4 py-2 bg-gradient-to-r ${getGradient(color)} rounded-xl shadow-lg`}>
          <Typography variant="h5" className="font-black text-white">
            {score}
          </Typography>
        </Box>
      </Box>
      
      <LinearProgress
        variant="determinate"
        value={score}
        color={getColor(score)}
        className="mb-3 h-3 rounded-full"
        sx={{
          backgroundColor: '#e5e7eb',
          '& .MuiLinearProgress-bar': {
            borderRadius: '9999px',
          },
        }}
      />
      
      <Typography variant="body2" className="text-gray-600 font-medium">
        {description}
      </Typography>
    </Box>
  )
}

export default ScoreCard