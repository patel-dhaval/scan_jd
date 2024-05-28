from fastapi import FastAPI, HTTPException, Request
import cohere
import aiohttp
import json
import uvicorn
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
import os


API_KEY = os.getenv('API_KEY')
MODEL = os.getenv('MODEL')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],  
)

g_prompt = """
        Analyze the given job description and respond only in JSON format, nothing else.
        Format:
        response = {
            sponsorship:Sponsorship Available/Sponsrship not mentioned(in case where there is nothing mentioned, you should say "Sponsorship not mentioned", dont assume that they will not provide sponsorship in case where they have not mentioned about it or visa requirements)/Will not sponsor(only if it is explicitly mentioned that they will not sponsor, require citizens or require clearance),
            experience: 0/1/2/3/4/5/6/7/8/9/10+. You are supposed to return only the integer value nothing else,if nothing is mentioned about required number of work experience then return NA only
            technical_skills: [array of top 0-10 technical skills only in the domain of computer science], prefer to keep the programming languages on the top then the skills and tools,
            security_clearance: Clearance required/No Security Clearance (return No Security Clearance even if they havent mentioned anything)
        }.
        Your response has to be a JSON str only!. The job description is as follows:
    """

async def fetch_gpt_response(jd: str):
    global g_prompt
    prompt = g_prompt + jd
    data = {
        "model": "gpt-4o",
        "messages": [{"role": "user", "content": prompt}]
    }
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    async with aiohttp.ClientSession() as session:
        async with session.post('https://api.openai.com/v1/chat/completions', json=data, headers=headers) as resp:
            if resp.status != 200:
                raise HTTPException(status_code=500, detail="Error communicating with GPT-4 API")
            result = await resp.json()
            gpt_choice = result.get("choices", [])[0].get("message", {}).get("content")
            gpt_choice = gpt_choice[7:-4]
            # response_data = gpt_choice
            response_data = json.loads(gpt_choice)
            print(response_data)
            print(type(response_data))
            return response_data

async def fetch_cohere_response(jd: str):
    co = cohere.Client(API_KEY)
    global g_prompt
    co = cohere.Client(API_KEY)
    prompt = g_prompt + jd
    response = co.chat(
        message=prompt,
        documents=[{ "title": "", "text": ""}],  
        max_tokens=4000,  
    )
    for chat_message in response.chat_history:
        if chat_message.role == 'CHATBOT':
            response = chat_message.message[8:-4]
            response = json.loads(response)
            return(response)

@app.post('/analyze')
async def analyze_job_description(request: Request):
    start_time = datetime.now()
    data = await request.json()
    jd = data.get("jd")
    print("using: ", MODEL)
    response = None
    if MODEL == "openai":
        response = await fetch_gpt_response(jd)
    else:
        response = await fetch_cohere_response(jd)
    end_time = datetime.now()
    time_diff = end_time - start_time
    print("time: ", time_diff)
    print(response)
    return response


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8004)
