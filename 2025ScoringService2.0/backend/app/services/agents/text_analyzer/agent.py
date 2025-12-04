from typing import Dict, Any
from sqlalchemy.orm import Session
from app.services.agents.base.mcp_agent import MCPAgent
import json
import logging

logger = logging.getLogger(__name__)


class TextAnalyzerAgent(MCPAgent):
    """Agent for analyzing text quality, structure, and clarity"""
    
    def __init__(self, db: Session):
        super().__init__(db, "text_analyzer")
    
    def analyze(self, text: str) -> Dict[str, Any]:
        """Analyze text quality and structure"""
        logger.info(f"[{self.agent_name}] Starting analysis. Text length: {len(text)} chars")
        
        prompt_template = self.config["prompts"].get(
            "analysis_prompt",
            f"""Analyze the following startup pitch text for quality, structure, and clarity.
            
Text:
{{text}}

Provide a JSON response with:
- score: float (0-100) - overall text quality score
- clarity: float (0-100) - how clear and understandable the text is
- structure: float (0-100) - how well structured the text is
- completeness: float (0-100) - how complete the information is
- details: string - brief analysis summary

Return only valid JSON."""
        )
        # Format prompt with actual text
        prompt = prompt_template.format(text=text)
        
        logger.info(f"[{self.agent_name}] Prompt prepared. Calling MCP...")
        # Call MCP server
        response = self._call_mcp(prompt)
        logger.info(f"[{self.agent_name}] MCP response received. Length: {len(response)} chars")
        
        try:
            result = json.loads(response)
            logger.info(f"[{self.agent_name}] JSON parsed successfully. Score: {result.get('score', 'N/A')}")
            parsed_result = {
                "score": result.get("score", 50.0),
                "clarity": result.get("clarity", 50.0),
                "structure": result.get("structure", 50.0),
                "completeness": result.get("completeness", 50.0),
                "details": result.get("details", "Analysis completed")
            }
            logger.info(f"[{self.agent_name}] Analysis complete. Result: {parsed_result}")
            return parsed_result
        except json.JSONDecodeError as e:
            logger.error(f"[{self.agent_name}] JSON parsing failed: {str(e)}")
            logger.error(f"[{self.agent_name}] Raw response: {response[:500]}")
            # Fallback if JSON parsing fails
            return {
                "score": 50.0,
                "clarity": 50.0,
                "structure": 50.0,
                "completeness": 50.0,
                "details": "Analysis completed with default scores"
            }

