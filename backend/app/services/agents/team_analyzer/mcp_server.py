"""
MCP Server for Team Analyzer Agent
"""
from mcp.server import Server
from mcp.server.stdio import stdio_server
from app.core.config import settings
import requests


async def get_gigachat_token() -> str:
    """Get GigaChat access token"""
    auth_url = settings.GIGACHAT_AUTH_URL
    api_key = settings.GIGACHAT_API_KEY
    
    if not api_key:
        raise ValueError("GIGACHAT_API_KEY not configured")
    
    response = requests.post(
        auth_url,
        data={"scope": "GIGACHAT_API_PERS"},
        headers={"Authorization": f"Bearer {api_key}"},
        verify=False
    )
    response.raise_for_status()
    return response.json()["access_token"]


async def call_gigachat(prompt: str, model: str = "GigaChat-Pro", temperature: float = 0.7, max_tokens: int = 2000) -> str:
    """Call GigaChat API"""
    token = await get_gigachat_token()
    
    url = "https://gigachat.devices.sberbank.ru/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    data = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": temperature,
        "max_tokens": max_tokens
    }
    
    response = requests.post(url, json=data, headers=headers, verify=False)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]


server = Server("team-analyzer-agent")


@server.call_tool()
async def analyze_team(arguments: dict) -> dict:
    """Analyze team using GigaChat"""
    prompt = arguments.get("prompt", "")
    model = arguments.get("model", "GigaChat-Pro")
    temperature = arguments.get("temperature", 0.7)
    max_tokens = arguments.get("max_tokens", 2000)
    
    try:
        response = await call_gigachat(prompt, model, temperature, max_tokens)
        return {"content": response}
    except Exception as e:
        return {"error": str(e)}


async def main():
    """Run MCP server"""
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            server.create_initialization_options()
        )


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())

