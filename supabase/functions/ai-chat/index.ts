
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, history } = await req.json()

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get Groq API key from Supabase secrets
    const groqApiKey = "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"

    if (!groqApiKey) {
      throw new Error('Groq API key not configured')
    }

    // Prepare conversation context
    const systemPrompt = `You are an AI assistant for Euro Visa Support, a study abroad consultancy. You help students with:
- Information about study programs and universities
- Visa and immigration guidance
- Application processes and requirements
- Scholarship opportunities
- Living costs and accommodation
- Language requirements and preparation
- Cultural adaptation tips

Always be helpful, professional, and encouraging. If you don't know something specific, recommend contacting our human advisors.`

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.slice(-10).map((msg: any) => ({
        role: msg.sender.type === 'client' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: "user", content: message }
    ]

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        stream: false
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Groq API error:', errorData)
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content || "I'm sorry, I couldn't process your request at the moment."

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in ai-chat function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        response: "I'm sorry, I'm having trouble connecting right now. Please try again later or contact our support team for assistance."
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
