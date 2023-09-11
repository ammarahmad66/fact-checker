"use client"

import { PromptTemplate } from "langchain/prompts";
import {useState} from 'react'
import { OpenAI } from "langchain/llms/openai";
import axios from 'axios'


// If a template is passed in, the input variables are inferred automatically from the template.

export default function LangChain () {
    const [query, setQuery] = useState("")
    const [result, setResult] = useState("")
    const [loading, setLoading] = useState()
const prompt = PromptTemplate.fromTemplate(
  `You work as a fact authenticatior and you use {info} (which is in JSON format) as your souce of information. I will provide the {info} (which is in JSON format), you will train on the {info} and then verify the {question} according to it. Another helpful information is that it's 2023, so do your mathematical calculation according to 2023 and be as much accurate as possible. Do not add according to the data or sentence similar to it in your response.
  is the {question} true or false according to {info}. Also provide the link you used to verify from {info} (which is in JSON format). `
);

const factAuthenticator = async () => {
    setResult("");
    setLoading(true);
    const response = await axios.get(`http://localhost:4000/api/${query}`);
    let data = response.data  
    console.log(data)
    data = JSON.stringify(data);
    const formattedPrompt = await prompt.format({
        info: data,
        question: query,
    });

    const llm = new OpenAI({
        openAIApiKey: process.env.NEXT_PUBLIC_OPEN_AI_API_KEY,
        modelName: 'gpt-4',
        temperature: 0.5,
        streaming:true
    });

    const res = await llm.call(formattedPrompt, {
        callbacks: [
    {
      handleLLMNewToken(token) {
        //  if(loading){
            setLoading(false)
        // }
        setResult((result) => result + token);
       
      },
    },
    
  ],
    })
    
}


return (
    <div className= "flex flex-col">
        <div className = "flex justify-center mt-5">
        <h1 className="text-[20px] text-black-700">Fact Authenticator</h1>
        </div>
        <div className= "px-[100px] mt-7 gap-2">
            <input placeholder="Enter your Fact" className="p-2 w-[400px] h-[40px] rounded-md border border-1" onChange={(e) => setQuery(e.target.value)}>
            </input>
            <button className="ml-3 w-[100px] h-[40px] rounded-md border border-1 bg-blue-500 text-white" onClick={() => factAuthenticator()}>
                Verify
            </button>
        </div>
        {result.length > 0 ? (
        <div className="mt-[20px] px-[100px]">
            <p>{result}</p>
        </div>) : null
        }
        { loading ? (
                <div className="flex justify-center items-center mt-[20px] px-[100px]">
                    Verifying Data....</div>
            ): null}
    </div>
)
}