import { OpenAI } from "openai"

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY
})

const completion = await client.responses.create({
  model: "minimax/minimax-m3.1-flash:free",
  input: "what is the meaning of life?"
})

console.log(completion)
