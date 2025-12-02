export async function analyzeResume(file, jobRole = '') {
  const text = await readFileContent(file)
  const analysis = await analyzeWithAI(text, jobRole)
  return analysis
}

async function readFileContent(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (e) => reject(e)
    reader.readAsText(file)
  })
}

async function analyzeWithAI(resumeText, jobRole) {
  try {
    const jobRoleContext = jobRole 
      ? `The candidate is applying for the role: ${jobRole}. Tailor your analysis to evaluate how well the resume matches this specific position.` 
      : 'Provide a general resume analysis.'

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        messages: [
          {
            role: "user",
            content: `You are an expert resume reviewer and ATS specialist. ${jobRoleContext}

Resume Content:
${resumeText}

Provide your analysis in the following JSON format (respond with ONLY valid JSON, no markdown, no preamble):
{
  "overallScore": <number 0-100>,
  "scores": {
    "ats": <number 0-100>,
    "skills": <number 0-100>,
    "formatting": <number 0-100>,
    "content": <number 0-100>
  },
  "suggestions": [
    {
      "type": "strength" | "warning" | "critical" | "tip",
      "title": "Brief title",
      "description": "Detailed explanation"
    }
  ]
}

${jobRole ? `Focus on:
- How well the resume matches the ${jobRole} role requirements
- Relevant skills and experience for ${jobRole}
- Keywords that would help for ${jobRole} positions
- Gaps or missing qualifications for ${jobRole}` : ''}

Scoring criteria:
- ATS: Contact info present, simple formatting, keyword usage, readable by ATS systems
- Skills: Relevant skills listed, technical proficiency clear, industry-specific keywords${jobRole ? ` for ${jobRole}` : ''}
- Formatting: Clean structure, bullet points, appropriate length, easy to scan
- Content: Strong action verbs, quantified achievements, clear job progression, no gaps

Provide 6-10 specific, actionable suggestions. Include both strengths and areas for improvement.`
          }
        ],
      })
    })

    const data = await response.json()
    const textContent = data.content
      .filter(item => item.type === "text")
      .map(item => item.text)
      .join("")
    
    const analysisResult = JSON.parse(textContent.trim())
    return analysisResult
    
  } catch (error) {
    console.error("AI Analysis Error:", error)
    return performMockAnalysis(resumeText, jobRole)
  }
}

function performMockAnalysis(text, jobRole) {
  const wordCount = text.split(/\s+/).length
  const hasEmail = /@/.test(text)
  const hasPhone = /\d{3}[-.]?\d{3}[-.]?\d{4}/.test(text)
  const hasExperience = /experience|work|job|position/i.test(text)
  const hasEducation = /education|degree|university|college/i.test(text)
  const hasSkills = /skills|technologies|proficient/i.test(text)
  
  const atsScore = calculateATSScore(text, hasEmail, hasPhone)
  const skillsScore = calculateSkillsScore(text, hasSkills, jobRole)
  const formattingScore = calculateFormattingScore(wordCount, text)
  const contentScore = calculateContentScore(hasExperience, hasEducation)
  
  const overallScore = Math.round((atsScore + skillsScore + formattingScore + contentScore) / 4)
  
  const suggestions = generateSuggestions({
    hasEmail,
    hasPhone,
    hasExperience,
    hasEducation,
    hasSkills,
    wordCount,
    jobRole
  })
  
  return {
    overallScore,
    scores: {
      ats: atsScore,
      skills: skillsScore,
      formatting: formattingScore,
      content: contentScore
    },
    suggestions
  }
}

function calculateATSScore(text, hasEmail, hasPhone) {
  let score = 50
  if (hasEmail) score += 15
  if (hasPhone) score += 15
  if (text.length > 500) score += 10
  if (!/[^\x00-\x7F]/.test(text)) score += 10
  return Math.min(score, 100)
}

function calculateSkillsScore(text, hasSkills, jobRole) {
  let score = 40
  if (hasSkills) score += 30
  
  const techSkills = ['javascript', 'react', 'python', 'sql', 'css', 'html', 'git', 'typescript', 'node', 'tailwind']
  const foundSkills = techSkills.filter(skill => text.toLowerCase().includes(skill))
  score += foundSkills.length * 3
  
  if (jobRole && text.toLowerCase().includes(jobRole.toLowerCase())) {
    score += 10
  }
  
  return Math.min(score, 100)
}

function calculateFormattingScore(wordCount, text) {
  let score = 50
  if (wordCount > 200 && wordCount < 800) score += 30
  if (text.includes('\n')) score += 10
  if (/•|●|○|-/.test(text)) score += 10
  return Math.min(score, 100)
}

function calculateContentScore(hasExperience, hasEducation) {
  let score = 40
  if (hasExperience) score += 30
  if (hasEducation) score += 30
  return Math.min(score, 100)
}

function generateSuggestions(data) {
  const suggestions = []
  
  if (data.hasEmail && data.hasPhone) {
    suggestions.push({
      type: 'strength',
      title: 'Contact Information Present',
      description: 'Your resume includes email and phone number for easy recruiter contact.'
    })
  }
  
  if (!data.hasEmail || !data.hasPhone) {
    suggestions.push({
      type: 'critical',
      title: 'Missing Contact Information',
      description: 'Add both email and phone number at the top of your resume.'
    })
  }
  
  if (data.wordCount < 300) {
    suggestions.push({
      type: 'warning',
      title: 'Resume Too Short',
      description: 'Expand your resume to 400-600 words with more detail about achievements.'
    })
  }
  
  if (!data.hasSkills) {
    suggestions.push({
      type: 'critical',
      title: 'Add Skills Section',
      description: 'Create a dedicated skills section with relevant technical and soft skills.'
    })
  }
  
  if (data.jobRole) {
    suggestions.push({
      type: 'tip',
      title: `Tailor for ${data.jobRole}`,
      description: `Make sure to highlight skills and experience directly relevant to ${data.jobRole} positions.`
    })
  }
  
  suggestions.push({
    type: 'tip',
    title: 'Quantify Achievements',
    description: 'Add numbers to your accomplishments (e.g., "Increased efficiency by 40%").'
  })
  
  return suggestions
}