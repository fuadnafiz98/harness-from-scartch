# Harness from scartch

This is a simple agentic harness I am building from ground up to learn how agentic harness works.

## Introduction

Before starting building the harness, lets start with the simple API calls to models and see how it plays out.
I am using openrouter API as they have a large array of models and also there are many free models to try. I am using Typescript and OpenAI API for all the coding.

With the OpenAI Typescript SDK its quite simple to make the first request

<details>

<summary> Code </summary>

```typescript
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
```

</details>

Also the output is quite interesting and lots of things to check and look into


<details>

<summary> Response </summary>

```json
{
  id: "gen-1792519017-6JPC9NDRKkT1vDYS9pGb",
  object: "response",
  created_at: 1792519017,
  model: "minimax/minimax-m3.1-flash:free",
  status: "completed",
  completed_at: 1792519026,
  output: [
    {
      id: "rs_tmp_0fdrnxi9s36r",
      type: "reasoning",
      status: "completed",
      content: [
        [Object ...]
      ],
      summary: [],
      format: "unknown",
    }, {
      id: "msg_tmp_maq41vs0ldb",
      type: "message",
      role: "assistant",
      status: "completed",
      content: [
        [Object ...]
      ],
    }
  ],
  error: null,
  incomplete_details: null,
  tools: [],
  tool_choice: "auto",
  parallel_tool_calls: true,
  max_output_tokens: null,
  temperature: 1,
  top_p: 1,
  presence_penalty: 0,
  frequency_penalty: 0,
  top_logprobs: 0,
  max_tool_calls: null,
  metadata: {},
  background: false,
  previous_response_id: null,
  service_tier: "auto",
  truncation: "disabled",
  store: false,
  instructions: null,
  text: {
    format: {
      type: "text",
    },
  },
  reasoning: {
    effort: "max",
  },
  safety_identifier: null,
  prompt_cache_key: null,
  prompt_cache_options: null,
  usage: {
    input_tokens: 209,
    input_tokens_details: {
      cached_tokens: 195,
    },
    output_tokens: 547,
    output_tokens_details: {
      reasoning_tokens: 256,
    },
    total_tokens: 756,
    cost: 0,
    is_byok: false,
    cost_details: {
      upstream_inference_cost: 0,
      upstream_inference_input_cost: 0,
      upstream_inference_output_cost: 0,
    },
  },
  _request_id: null,
  output_text: "There is no single, universally proven meaning of life. Many people treat it as something **discovered**—through God, nature, duty, or truth—while others see it as something **created** through the choices and values they live by.\n\nA practical answer might be:\n\n> **Life becomes meaningful when you use your limited time to build something you care about, care for people, and live in a way that feels worth defending.**\n\nMeaning can come from many places:\n\n- **Love and belonging** — caring for and being cared for  \n- **Growth** — learning, creating, and becoming a better person  \n- **Service** — helping others or contributing to something larger  \n- **Values** — choosing principles such as honesty, justice, compassion, or courage  \n- **Experience** — noticing beauty, adventure, and the fragility of life  \n- **Responsibility** — accepting that, even without certainty, your choices still matter  \n\nExistentialist thought often puts it this way: the universe may not assign you a purpose, but you are free—and responsible—for making your own. That can feel liberating or frightening, and often both.\n\nIf you’re asking because life currently feels pointless, that may be less a need for a grand universal answer and more a sign that your life needs **connection, direction, contribution, or rest**. A useful starting point is: *What do I care about, and what small action would express that?*",
}

```

</details>