import { OpenAI } from "openai"
import { singleFlight } from "./lib/single-flight"
import { createScreen, type Answer, type Thinker } from "./opentui/screen"

const MODEL = "minimax/minimax-m3.1-flash:free"

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "missing-key",
})

const screen = await createScreen()

const errText = (err: unknown): string =>
  err instanceof Error ? err.message :
    typeof err === "string" ? err :
      JSON.stringify(err)

const chat = async (prompt: string) => {
  screen.addUser(prompt)
  let thinker: Thinker | null = null
  let answer: Answer | null = null
  let thinking = ""
  let reply = ""
  try {
    const stream = await client.responses.create({
      model: MODEL,
      input: prompt,
      stream: true,
    })
    for await (const event of stream) {
      if (event.type === "response.reasoning_text.delta") {
        if (!thinker) {
          screen.addGap()
          thinker = screen.addThinker()
        }
        thinking += event.delta
        thinker.set(thinking)
      } else if (event.type === "response.reasoning_text.done") {
        if (thinker) screen.addGap()
      } else if (event.type === "response.output_text.delta") {
        if (!answer) {
          if (!thinker) screen.addGap()
          answer = screen.addAnswer()
        }
        reply += event.delta
        answer.set(reply)
      }
    }
    answer?.done()
  } catch (err) {
    if (!answer) {
      screen.addGap()
      answer = screen.addAnswer()
    }
    reply += `\n> error: ${errText(err)}\n`
    answer.set(reply)
    answer.done()
  }
}

screen.onSubmit(
  singleFlight(async (value) => {
    screen.clearInput()
    await chat(value)
  }),
)
