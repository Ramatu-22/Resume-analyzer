import { Box, Button, Typography, Divider } from '@mui/material'
import { Refresh, EmojiEvents, TrendingUp } from '@mui/icons-material'
import ScoreCard from './ScoreCard'
import Suggestions from './Suggestions'

function ResumeAnalysis({ result, onReset }) {
  return (
    <Box>
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Analysis Results
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={onReset}
          sx={{
            borderColor: '#9333ea',
            color: '#9333ea',
            fontWeight: 'bold',
            '&:hover': {
              borderColor: '#7c3aed',
              backgroundColor: '#f3e8ff',
            },
          }}
        >
          Analyze Another
        </Button>
      </Box>

      <Box className="mb-8 p-8 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 rounded-3xl text-white text-center shadow-2xl transform transition-all hover:scale-[1.02]">
        <EmojiEvents sx={{ fontSize: 60, mb: 2 }} className="drop-shadow-lg" />
        <Typography variant="h6" className="mb-2 opacity-90 font-semibold">
          Overall Score
        </Typography>
        <Typography variant="h1" className="font-black drop-shadow-xl">
          {result.overallScore}  /100
        </Typography>
        <Typography variant="caption" className="text-2xl">
        
        </Typography>
        <Box className="mt-4 p-3 bg-white/20 backdrop-blur-md rounded-2xl inline-block">
          <Typography variant="h6" className="font-bold">
            {result.overallScore >= 80 ? '🎉 Excellent! Outstanding Resume!' : 
             result.overallScore >= 60 ? '👍 Good! Room for Improvement' : 
             '💡 Needs Work! Let\'s Improve It'}
          </Typography>
        </Box>
      </Box>

      <Divider className="mb-8" sx={{ borderWidth: 2, borderColor: '#e5e7eb' }} />

      <Box className="flex items-center gap-2 mb-6">
        <TrendingUp className="text-blue-600" sx={{ fontSize: 32 }} />
        <Typography variant="h5" className="font-bold text-gray-800">
          Score Breakdown
        </Typography>
      </Box>
      <Box className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ScoreCard
          title="ATS Compatibility"
          score={result.scores.ats}
          description="How well your resume passes Applicant Tracking Systems"
          color="blue"
        />
        <ScoreCard
          title="Skills Match"
          score={result.scores.skills}
          description="Relevance and clarity of listed skills"
          color="green"
        />
        <ScoreCard
          title="Formatting"
          score={result.scores.formatting}
          description="Structure, readability, and visual appeal"
          color="purple"
        />
        <ScoreCard
          title="Content Quality"
          score={result.scores.content}
          description="Impact, clarity, and professionalism"
          color="orange"
        />
      </Box>

      <Divider className="mb-8" sx={{ borderWidth: 2, borderColor: '#e5e7eb' }} />

      <Suggestions suggestions={result.suggestions} />
    </Box>
  )
}

export default ResumeAnalysis