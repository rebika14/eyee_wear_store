
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, ...payload } = await req.json()
    
    const KHALTI_SECRET_KEY = Deno.env.get('KHALTI_SECRET_KEY')
    if (!KHALTI_SECRET_KEY) {
      throw new Error('Khalti secret key not configured')
    }

    let url = ''
    let headers = {
      'Authorization': `Key ${KHALTI_SECRET_KEY}`,
      'Content-Type': 'application/json',
    }

    if (action === 'initiate') {
      url = 'https://a.khalti.com/api/v2/epayment/initiate/'
    } else if (action === 'verify') {
      url = 'https://a.khalti.com/api/v2/epayment/lookup/'
    }

    console.log('Making Khalti API request:', { action, url, payload })

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    })

    const data = await response.json()
    console.log('Khalti API response:', { status: response.status, data })

    if (!response.ok) {
      throw new Error(`Khalti API error: ${response.status} - ${JSON.stringify(data)}`)
    }

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Khalti payment error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Payment processing failed',
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
