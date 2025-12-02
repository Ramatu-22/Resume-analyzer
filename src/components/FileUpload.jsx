import { useState } from 'react'
import { Box, Button, Typography, CircularProgress, TextField } from '@mui/material'
import { CloudUpload, Description, WorkOutline, AutoAwesome } from '@mui/icons-material'
import { analyzeResume } from '../utils/analyzeResume'

function FileUpload({ onAnalysisComplete, setLoading, loading }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [jobRole, setJobRole] = useState('')

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF, DOCX, or TXT file')
      return
    }
    setSelectedFile(file)
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return
    
    setLoading(true)
    try {
      const result = await analyzeResume(selectedFile, jobRole)
      onAnalysisComplete(result)
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('Analysis failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <Box>
      <Box className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200">
        <Typography variant="h6" className="mb-3 font-bold flex items-center gap-2 text-purple-700">
          <WorkOutline className="text-blue-600" /> Target Job Role
        </Typography>
        <TextField
          fullWidth
          placeholder="e.g., Frontend Developer, Software Engineer, UI/UX Designer"
          variant="outlined"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
          helperText="✨ Specify the role you're applying for to get tailored feedback"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              '&:hover fieldset': {
                borderColor: '#9333ea',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#7c3aed',
              },
            },
          }}
        />
      </Box>

      <Box
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          dragActive 
            ? 'border-purple-600 bg-gradient-to-br from-purple-100 to-pink-100 scale-105 shadow-xl' 
            : 'border-gray-300 bg-gradient-to-br from-gray-50 to-blue-50 hover:border-purple-400 hover:shadow-lg'
        }`}
      >
        <input
          type="file"
          id="file-upload"
          accept=".pdf,.docx,.txt"
          onChange={handleChange}
          className="hidden"
        />
        
        <label htmlFor="file-upload" className="cursor-pointer">
          <Box className="relative inline-block">
            <CloudUpload 
              sx={{ 
                fontSize: 80, 
                color: dragActive ? '#9333ea' : '#6b7280',
                transition: 'all 0.3s'
              }} 
            />
            {dragActive && (
              <AutoAwesome 
                className="absolute top-0 right-0 text-yellow-400 animate-pulse" 
                sx={{ fontSize: 30 }}
              />
            )}
          </Box>
          <Typography variant="h5" className="mb-2 font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {selectedFile ? selectedFile.name : 'Drop your resume here or click to browse'}
          </Typography>
          <Typography variant="body1" className="text-gray-600 font-medium">
            📄 Supports PDF, DOCX, and TXT files
          </Typography>
        </label>
      </Box>

      {selectedFile && (
        <Box className="mt-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-300 flex items-center justify-between shadow-lg transform transition-all hover:scale-[1.02]">
          <Box className="flex items-center gap-4">
            <Box className="p-3 bg-white rounded-xl shadow-md">
              <Description className="text-green-600" sx={{ fontSize: 32 }} />
            </Box>
            <Box>
              <Typography variant="body1" className="font-bold text-gray-800">
                {selectedFile.name}
              </Typography>
              <Typography variant="caption" className="text-gray-600 font-medium">
                📦 {(selectedFile.size / 1024).toFixed(2)} KB
                {jobRole && ` • 🎯 Analyzing for: ${jobRole}`}
              </Typography>
            </Box>
          </Box>
          
          <Button
            variant="contained"
            onClick={handleAnalyze}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} className="text-white" /> : <AutoAwesome />}
            className="font-bold px-6 py-3 text-lg"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s',
              boxShadow: '0 8px 16px rgba(102, 126, 234, 0.4)',
            }}
          >
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default FileUpload