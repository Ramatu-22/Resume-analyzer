import { Box, Typography, Chip } from '@mui/material'
import { 
  CheckCircleOutline, 
  WarningAmber, 
  ErrorOutline,
  TipsAndUpdates,
  AutoAwesome
} from '@mui/icons-material'

function Suggestions({ suggestions }) {
  const getIcon = (type) => {
    switch(type) {
      case 'strength': return <CheckCircleOutline sx={{ fontSize: 28 }} />
      case 'warning': return <WarningAmber sx={{ fontSize: 28 }} />
      case 'critical': return <ErrorOutline sx={{ fontSize: 28 }} />
      default: return <TipsAndUpdates sx={{ fontSize: 28 }} />
    }
  }

  const getColor = (type) => {
    switch(type) {
      case 'strength': return 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-400'
      case 'warning': return 'bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-400'
      case 'critical': return 'bg-gradient-to-br from-red-50 to-pink-100 border-red-400'
      default: return 'bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-400'
    }
  }

  const getIconColor = (type) => {
    switch(type) {
      case 'strength': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-blue-600'
    }
  }

  const getChipColor = (type) => {
    switch(type) {
      case 'strength': return { backgroundColor: '#10b981', color: 'white' }
      case 'warning': return { backgroundColor: '#f59e0b', color: 'white' }
      case 'critical': return { backgroundColor: '#ef4444', color: 'white' }
      default: return { backgroundColor: '#3b82f6', color: 'white' }
    }
  }

  return (
    <Box>
      <Box className="flex items-center gap-2 mb-6">
        <AutoAwesome className="text-purple-600" sx={{ fontSize: 32 }} />
        <Typography variant="h5" className="font-bold text-gray-800">
          AI Recommendations
        </Typography>
      </Box>

      <Box className="space-y-5">
        {suggestions.map((suggestion, index) => (
          <Box
            key={index}
            className={`p-5 rounded-2xl border-2 ${getColor(suggestion.type)} shadow-lg transform transition-all hover:scale-[1.02] hover:shadow-xl`}
          >
            <Box className="flex items-start gap-4">
              <Box className={`mt-1 p-3 bg-white rounded-xl shadow-md ${getIconColor(suggestion.type)}`}>
                {getIcon(suggestion.type)}
              </Box>
              <Box className="flex-1">
                <Box className="flex items-center gap-3 mb-2">
                  <Typography variant="h6" className="font-bold text-gray-800">
                    {suggestion.title}
                  </Typography>
                  <Chip 
                    label={suggestion.type.toUpperCase()} 
                    size="small"
                    className="font-bold"
                    sx={{
                      ...getChipColor(suggestion.type),
                      fontWeight: 'bold',
                      fontSize: '0.7rem',
                    }}
                  />
                </Box>
                <Typography variant="body1" className="text-gray-700 leading-relaxed">
                  {suggestion.description}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default Suggestions