import {
  ASCIIFontRenderable,
  BoxRenderable,
  MarkdownRenderable,
  RGBA,
  ScrollBoxRenderable,
  SyntaxStyle,
  TextAttributes,
  TextRenderable,
  TextareaRenderable,
  createCliRenderer,
} from "@opentui/core"

export interface Thinker {
  set(text: string): void
}

export interface Answer {
  set(text: string): void
  done(): void
}

export interface Screen {
  onSubmit(handler: (value: string) => void): void
  addUser(prompt: string): void
  addThinker(): Thinker
  addAnswer(): Answer
  addGap(): void
  clearInput(): void
}

export const createScreen = async (title = "KI.Bot"): Promise<Screen> => {
  const renderer = await createCliRenderer({
    targetFps: 120,
    exitOnCtrlC: true,
    backgroundColor: "#000000",
  })

  const feed = new ScrollBoxRenderable(renderer, {
    flexGrow: 1,
    minHeight: 0,
    stickyScroll: true,
    stickyStart: "bottom",
  })
  feed.verticalScrollBar.visible = false

  let submitHandler: (value: string) => void = () => {}

  const input = new TextareaRenderable(renderer, {
    flexGrow: 1,
    minHeight: 1,
    maxHeight: 8,
    wrapMode: "word",
    placeholder: "Type a message and press Enter…",
    cursorColor: "#FFFFFF",
    keyBindings: [
      { name: "return", action: "submit" },
      { name: "return", shift: true, action: "newline" },
      { name: "return", meta: true, action: "newline" },
    ],
    onSubmit: () => submitHandler(input.plainText),
  })

  const inputRow = new BoxRenderable(renderer, {
    width: "100%",
    flexDirection: "row",
    flexShrink: 0,
    backgroundColor: "#111111",
    paddingX: 2,
    paddingY: 1,
    gap: 1,
  })
  inputRow.add(input)

  const root = new BoxRenderable(renderer, {
    flexDirection: "column",
    flexGrow: 1,
    width: "100%",
    gap: 1,
    paddingX: 2,
    paddingBottom: 1,
  })
  root.add(feed)
  root.add(inputRow)
  renderer.root.add(root)
  input.focus()

  const style = SyntaxStyle.fromStyles(
    {
      default: {},
      "markup.heading": { fg: "#FFFFFF", bold: true },
      "markup.strong": { bold: true },
      "markup.italic": { italic: true },
      "markup.raw": { fg: "#0000EE" },
      "markup.link": { fg: "#0000EE" },
      "markup.link.label": { fg: "#0000EE", underline: true },
      "markup.link.url": { fg: "#0000EE" },
      "markup.list": { fg: "#0000EE" },
      "markup.quote": { fg: "#FFFFFF", italic: true },
    },
    renderer.nativeScene,
  )

  const addGap = () => feed.add(new BoxRenderable(renderer, { height: 1 }))

  const titleBox = new BoxRenderable(renderer, { paddingY: 1 })
  titleBox.add(
    new ASCIIFontRenderable(renderer, {
      text: title,
      font: "tiny",
      color: RGBA.fromInts(255, 255, 255, 255),
    }),
  )
  feed.add(titleBox)
  addGap()

  let hasMessages = false

  return {
    onSubmit(handler) {
      submitHandler = handler
    },

    addUser(prompt) {
      if (hasMessages) addGap()
      hasMessages = true
      const bubble = new BoxRenderable(renderer, {
        backgroundColor: "#111111",
        paddingX: 2,
        paddingY: 1,
        width: "100%",
      })
      bubble.add(new TextRenderable(renderer, { content: prompt, fg: "#FFFFFF", width: "100%" }))
      feed.add(bubble)
    },

    addThinker() {
      const text = new TextRenderable(renderer, {
        width: "100%",
        content: "",
        fg: "#555555",
        attributes: TextAttributes.ITALIC,
      })
      feed.add(text)
      return {
        set(value) {
          text.content = value
        },
      }
    },

    addAnswer() {
      const md = new MarkdownRenderable(renderer, {
        width: "100%",
        content: "",
        syntaxStyle: style,
        streaming: true,
        conceal: false,
        concealCode: false,
      })
      feed.add(md)
      return {
        set(value) {
          md.content = value
        },
        done() {
          md.streaming = false
        },
      }
    },

    addGap,

    clearInput() {
      input.setText("")
    },
  }
}
