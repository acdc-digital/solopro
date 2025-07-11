# Build on Stripe with LLMs

Use LLMs in your Stripe integration workflow.

You can use large language models (LLMs) to assist in the building of Stripe integrations. We provide a set of tools and best practices if you use LLMs during development.

## Plain text docs 

You can access all of our documentation as plain text markdown files by adding `.md` to the end of any url. For example, you can find the plain text version of this page itself at [https://docs.stripe.com/building-with-llms.md](https://docs.stripe.com/building-with-llms.md).

This helps AI tools and agents consume our content and allows you to copy and paste the entire contents of a doc into an LLM. This format is preferable to scraping or copying from our HTML and JavaScript-rendered pages because:

* Plain text contains fewer formatting tokens.
* Content that isn't rendered in the default view (for example, it's hidden in a tab) of a given page is rendered in the plain text version.
* LLMs can parse and understand markdown hierarchy.

We also host an [/llms.txt file](https://docs.stripe.com/llms.txt.md) which instructs AI tools and agents how to retrieve the plain text versions of our pages. The `/llms.txt` file is an [emerging standard](https://llmstxt.org/) for making websites and content more accessible to LLMs.

## VS Code AI Assistant

If you're a Visual Studio Code user, you can install the [Stripe VS Code extension](https://docs.stripe.com/stripe-vscode.md) to access our AI Assistant.

With the Stripe AI Assistant, you can:

* Get immediate answers about the Stripe API and products
* Receive code suggestions tailored to your integration
* Ask follow-up questions for more detailed information
* Access knowledge from the Stripe documentation and the Stripe developer community

To get started with the Stripe AI assistant:

1. Make sure you have the Stripe VS Code extension installed.
1. Navigate to the Stripe extension UI
1. Under **AI Assistant** click **Ask a question**.
   - If you're a Copilot user, this opens the Copilot chat where you can @-mention `@stripe`. In the input field, talk to the Stripe-specific assistant using `@stripe` followed by your question.
   - If you're not a Copilot user, it opens a chat UI where you can talk to the Stripe LLM directly.

## Stripe Agent Toolkit SDK

If you're building agentic software, we provide an SDK for adding Stripe functionality to your agent's capabilities. For example, using the SDK you can:

* Create Stripe objects
* Charge for agent usage
* Use with popular frameworks such as OpenAI's Agent SDK, Vercel's AI SDK, Langchain, and CrewAI

Learn more in our [agents documentation](https://docs.stripe.com/agents.md).

## See Also

* [Stripe for Visual Studio Code](https://docs.stripe.com/stripe-vscode.md)
* [Add Stripe to your agentic workflows](https://docs.stripe.com/agents.md)
