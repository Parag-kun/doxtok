import { eq } from "drizzle-orm";
import { Chats } from "../drizzle/schema";
import sqlite from "./sqlite";

export const getChatsBySessionId = (sessionId: string) => {
  return sqlite
    .select()
    .from(Chats)
    .where(eq(Chats.sessionId, sessionId))
    .all();
};

export const getResponseFromRAG = (question: string, sessionId: string) => {

}

// // Conceptual example structure (using LangChain.js/Python concepts)
// import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";

// // 1. Define the components
// const retriever = vectorstore.asRetriever(); // A Runnable<string, Document[]>
// const prompt = ChatPromptTemplate.fromTemplate(...); // A Runnable<Map, PromptValue>
// const model = new ChatModel(); // A Runnable<PromptValue, BaseMessage>

// // 2. Define the document formatting function
// const formatDocs = (docs) => docs.map(doc => doc.pageContent).join("\n\n");

// // 3. Create the RAG chain using .pipe() and .assign()
// const ragChain = RunnablePassthrough.assign({
//     // 'context' key is populated first:
//     // It runs the original input through the retriever, then formats the output
//     context: RunnableSequence.from([
//         (input) => input.question, // Extract the question from the input map
//         retriever,
//         formatDocs
//     ]),
//     // The 'question' key is populated by passing through the original 'question' input
//     question: new RunnablePassthrough() // Pass the original input key through
// }).pipe(prompt) // Pipe the structured map to the prompt template
//   .pipe(model) // Pipe the formatted prompt to the LLM
//   .pipe(new StringOutputParser()); // Pipe the LLM output to a parser

// // Invocation
// // await ragChain.invoke({ question: "Your question here" });
