from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models import AgentConfig
import yaml
import os
import logging
import urllib3

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


class MCPAgent(ABC):
    """Base class for MCP agents"""
    
    def __init__(self, db: Session, agent_name: str):
        self.db = db
        self.agent_name = agent_name
        self.config = self._load_config()
    
    def _load_config(self) -> Dict[str, Any]:
        """Load agent configuration from DB or YAML"""
        # Try to load from DB first
        db_config = self.db.query(AgentConfig).filter(
            AgentConfig.agent_name == self.agent_name
        ).first()
        
        if db_config and db_config.is_active:
            return {
                "model": db_config.model,
                "system_prompt": db_config.system_prompt,
                "prompts": db_config.prompts,
                "temperature": db_config.temperature,
                "max_tokens": db_config.max_tokens,
                "mcp_server_config": db_config.mcp_server_config or {}
            }
        
        # Fallback to YAML
        config_path = os.path.join(
            "app", "services", "agents", self.agent_name, "config.yaml"
        )
        
        if os.path.exists(config_path):
            with open(config_path, 'r', encoding='utf-8') as f:
                return yaml.safe_load(f)
        
        # Default config
        return {
            "model": "GigaChat-Pro",
            "system_prompt": "You are an AI assistant analyzing startup pitches.",
            "prompts": {},
            "temperature": 0.7,
            "max_tokens": 2000,
            "mcp_server_config": {}
        }
    
    @abstractmethod
    def analyze(self, text: str) -> Dict[str, Any]:
        """
        Analyze text and return results
        
        Args:
            text: Text to analyze
            
        Returns:
            Dictionary with analysis results including 'score' key
        """
        pass
    
    def _call_mcp(self, prompt: str) -> str:
        """
        Call MCP server for this agent (or directly GigaChat API)
        
        Args:
            prompt: Prompt to send to MCP server
            
        Returns:
            Response from MCP server
        """
        # For now, call GigaChat API directly
        # In production, this would call the agent's MCP server
        try:
            import requests
            from app.core.config import settings
            
            logger.info(f"[{self.agent_name}] Starting GigaChat API call")
            logger.info(f"[{self.agent_name}] System prompt: {self.config.get('system_prompt', '')[:100]}...")
            logger.info(f"[{self.agent_name}] User prompt length: {len(prompt)} chars")
            
            # Get token
            auth_url = settings.GIGACHAT_AUTH_URL
            api_key = settings.GIGACHAT_API_KEY
            
            if not api_key:
                logger.error(f"[{self.agent_name}] GIGACHAT_API_KEY not configured")
                raise ValueError("GIGACHAT_API_KEY not configured")
            
            logger.info(f"[{self.agent_name}] Requesting access token from {auth_url}")
            logger.info(f"[{self.agent_name}] API Key length: {len(api_key) if api_key else 0} chars")
            logger.info(f"[{self.agent_name}] API Key preview: {api_key[:30]}..." if api_key and len(api_key) > 30 else (api_key if api_key else "API Key is None"))
            
            # Try to decode base64 to see what's inside (for debugging)
            try:
                import base64
                # Try to decode with padding
                for padding in ['', '=', '==', '===']:
                    try:
                        decoded = base64.b64decode(api_key + padding)
                        decoded_str = decoded.decode('utf-8', errors='ignore')
                        logger.info(f"[{self.agent_name}] API Key decoded (first 100 chars): {decoded_str[:100]}")
                        # Check if it contains colon (ClientID:ClientSecret format)
                        if ':' in decoded_str:
                            parts = decoded_str.split(':', 1)
                            logger.info(f"[{self.agent_name}] API Key appears to be base64(ClientID:ClientSecret)")
                            logger.info(f"[{self.agent_name}] ClientID preview: {parts[0][:20]}..., ClientSecret preview: {parts[1][:20] if len(parts) > 1 else 'N/A'}...")
                        break
                    except:
                        continue
            except Exception as e:
                logger.warning(f"[{self.agent_name}] Could not decode API key as base64: {str(e)}")
            
            # Check if API key is already an access token (R-M-... format)
            # If it starts with R-M-, we can use it directly without getting a new token
            token = None
            if api_key and (api_key.startswith("R-M-") or api_key.startswith("R-")):
                logger.info(f"[{self.agent_name}] API key appears to be an access token (R-M- format), using directly")
                token = api_key
            else:
                # Request token - GigaChat API format
                # According to GigaChat docs, the request should be:
                # POST with Authorization: Basic {base64_encoded_credentials} header
                # where credentials = ClientID:ClientSecret encoded in base64
                # and scope in the body as form-urlencoded data
                token_response = None
                
                try:
                    import base64
                    logger.info(f"[{self.agent_name}] Trying format 1: Basic auth with form-urlencoded")
                    
                    # API key should be base64(ClientID:ClientSecret)
                    # Use it directly with "Basic " prefix
                    auth_header = f"Basic {api_key}" if not api_key.startswith("Basic ") else api_key
                    logger.info(f"[{self.agent_name}] Authorization header: {auth_header[:50]}...")
                    
                    # Use dictionary for form data - requests will encode it properly
                    # GigaChat API requires RqUID header (unique request ID in UUID4 format)
                    import uuid
                    rquid = str(uuid.uuid4())
                    logger.info(f"[{self.agent_name}] Generated RqUID: {rquid}")
                    
                    token_response = requests.post(
                        auth_url,
                        data={"scope": "GIGACHAT_API_PERS"},
                        headers={
                            "Authorization": auth_header,
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Accept": "application/json",
                            "RqUID": rquid
                        },
                        verify=False,
                        timeout=10
                    )
                    logger.info(f"[{self.agent_name}] Format 1 response status: {token_response.status_code}")
                    logger.info(f"[{self.agent_name}] Format 1 response headers: {dict(token_response.headers)}")
                    logger.info(f"[{self.agent_name}] Format 1 response body (full): {token_response.text}")
                    
                    if token_response.status_code == 200:
                        try:
                            response_json = token_response.json()
                            token = response_json.get("access_token")
                            if token:
                                logger.info(f"[{self.agent_name}] Access token received (format 1). Token length: {len(token)} chars")
                        except Exception as e:
                            logger.error(f"[{self.agent_name}] Failed to parse JSON response: {str(e)}")
                            logger.error(f"[{self.agent_name}] Response text: {token_response.text}")
                    elif token_response.status_code == 400:
                        # Try alternative: without explicit Content-Type but with RqUID
                        logger.info(f"[{self.agent_name}] Got 400, trying without explicit Content-Type")
                        import uuid
                        rquid = str(uuid.uuid4())
                        token_response = requests.post(
                            auth_url,
                            data={"scope": "GIGACHAT_API_PERS"},
                            headers={
                                "Authorization": auth_header,
                                "Accept": "application/json",
                                "RqUID": rquid
                            },
                            verify=False,
                            timeout=10
                        )
                        logger.info(f"[{self.agent_name}] Alternative response status: {token_response.status_code}")
                        logger.info(f"[{self.agent_name}] Alternative response body: {token_response.text}")
                        if token_response.status_code == 200:
                            try:
                                response_json = token_response.json()
                                token = response_json.get("access_token")
                                if token:
                                    logger.info(f"[{self.agent_name}] Access token received (alternative). Token length: {len(token)} chars")
                            except Exception as e:
                                logger.error(f"[{self.agent_name}] Failed to parse JSON response: {str(e)}")
                except Exception as e:
                    logger.warning(f"[{self.agent_name}] Format 1 failed: {str(e)}", exc_info=True)
                
                # Try format 2: Bearer token (in case API key is actually a token)
                if not token:
                    try:
                        logger.info(f"[{self.agent_name}] Trying format 2: Bearer token")
                        token_response = requests.post(
                            auth_url,
                            data={"scope": "GIGACHAT_API_PERS"},
                            headers={
                                "Authorization": f"Bearer {api_key}",
                                "Content-Type": "application/x-www-form-urlencoded",
                                "Accept": "application/json"
                            },
                            verify=False,
                            timeout=10
                        )
                        logger.info(f"[{self.agent_name}] Format 2 response status: {token_response.status_code}")
                        logger.info(f"[{self.agent_name}] Format 2 response body (full): {token_response.text}")
                        
                        if token_response.status_code == 200:
                            try:
                                response_json = token_response.json()
                                token = response_json.get("access_token")
                                if token:
                                    logger.info(f"[{self.agent_name}] Access token received (format 2). Token length: {len(token)} chars")
                            except Exception as e:
                                logger.error(f"[{self.agent_name}] Failed to parse JSON response: {str(e)}")
                    except Exception as e:
                        logger.warning(f"[{self.agent_name}] Format 2 failed: {str(e)}")
                
                if not token:
                    # Last resort: try using API key directly as access token
                    logger.warning(f"[{self.agent_name}] Failed to get access token via OAuth. Trying to use API key directly as token...")
                    logger.warning(f"[{self.agent_name}] Last response: {token_response.status_code if token_response else 'N/A'} - {token_response.text[:500] if token_response and token_response.text else 'No response body'}")
                    if token_response:
                        logger.warning(f"[{self.agent_name}] Response headers: {dict(token_response.headers)}")
                    # Use API key as token (might work if it's already a valid token)
                    token = api_key
                    logger.info(f"[{self.agent_name}] Using API key directly as access token (fallback mode)")
            
            # Call GigaChat
            url = "https://gigachat.devices.sberbank.ru/api/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
            data = {
                "model": self.config.get("model", "GigaChat-Pro"),
                "messages": [
                    {"role": "system", "content": self.config.get("system_prompt", "")},
                    {"role": "user", "content": prompt}
                ],
                "temperature": self.config.get("temperature", 0.7),
                "max_tokens": self.config.get("max_tokens", 2000)
            }
            
            logger.info(f"[{self.agent_name}] Calling GigaChat API: {url}")
            logger.info(f"[{self.agent_name}] Model: {data['model']}, Temperature: {data['temperature']}, Max tokens: {data['max_tokens']}")
            logger.info(f"[{self.agent_name}] Request payload: {str(data)[:500]}...")
            
            response = requests.post(url, json=data, headers=headers, verify=False, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            content = result["choices"][0]["message"]["content"]
            
            logger.info(f"[{self.agent_name}] GigaChat API response received")
            logger.info(f"[{self.agent_name}] Response length: {len(content)} chars")
            logger.info(f"[{self.agent_name}] Response preview: {content[:200]}...")
            logger.info(f"[{self.agent_name}] Full response: {content}")
            
            return content
        except requests.exceptions.RequestException as e:
            logger.error(f"[{self.agent_name}] GigaChat API request error: {str(e)}")
            if hasattr(e, 'response') and e.response is not None:
                logger.error(f"[{self.agent_name}] Response status: {e.response.status_code}")
                logger.error(f"[{self.agent_name}] Response body: {e.response.text[:500]}")
            # Fallback to placeholder if API call fails
            error_msg = f'{{"score": 50.0, "details": "Error calling GigaChat: {str(e)}"}}'
            logger.warning(f"[{self.agent_name}] Returning fallback response: {error_msg}")
            return error_msg
        except Exception as e:
            logger.error(f"[{self.agent_name}] Unexpected error: {str(e)}", exc_info=True)
            # Fallback to placeholder if API call fails
            error_msg = f'{{"score": 50.0, "details": "Error calling GigaChat: {str(e)}"}}'
            logger.warning(f"[{self.agent_name}] Returning fallback response: {error_msg}")
            return error_msg

