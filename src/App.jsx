import { useState } from 'react'
import { Container, Box, Typography, Paper } from '@mui/material'
import { Assessment, AutoAwesome } from '@mui/icons-material'
import FileUpload from './components/FileUpload'
import ResumeAnalysis from './components/ResumeAnalysis'

function App() {
  const [analysisResult, setAnalysisResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result)
    setLoading(false)
  }

  return (
    <Box className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 py-12 px-4">
      <Container maxWidth="lg">
        <Box className="text-center mb-12 animate-fade-in">
          <Box className="inline-block p-4 bg-white/20 backdrop-blur-lg rounded-full mb-4 shadow-lg">
            <Assessment className="text-white" sx={{ fontSize: 60 }} />
          </Box>
          <Typography variant="h2" className="font-bold text-white mb-3 drop-shadow-lg">
            AI Resume Analyzer
          </Typography>
          <Box className="flex items-center justify-center gap-2 mb-2">
            <AutoAwesome className="text-yellow-300" />
            <Typography variant="h6" className="text-white/90">
              Get instant AI-powered feedback tailored to your target role
            </Typography>
            <AutoAwesome className="text-yellow-300" />
          </Box>
        </Box>

        <Paper 
          elevation={24} 
          className="p-8 rounded-3xl backdrop-blur-xl bg-white/95 shadow-2xl transform transition-all hover:scale-[1.01]"
        >
          {!analysisResult ? (
            <FileUpload 
              onAnalysisComplete={handleAnalysisComplete}
              setLoading={setLoading}
              loading={loading}
            />
          ) : (
            <ResumeAnalysis 
              result={analysisResult}
              onReset={() => setAnalysisResult(null)}
            />
          )}
        </Paper>

        <Box className="text-center mt-8 p-4 bg-white/10 backdrop-blur-md rounded-2xl">
          <Typography variant="body2" className="text-white font-medium">
            🔒 Powered by AI • Your data is never stored • 100% Secure
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default App